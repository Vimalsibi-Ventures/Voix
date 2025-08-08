import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: "AIzaSyDVoRoOPMAN37v_igwWnwNKt9RzlMruJ_I"
    })
  ],
  model: 'googleai/gemini-2.0-flash',
});