'use server';

/**
 * @fileOverview A creative translation AI agent. This flow translates text from one language to another, 
 * adapting the translation based on specified preferences such as target audience and desired tone.
 *
 * - creativeTranslation - A function that handles the creative translation process.
 * - CreativeTranslationInput - The input type for the creativeTranslation function.
 * - CreativeTranslationOutput - The return type for the creativeTranslation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreativeTranslationInputSchema = z.object({
  text: z.string().describe('The text to be translated.'),
  sourceLanguage: z.string().describe('The language of the input text.'),
  targetLanguage: z.string().describe('The desired language for the translated text.'),
  targetAudience: z.string().describe('The target audience for the translation (e.g., children, professionals).'),
  desiredTone: z.string().describe('The desired tone of the translation (e.g., formal, informal, friendly).'),
});

export type CreativeTranslationInput = z.infer<typeof CreativeTranslationInputSchema>;

const AdaptationSchema = z.object({
    score: z.number().describe('A score from 0.0 to 1.0 indicating how well the translation meets the requirement.'),
    justification: z.string().describe('A brief explanation for the score provided.'),
});

const CreativeTranslationOutputSchema = z.object({
  translatedText: z.string().describe('The translated text, adapted to the specified preferences.'),
  audienceAdaptation: AdaptationSchema.describe('An analysis of how well the translation is adapted for the target audience.'),
  toneAdaptation: AdaptationSchema.describe('An analysis of how well the translation captures the desired tone.'),
});

export type CreativeTranslationOutput = z.infer<typeof CreativeTranslationOutputSchema>;

export async function creativeTranslation(input: CreativeTranslationInput): Promise<CreativeTranslationOutput> {
  return creativeTranslationFlow(input);
}

const creativeTranslationPrompt = ai.definePrompt({
  name: 'creativeTranslationPrompt',
  input: {schema: CreativeTranslationInputSchema},
  output: {schema: CreativeTranslationOutputSchema},
  prompt: `Translate the following text from {{sourceLanguage}} to {{targetLanguage}}. 

Your primary task is to adapt the translation to suit a target audience of **{{targetAudience}}** and a desired tone of **{{desiredTone}}**.

After translating, you must evaluate your own work. Provide a score from 0.0 to 1.0 and a justification for both how well you adapted to the audience and how well you captured the tone.

Text to translate: {{{text}}}`,
});

const creativeTranslationFlow = ai.defineFlow(
  {
    name: 'creativeTranslationFlow',
    inputSchema: CreativeTranslationInputSchema,
    outputSchema: CreativeTranslationOutputSchema,
  },
  async input => {
    const {output} = await creativeTranslationPrompt(input);
    return output!;
  }
);
