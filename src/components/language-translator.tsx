
'use client';

import * as React from 'react';
import { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ArrowRightLeft, Loader2, Sparkles } from 'lucide-react';
import { getCreativeTranslationAndAnalysis, type TranslationResult } from '@/app/actions';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { SentimentMeter } from './sentiment-meter';

const FormSchema = z.object({
  text: z.string().min(1, 'Text to translate cannot be empty.').max(5000, 'Text must be 5000 characters or less.'),
  sourceLanguage: z.string({ required_error: 'Please select a language.' }),
  targetLanguage: z.string({ required_error: 'Please select a language.' }),
  targetAudience: z.string({ required_error: 'Please select an audience.' }),
  desiredTone: z.string({ required_error: 'Please select a tone.' }),
});

const allLanguages = [
    { value: 'English', label: 'English' },
    { value: 'Spanish', label: 'Spanish' },
    { value: 'French', label: 'French' },
    { value: 'German', label: 'German' },
    { value: 'Japanese', label: 'Japanese' },
    { value: 'Italian', label: 'Italian' },
    { value: 'Portuguese', label: 'Portuguese' },
    { value: 'Chinese (Simplified)', label: 'Chinese (Simplified)' },
    { value: 'Russian', label: 'Russian' },
    { value: 'Arabic', label: 'Arabic' },
    { value: 'Hindi', label: 'Hindi' },
    { value: 'Korean', label: 'Korean' },
    { value: 'Dutch', label: 'Dutch' },
    { value: 'Indonesian', label: 'Indonesian' },
    { value: 'Bengali', label: 'Bengali' },
    { value: 'Urdu', label: 'Urdu' },
    { value: 'Turkish', label: 'Turkish' },
    { value: 'Vietnamese', label: 'Vietnamese' },
    { value: 'Thai', label: 'Thai' },
    { value: 'Polish', label: 'Polish' },
    { value: 'Ukrainian', label: 'Ukrainian' },
    { value: 'Swedish', label: 'Swedish' },
    { value: 'Greek', label: 'Greek' },
    { value: 'Hebrew', label: 'Hebrew' },
    { value: 'Swahili', label: 'Swahili' },
];

