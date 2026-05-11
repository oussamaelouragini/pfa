import mongoose, { Document, Schema } from 'mongoose';

export interface IToolCall {
  id: string;
  name: string;
  arguments: Record<string, any>;
}

export interface IMessage {
  role: 'user' | 'assistant' | 'tool' | 'system';
  content: string;
  toolCallId?: string;
  toolName?: string;
  toolCalls?: IToolCall[];
  timestamp: Date;
}

export interface IPendingAction {
  toolName: string;
  args: Record<string, any>;
  confirmationMessage: string;
  rawToolCallId: string;
}

export interface IConversation extends Document {
  userId: mongoose.Types.ObjectId;
  messages: IMessage[];
  detectedLanguage: string;
  userContext: {
    preferredLanguage?: string;
    financialGoals?: string[];
    notes?: string;
  };
  pendingAction?: IPendingAction;
  lastActivity: Date;
}

const ToolCallSchema = new Schema<IToolCall>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    arguments: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: false }
);

const MessageSchema = new Schema<IMessage>(
  {
    role: {
      type: String,
      enum: ['user', 'assistant', 'tool', 'system'],
      required: true,
    },
    content: { type: String, default: '' },
    toolCallId: { type: String },
    toolName: { type: String },
    toolCalls: { type: [ToolCallSchema] },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ConversationSchema = new Schema<IConversation>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    messages: { type: [MessageSchema], default: [] },
    detectedLanguage: { type: String, default: 'en' },
    userContext: {
      preferredLanguage: { type: String },
      financialGoals: { type: [String], default: [] },
      notes: { type: String },
    },
    pendingAction: {
      toolName: { type: String },
      args: { type: Schema.Types.Mixed },
      confirmationMessage: { type: String },
      rawToolCallId: { type: String },
    },
    lastActivity: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IConversation>('Conversation', ConversationSchema);
