import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, StyleSheet, Animated, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  isRecording: boolean;
  isDisabled: boolean;
  onPressIn: () => void;
  onPressOut: () => void;
}

export default function VoiceButton({ isRecording, isDisabled, onPressIn, onPressOut }: Props) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseLoop = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (isRecording) {
      pulseLoop.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.3, duration: 600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      );
      pulseLoop.current.start();
    } else {
      pulseLoop.current?.stop();
      pulseAnim.setValue(1);
    }
  }, [isRecording]);

  return (
    <TouchableOpacity
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={styles.container}
    >
      {isRecording && (
        <Animated.View
          style={[
            styles.pulse,
            { transform: [{ scale: pulseAnim }], opacity: 0.3 },
          ]}
        />
      )}
      <View style={[styles.button, isRecording && styles.buttonRecording, isDisabled && styles.buttonDisabled]}>
        <Ionicons
          name={isRecording ? 'radio-button-on' : 'mic-outline'}
          size={20}
          color={isRecording ? '#fff' : isDisabled ? '#9CA3AF' : '#6366F1'}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulse: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EF4444',
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF0FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRecording: {
    backgroundColor: '#EF4444',
  },
  buttonDisabled: {
    backgroundColor: '#F3F4F6',
  },
});
