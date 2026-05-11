import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

export default function ConfirmationCard({ message, onConfirm, onCancel, isLoading }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="alert-circle-outline" size={18} color="#F59E0B" />
        <Text style={styles.headerText}>Confirmation Required</Text>
      </View>

      <Text style={styles.message}>{message}</Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.btn, styles.btnCancel]}
          onPress={onCancel}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <Ionicons name="close" size={16} color="#6B7280" />
          <Text style={styles.btnCancelText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.btnConfirm, isLoading && styles.btnDisabled]}
          onPress={onConfirm}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <Ionicons name="checkmark" size={16} color="#fff" />
          <Text style={styles.btnConfirmText}>{isLoading ? 'Processing...' : 'Confirm'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 12,
    marginVertical: 6,
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
    elevation: 2,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
  },
  message: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
    marginBottom: 14,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  btnCancel: {
    backgroundColor: '#F3F4F6',
  },
  btnCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  btnConfirm: {
    backgroundColor: '#6366F1',
  },
  btnConfirmText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  btnDisabled: {
    opacity: 0.6,
  },
});
