import React, { useRef, useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import ScreenWrapper from '@/core/components/ScreenWrapper';
import Header from '@/core/components/Header';
import { useAIChat, ChatMessage } from '../hooks/useAIChat';
import MessageBubble from '../components/ai/MessageBubble';
import VoiceButton from '../components/ai/VoiceButton';
import ConfirmationCard from '../components/ai/ConfirmationCard';

const QUICK_ACTIONS = [
  { label: '📊 This month', message: "How much did I spend this month?" },
  { label: '➕ Add expense', message: "I want to add an expense" },
  { label: '💰 Balance', message: "What's my current balance?" },
  { label: '📈 Insights', message: "Give me spending insights" },
];

export default function AIChatScreen() {
  const router = useRouter();
  const {
    messages,
    isLoading,
    isRecording,
    hasPendingAction,
    send,
    confirm,
    startVoiceRecording,
    stopVoiceRecording,
    clearChat,
  } = useAIChat();

  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  }, []);

  const handleSend = useCallback(async () => {
    if (!inputText.trim() || isLoading) return;
    const text = inputText.trim();
    setInputText('');
    await send(text);
    scrollToBottom();
  }, [inputText, isLoading, send, scrollToBottom]);

  const handleQuickAction = useCallback(
    (message: string) => {
      send(message);
      scrollToBottom();
    },
    [send, scrollToBottom]
  );

  const handleClearChat = useCallback(() => {
    Alert.alert('Clear Conversation', 'This will delete all chat history. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: clearChat },
    ]);
  }, [clearChat]);

  const renderMessage = useCallback(
    ({ item }: { item: ChatMessage }) => {
      if (item.type === 'confirmation_required' && item.role === 'assistant' && hasPendingAction) {
        return (
          <ConfirmationCard
            message={item.pendingAction?.confirmationMessage || item.content}
            onConfirm={() => confirm(true)}
            onCancel={() => confirm(false)}
            isLoading={isLoading}
          />
        );
      }
      return <MessageBubble message={item} />;
    },
    [hasPendingAction, isLoading, confirm]
  );

  const renderQuickActions = () => {
    if (messages.length > 1) return null;
    return (
      <View style={styles.quickActionsRow}>
        {QUICK_ACTIONS.map((action) => (
          <TouchableOpacity
            key={action.label}
            style={styles.quickAction}
            onPress={() => handleQuickAction(action.message)}
            activeOpacity={0.7}
          >
            <Text style={styles.quickActionText}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <ScreenWrapper backgroundColor="#FAFAFA" edges={["top", "left", "right"]}>
      <Header
        showBack
        center={
          <View style={styles.headerCenter}>
            <View style={styles.aiAvatar}>
              <Ionicons name="sparkles" size={16} color="#fff" />
            </View>
            <View>
              <Text style={styles.headerTitle}>Financial Copilot</Text>
              <Text style={styles.headerSubtitle}>
                {isLoading ? 'Thinking...' : isRecording ? 'Listening...' : 'Online'}
              </Text>
            </View>
          </View>
        }
        right={
          <TouchableOpacity onPress={handleClearChat} style={styles.clearBtn}>
            <Ionicons name="refresh-outline" size={20} color="#6B7280" />
          </TouchableOpacity>
        }
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={scrollToBottom}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            isLoading && !hasPendingAction ? (
              <View style={styles.typingIndicator}>
                <View style={styles.typingBubble}>
                  <ActivityIndicator size="small" color="#6366F1" />
                  <Text style={styles.typingText}>Thinking...</Text>
                </View>
              </View>
            ) : null
          }
          ListHeaderComponent={renderQuickActions}
        />

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder={
                isRecording
                  ? 'Release to send voice...'
                  : hasPendingAction
                  ? 'Confirm or cancel above...'
                  : 'Ask anything about your finances...'
              }
              placeholderTextColor="#9CA3AF"
              multiline
              maxLength={2000}
              editable={!isRecording && !hasPendingAction}
              returnKeyType="send"
              onSubmitEditing={handleSend}
            />
          </View>

          <VoiceButton
            isRecording={isRecording}
            isDisabled={isLoading && !isRecording}
            onPressIn={startVoiceRecording}
            onPressOut={stopVoiceRecording}
          />

          <TouchableOpacity
            style={[
              styles.sendButton,
              (!inputText.trim() || isLoading || isRecording || hasPendingAction) && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!inputText.trim() || isLoading || isRecording || hasPendingAction}
            activeOpacity={0.8}
          >
            <Ionicons
              name="send"
              size={18}
              color={(!inputText.trim() || isLoading || isRecording) ? '#9CA3AF' : '#fff'}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  aiAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6366F1',
    fontWeight: '500',
  },
  clearBtn: {
    padding: 8,
  },
  messageList: {
    paddingVertical: 12,
    flexGrow: 1,
  },
  quickActionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  quickAction: {
    backgroundColor: '#EFF0FF',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  quickActionText: {
    fontSize: 13,
    color: '#4F46E5',
    fontWeight: '500',
  },
  typingIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'flex-start',
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8FF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: '#EBEBFF',
  },
  typingText: {
    fontSize: 13,
    color: '#6366F1',
    fontStyle: 'italic',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: 8,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    maxHeight: 100,
  },
  textInput: {
    fontSize: 15,
    color: '#1F2937',
    lineHeight: 20,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
});
