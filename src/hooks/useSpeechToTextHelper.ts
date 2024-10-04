import 'regenerator-runtime/runtime';

import { useState } from 'react';
import { useSpeechRecognition } from 'react-speech-recognition';

export function useSpeechToTextHelper() {
  const [error, setError] = useState<string | null>(null);

  const {
    browserSupportsSpeechRecognition,
    listening,
    resetTranscript,
    transcript
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    setError('Your browser does not support speech recognition');
  }

  return {
    error,
    listening,
    resetTranscript,
    transcript
  };
}
