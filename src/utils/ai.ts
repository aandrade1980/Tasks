import { HfInference } from '@huggingface/inference';
import { HuggingFaceStream } from 'ai';

// Create a new HuggingFace Inference instance
const Hf = new HfInference(import.meta.env.VITE_HUGGINGFACE_KEY);

export const runtime = 'edge';

export const callAI = async (prompt: string) => {
  const response = Hf.textGenerationStream({
    model: 'OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5',
    input: `<|prompter|>${prompt}<|endoftext|><|assistant|>`,
    parameters: {
      x_new_tokens: 150,
      typical_p: 0.2,
      repetition_penalty: 1,
      truncate: 1000,
      return_full_text: false
    }
  });

  const stream = HuggingFaceStream(response);

  return new Response(stream);
};
