import { useAudioRecorder, useAudioRecorderState, RecordingPresets, requestRecordingPermissionsAsync, setAudioModeAsync } from 'expo-audio';

export function useVoiceRecorder() {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const state = useAudioRecorderState(recorder);

  const requestPermission = async (): Promise<boolean> => {
    try {
      const { granted } = await requestRecordingPermissionsAsync();
      return granted;
    } catch {
      return false;
    }
  };

  const startRecording = async () => {
    await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
    await recorder.prepareToRecordAsync();
    recorder.record();
  };

  const stopRecording = async (): Promise<string | null> => {
    try {
      await recorder.stop();
      return recorder.uri;
    } catch {
      return null;
    }
  };

  return {
    isRecording: state.isRecording,
    requestPermission,
    startRecording,
    stopRecording,
  };
}
