import { MicrophoneIcon, XCircleIcon } from '@heroicons/react/24/solid';
import SpeechRecognition from 'react-speech-recognition';

import { useSpeechToTextHelper } from '../hooks/useSpeechToTextHelper';
import Button from './Button';

type SpeakerProps = {
  handleClear: () => void;
};

export default function Speaker({ handleClear }: SpeakerProps) {
  const { error, listening } = useSpeechToTextHelper();

  const handleSpeech = () => SpeechRecognition.startListening();

  return (
    <div>
      {error ? <p>{error}</p> : null}
      <div className="flex gap-2 py-1 items-center text-center justify-center">
        <span className="font-medium">{listening ? 'Mic on' : 'Mic off'}</span>
        <Button
          handleClick={handleSpeech}
          extraBtnClasses={`${listening ? 'bg-lightOk' : 'bg-red-400'}`}
          title="Start"
        >
          <MicrophoneIcon height={24} />
        </Button>
        <Button
          handleClick={handleClear}
          title="Reset"
          extraBtnClasses="bg-light"
          type="reset"
        >
          <XCircleIcon height={24} />
        </Button>
      </div>
    </div>
  );
}
