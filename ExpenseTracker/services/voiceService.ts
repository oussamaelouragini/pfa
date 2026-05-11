import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

let recording: Audio.Recording | null = null;

export async function requestMicrophonePermission(): Promise<boolean> {
  const { status } = await Audio.requestPermissionsAsync();
  return status === 'granted';
}

export async function startRecording(): Promise<void> {
  if (recording) {
    await stopRecording();
  }

  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true,
  });

  const { recording: newRecording } = await Audio.Recording.createAsync(
    Audio.RecordingOptionsPresets.HIGH_QUALITY
  );

  recording = newRecording;
}

export async function stopRecording(): Promise<string | null> {
  if (!recording) return null;

  try {
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    recording = null;

    await Audio.setAudioModeAsync({ allowsRecordingIOS: false });

    return uri || null;
  } catch {
    recording = null;
    return null;
  }
}

export function isRecording(): boolean {
  return recording !== null;
}

export async function cleanupAudio(uri: string): Promise<void> {
  try {
    const info = await FileSystem.getInfoAsync(uri);
    if (info.exists) {
      await FileSystem.deleteAsync(uri, { idempotent: true });
    }
  } catch {
    // Non-critical cleanup
  }
}
