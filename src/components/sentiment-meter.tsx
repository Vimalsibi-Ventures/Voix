
'use client';

import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Smile, Frown, Meh } from 'lucide-react';

interface SentimentMeterProps {
  sentiment?: string;
  score?: number;
  isLoading: boolean;
}

export function SentimentMeter({ sentiment, score, isLoading }: SentimentMeterProps) {
  if (isLoading) {
    return (
      <div className="space-y-2 mt-4">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-2 w-full" />
      </div>
    );
  }

  if (!sentiment || typeof score === 'undefined') {
    return null;
  }

  const sentimentLower = sentiment.toLowerCase();
  
  const Icon = sentimentLower.includes('positive')
    ? Smile
    : sentimentLower.includes('negative')
    ? Frown
    : Meh;

  const colorClass = sentimentLower.includes('positive')
    ? 'bg-chart-2'
    : sentimentLower.includes('negative')
    ? 'bg-chart-1'
    : 'bg-chart-3';

  return (
    <div className="mt-4 space-y-1 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-5 w-5" />
        <span className="font-bold text-foreground capitalize">{sentiment}</span>
        <span className="font-mono text-xs">({score.toFixed(2)})</span>
      </div>
      <Progress value={score * 100} className="h-2" indicatorClassName={cn(colorClass)} />
    </div>
  );
}
