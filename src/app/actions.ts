
'use server';

import { z } from 'zod';
import { creativeTranslation } from '@/ai/flows/creative-translation';
import { translateAndAnalyzeSentiment } from '@/ai/flows/translate-and-analyze-sentiment';

const FormSchema = z.object({
  text: z.string().min(1, 'Text to translate cannot be empty.').max(5000, 'Text must be 5000 characters or less.'),
  targetLanguage: z.string(),
  targetAudience: z.string(),
  desiredTone: z.string(),
});

export type TranslationResult = {
  translation: string;
  originalSentiment: { sentiment: string; score: number };
  translatedSentiment: { sentiment: string; score: number };
};

export async function getCreativeTranslationAndAnalysis(
  values: z.infer<typeof FormSchema>
): Promise<{ data: TranslationResult | null; error: string | null }> {
  const validatedFields = FormSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      data: null,
      error: 'Invalid input. Please check the form fields.',
    };
  }

  const { text, targetLanguage, targetAudience, desiredTone } = validatedFields.data;
  
  const sourceLanguage = 'English'; // Assume source is English for this implementation

  try {
    // Step 1: Get creative translation
    const creativeResult = await creativeTranslation({
      text,
      sourceLanguage,
      targetLanguage,
      targetAudience,
      desiredTone,
    });

    if (!creativeResult?.translatedText) {
      throw new Error('Creative translation failed to produce a result.');
    }
    const translatedText = creativeResult.translatedText;

    // Step 2 & 3: Get sentiment for original and translated text in parallel
    const [originalAnalysis, translatedAnalysis] = await Promise.all([
      translateAndAnalyzeSentiment({ text: text, targetLanguage: sourceLanguage }),
      translateAndAnalyzeSentiment({ text: translatedText, targetLanguage: targetLanguage }),
    ]);

    if (!originalAnalysis?.originalTextSentiment) {
        throw new Error('Analysis of original text failed.');
    }
    if (!translatedAnalysis?.originalTextSentiment) {
        throw new Error('Analysis of translated text failed.');
    }

    const result: TranslationResult = {
      translation: translatedText,
      originalSentiment: originalAnalysis.originalTextSentiment,
      // We use originalTextSentiment from the second call because its input was our translated text
      translatedSentiment: translatedAnalysis.originalTextSentiment,
    };

    return { data: result, error: null };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
    return { data: null, error: `Translation and analysis failed: ${errorMessage}` };
  }
}
