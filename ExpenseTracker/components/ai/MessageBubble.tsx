import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ChatMessage } from '../../hooks/useAIChat';

interface Props {
  message: ChatMessage;
}

function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user';
  const isError = message.type === 'error';
  const isSending = message.status === 'sending';
  const isActionCompleted = message.type === 'action_completed';

  return (
    <View style={[styles.wrapper, isUser ? styles.wrapperUser : styles.wrapperAssistant]}>
      {!isUser && (
        <View style={styles.avatar}>
          <Ionicons name="sparkles" size={16} color="#fff" />
        </View>
      )}

      <View style={[
        styles.bubble,
        isUser ? styles.bubbleUser : styles.bubbleAssistant,
        isError && styles.bubbleError,
        isActionCompleted && styles.bubbleSuccess,
      ]}>
        {isSending ? (
          <View style={styles.sendingRow}>
            <ActivityIndicator size="small" color={isUser ? '#fff' : '#6366F1'} />
            <Text style={[styles.text, isUser ? styles.textUser : styles.textAssistant, { marginLeft: 8 }]}>
              {message.content}
            </Text>
          </View>
        ) : (
          <>
            {isActionCompleted && (
              <View style={styles.actionBadge}>
                <Ionicons name="checkmark-circle" size={14} color="#16A34A" />
                <Text style={styles.actionBadgeText}>Action completed</Text>
              </View>
            )}
            <Text style={[styles.text, isUser ? styles.textUser : styles.textAssistant]}>
              {message.content}
            </Text>
          </>
        )}

        <Text style={[styles.timestamp, isUser ? styles.timestampUser : styles.timestampAssistant]}>
          {formatTime(message.timestamp)}
          {message.status === 'error' && ' • Failed'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingHorizontal: 12,
    alignItems: 'flex-end',
  },
  wrapperUser: {
    justifyContent: 'flex-end',
  },
  wrapperAssistant: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 2,
  },
  bubble: {
    maxWidth: '78%',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  bubbleUser: {
    backgroundColor: '#6366F1',
    borderBottomRightRadius: 4,
  },
  bubbleAssistant: {
    backgroundColor: '#F8F8FF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#EBEBFF',
  },
  bubbleError: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  bubbleSuccess: {
    backgroundColor: '#F0FDF4',
    borderColor: '#86EFAC',
    borderWidth: 1,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
  },
  textUser: {
    color: '#FFFFFF',
  },
  textAssistant: {
    color: '#1F2937',
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
  },
  timestampUser: {
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'right',
  },
  timestampAssistant: {
    color: '#9CA3AF',
  },
  sendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 4,
  },
  actionBadgeText: {
    fontSize: 11,
    color: '#16A34A',
    fontWeight: '600',
  },
});