const audiences = [
  { value: 'General', label: 'General' },
  { value: 'Children', label: 'Children' },
  { value: 'Teenagers', label: 'Teenagers' },
  { value: 'Young Adults', label: 'Young Adults' },
  { value: 'Professionals', label: 'Professionals' },
  { value: 'Academics', label: 'Academics' },
  { value: 'Experts', label: 'Experts' },
  { value: 'Tourists', label: 'Tourists' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Scientists', label: 'Scientists' },
  { value: 'Gamers', label: 'Gamers' },
  { value: 'Social Media Users', label: 'Social Media Users' },
  { value: 'Legal Professionals', label: 'Legal Professionals' },
  { value: 'Medical Professionals', label: 'Medical Professionals' },
  { value: 'Government Officials', label: 'Government Officials' },
];

const tones = [
  { value: 'Neutral', label: 'Neutral' },
  { value: 'Formal', label: 'Formal' },
  { value: 'Informal', label: 'Informal' },
  { value: 'Friendly', label: 'Friendly' },
  { value: 'Poetic', label: 'Poetic' },
  { value: 'Humorous', label: 'Humorous' },
  { value: 'Assertive', label: 'Assertive' },
  { value: 'Empathetic', label: 'Empathetic' },
  { value: 'Technical', label: 'Technical' },
  { value: 'Sarcastic', label: 'Sarcastic' },
  { value: 'Confident', label: 'Confident' },
  { value: 'Inspirational', label: 'Inspirational' },
  { value: 'Cautionary', label: 'Cautionary' },
  { value: 'Critical', label: 'Critical' },
  { value: 'Enthusiastic', label: 'Enthusiastic' },
  { value: 'Dramatic', label: 'Dramatic' },
  { value: 'Romantic', label: 'Romantic' },
];

export function LanguageTranslator() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [result, setResult] = useState<TranslationResult | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      text: '',
      sourceLanguage: 'English',
      targetLanguage: 'Spanish',
      targetAudience: 'General',
      desiredTone: 'Neutral',
    },
  });

  const sourceLanguage = form.watch('sourceLanguage');
  const targetLanguage = form.watch('targetLanguage');

  const availableTargetLanguages = allLanguages.filter(lang => lang.value !== sourceLanguage);
  const availableSourceLanguages = allLanguages.filter(lang => lang.value !== targetLanguage);

  React.useEffect(() => {
    // This effect ensures that the source and target languages are never the same.
    // If a user changes the source language to be the same as the target,
    // it finds the next available language for the target.
    if (sourceLanguage === targetLanguage) {
      const newTarget = allLanguages.find(lang => lang.value !== sourceLanguage)?.value;
      if (newTarget) {
        form.setValue('targetLanguage', newTarget, { shouldValidate: true });
      }
    }
  }, [sourceLanguage, targetLanguage, form]);


  function swapLanguages() {
    const currentSource = form.getValues('sourceLanguage');
    const currentTarget = form.getValues('targetLanguage');
    const currentText = form.getValues('text');

    // Swap the language selections
    form.setValue('sourceLanguage', currentTarget);
    form.setValue('targetLanguage', currentSource);
    
    // Swap the text content
    form.setValue('text', result?.translation || '');

    // Swap the results in the state
    setResult(currentText ? {
        translation: currentText,
        originalSentiment: result?.translatedSentiment || { sentiment: 'neutral', score: 0.5},
        translatedSentiment: result?.originalSentiment || { sentiment: 'neutral', score: 0.5},
    } : null);
  }


  function onSubmit(values: z.infer<typeof FormSchema>) {
    setResult(null);
    startTransition(async () => {
      const { data, error } = await getCreativeTranslationAndAnalysis(values);
      if (error) {
        toast({
          title: 'Error',
          description: error,
          variant: 'destructive',
        });
        return;
      }
      setResult(data);
    });
  }

  return (
    <Card className="w-full max-w-5xl mx-auto shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-3xl">Creative Language Translator</CardTitle>
        <CardDescription>
          Adapt text between languages and writing styles, preserving meaning, tone, and stylistic subtleties.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="targetAudience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Audience</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select an audience" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {audiences.map((aud) => <SelectItem key={aud.value} value={aud.value}>{aud.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="desiredTone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desired Tone</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select a tone" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tones.map((tone) => <SelectItem key={tone.value} value={tone.value}>{tone.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
              <FormField
                control={form.control}
                name="sourceLanguage"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>From</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select a language" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableSourceLanguages.map((lang) => <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="button" variant="ghost" size="icon" className="self-end" onClick={swapLanguages} aria-label="Swap languages">
                  <ArrowRightLeft className="h-5 w-5 text-muted-foreground" />
              </Button>

              <FormField
                control={form.control}
                name="targetLanguage"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>To</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select a language" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableTargetLanguages.map((lang) => <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Original Text</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter text to translate..."
                          className="min-h-[200px] resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <SentimentMeter
                    isLoading={isPending && !result}
                    sentiment={result?.originalSentiment.sentiment}
                    score={result?.originalSentiment.score}
                  />
              </div>
              <div className="space-y-2">
                <FormLabel>Translated Text</FormLabel>
                <div className="w-full min-h-[200px] rounded-md border border-input bg-secondary/50 p-3 text-sm">
                  {isPending && <div className="flex items-center justify-center h-full text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Translating...</div>}
                  {!isPending && !result && <div className="flex items-center justify-center h-full text-muted-foreground">Your translation will appear here.</div>}
                  {result && <p className="whitespace-pre-wrap">{result.translation}</p>}
                </div>
                <SentimentMeter
                    isLoading={isPending && !result}
                    sentiment={result?.translatedSentiment.sentiment}
                    score={result?.translatedSentiment.score}
                  />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button type="submit" disabled={isPending} className="w-full md:w-auto">
              {isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait</>
              ) : (
                <><Sparkles className="mr-2 h-4 w-4" /> Translate</>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
