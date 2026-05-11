import Conversation, { IMessage, IPendingAction } from '../models/conversation';

const MAX_CONTEXT_MESSAGES = 20;

export async function getOrCreateConversation(userId: string) {
  let conversation = await Conversation.findOne({ userId });
  if (!conversation) {
    conversation = new Conversation({ userId, messages: [] });
    await conversation.save();
  }
  return conversation;
}

export async function getContextMessages(userId: string): Promise<IMessage[]> {
  const conv = await Conversation.findOne({ userId });
  if (!conv || !conv.messages.length) return [];
  // Return the most recent N messages for context window
  return conv.messages.slice(-MAX_CONTEXT_MESSAGES);
}

export async function appendMessage(userId: string, message: IMessage): Promise<void> {
  await Conversation.findOneAndUpdate(
    { userId },
    {
      $push: { messages: message },
      $set: { lastActivity: new Date() },
    },
    { upsert: true }
  );
}

export async function appendMessages(userId: string, messages: IMessage[]): Promise<void> {
  await Conversation.findOneAndUpdate(
    { userId },
    {
      $push: { messages: { $each: messages } },
      $set: { lastActivity: new Date() },
    },
    { upsert: true }
  );
}

export async function setPendingAction(userId: string, action: IPendingAction): Promise<void> {
  await Conversation.findOneAndUpdate(
    { userId },
    { $set: { pendingAction: action } },
    { upsert: true }
  );
}

export async function getPendingAction(userId: string): Promise<IPendingAction | undefined> {
  const conv = await Conversation.findOne({ userId });
  return conv?.pendingAction;
}

export async function clearPendingAction(userId: string): Promise<void> {
  await Conversation.findOneAndUpdate(
    { userId },
    { $unset: { pendingAction: '' } }
  );
}

export async function updateDetectedLanguage(userId: string, language: string): Promise<void> {
  await Conversation.findOneAndUpdate(
    { userId },
    { $set: { detectedLanguage: language } },
    { upsert: true }
  );
}

export async function updateUserContext(
  userId: string,
  context: Partial<{ preferredLanguage: string; financialGoals: string[]; notes: string }>
): Promise<void> {
  const update: Record<string, any> = {};
  if (context.preferredLanguage) update['userContext.preferredLanguage'] = context.preferredLanguage;
  if (context.financialGoals) update['userContext.financialGoals'] = context.financialGoals;
  if (context.notes) update['userContext.notes'] = context.notes;

  await Conversation.findOneAndUpdate({ userId }, { $set: update }, { upsert: true });
}

export async function clearConversation(userId: string): Promise<void> {
  await Conversation.findOneAndUpdate(
    { userId },
    { $set: { messages: [], pendingAction: undefined } }
  );
}

export async function getUserContext(userId: string) {
  const conv = await Conversation.findOne({ userId });
  return {
    preferredLanguage: conv?.userContext?.preferredLanguage,
    financialGoals: conv?.userContext?.financialGoals || [],
    notes: conv?.userContext?.notes,
    detectedLanguage: conv?.detectedLanguage || 'en',
  };
}
