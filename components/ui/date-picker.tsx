'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DatePickerProps {
  mode: 'single' | 'range';
  selected?: Date | undefined;
  onSelect?: (date: Date | undefined) => void;
  className?: string;
}

export function DatePicker({
  mode = 'single',
  selected,
  onSelect,
  className,
}: DatePickerProps) {
  return (
    <div className={cn('grid gap-2', className)}>
      <Calendar
        mode={mode}
        selected={selected}
        onSelect={onSelect}
        className="rounded-md border"
      />
    </div>
  );
}