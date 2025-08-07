'use server';
/**
 * @fileOverview This file defines a Genkit flow for translating text and analyzing the sentiment of both the original and translated texts.
 *
 * - translateAndAnalyzeSentiment - A function that handles the translation and sentiment analysis process.
 * - TranslateAndAnalyzeSentimentInput - The input type for the translateAndAnalyzeSentiment function.
 * - TranslateAndAnalyzeSentimentOutput - The return type for the translateAndAnalyzeSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateAndAnalyzeSentimentInputSchema = z.object({
  text: z.string().describe('The text to translate and analyze.'),
  targetLanguage: z.string().describe('The language to translate the text to.'),
});
export type TranslateAndAnalyzeSentimentInput = z.infer<
  typeof TranslateAndAnalyzeSentimentInputSchema
>;

const SentimentSchema = z.object({
  sentiment: z.string().describe('The sentiment of the text (e.g., positive, negative, neutral).'),
  score: z.number().describe('A numerical score representing the sentiment strength.'),
});

const TranslateAndAnalyzeSentimentOutputSchema = z.object({
  originalTextSentiment: SentimentSchema.describe('The sentiment analysis of the original text.'),
  translatedText: z.string().describe('The translated text.'),
  translatedTextSentiment: SentimentSchema.describe(
    'The sentiment analysis of the translated text.'
  ),
});
export type TranslateAndAnalyzeSentimentOutput = z.infer<
  typeof TranslateAndAnalyzeSentimentOutputSchema
>;

export async function translateAndAnalyzeSentiment(
  input: TranslateAndAnalyzeSentimentInput
): Promise<TranslateAndAnalyzeSentimentOutput> {
  return translateAndAnalyzeSentimentFlow(input);
}

const translateAndAnalyzeSentimentPrompt = ai.definePrompt({
  name: 'translateAndAnalyzeSentimentPrompt',
  input: {schema: TranslateAndAnalyzeSentimentInputSchema},
  output: {schema: TranslateAndAnalyzeSentimentOutputSchema},
  prompt: `You are an AI assistant that translates text and analyzes the sentiment of both the original and translated texts.

Translate the following text to {{targetLanguage}} and provide a sentiment analysis for both the original and translated texts.

Original Text: {{text}}

Your response should include:
1.  The translated text.
2.  The sentiment analysis of the original text, including sentiment and a score.
3.  The sentiment analysis of the translated text, including sentiment and a score.

Output in JSON format.
`,
});

const translateAndAnalyzeSentimentFlow = ai.defineFlow(
  {
    name: 'translateAndAnalyzeSentimentFlow',
    inputSchema: TranslateAndAnalyzeSentimentInputSchema,
    outputSchema: TranslateAndAnalyzeSentimentOutputSchema,
  },
  async input => {
    const {output} = await translateAndAnalyzeSentimentPrompt(input);
    return output!;
  }
);
