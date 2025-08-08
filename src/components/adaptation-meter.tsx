'use client';

import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Info, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface AdaptationMeterProps {
  label: string;
  score?: number;
  justification?: string;
  isLoading: boolean;
}

export function AdaptationMeter({ label, score, justification, isLoading }: AdaptationMeterProps) {
  if (isLoading) {
    return (
      <div className="space-y-2 mt-4">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-2 w-full" />
      </div>
    );
  }

  if (typeof score === 'undefined' || !justification) {
    return null;
  }

  let Icon;
  let colorClass;

  if (score >= 0.8) {
    Icon = CheckCircle;
    colorClass = 'bg-chart-2'; // Green
  } else if (score >= 0.5) {
    Icon = AlertCircle;
    colorClass = 'bg-chart-4'; // Yellow
  } else {
    Icon = XCircle;
    colorClass = 'bg-chart-1'; // Red
  }

  return (
    <div className="mt-4 space-y-1 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-5 w-5" />
        <span className="font-bold text-foreground">{label}</span>
        <span className="font-mono text-xs">({score.toFixed(2)})</span>
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <Info className="h-4 w-4 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                    <p className="max-w-xs">{justification}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
      </div>
      <Progress value={score * 100} className="h-2" indicatorClassName={cn(colorClass)} />
    </div>
  );
}
