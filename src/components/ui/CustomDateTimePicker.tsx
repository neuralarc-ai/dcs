'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
import { CustomCalendar } from './CustomCalendar';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CustomDateTimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  time: string;
  setTime: (time: string) => void;
}

export function CustomDateTimePicker({ date, setDate, time, setTime }: CustomDateTimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleDateSelect = (selectedDate: Date) => {
    setDate(selectedDate);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex flex-col gap-2 flex-1">
        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Date
        </Label>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal border-gray-200 hover:bg-gray-50 hover:text-gray-900",
                !date && "text-gray-500"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CustomCalendar
              value={date}
              onChange={handleDateSelect}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col gap-2 sm:w-32">
        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Time
        </Label>
        <div className="relative">
          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
    </div>
  );
}

