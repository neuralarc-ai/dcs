'use client';

import * as React from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval 
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CustomCalendarProps {
  value?: Date;
  onChange?: (date: Date) => void;
  className?: string;
}

export function CustomCalendar({ value, onChange, className }: CustomCalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  
  // Jump to selected date when it changes externally
  React.useEffect(() => {
    if (value) {
      setCurrentMonth(value);
    }
  }, [value]);

  const onNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const onPrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between px-2 py-4">
        <span className="text-sm font-semibold text-gray-900">
          {format(currentMonth, 'MMMM yyyy')}
        </span>
        <div className="flex gap-1">
          <button
            onClick={onPrevMonth}
            type="button"
            className="p-1 hover:bg-gray-100 rounded-md text-gray-600 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={onNextMonth}
            type="button"
            className="p-1 hover:bg-gray-100 rounded-md text-gray-600 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const dateFormat = "EEEEE";
    const days = [];
    const startDate = startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-[0.8rem] font-medium text-gray-500 w-9 text-center py-1">
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="flex justify-between mb-2">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        const isSelected = value ? isSameDay(day, value) : false;
        const isCurrentMonth = isSameMonth(day, monthStart);

        days.push(
          <button
            key={day.toString()}
            type="button"
            disabled={!isCurrentMonth}
            onClick={() => onChange && onChange(cloneDay)}
            className={cn(
              "h-9 w-9 p-0 font-normal text-sm rounded-md flex items-center justify-center transition-all relative",
              !isCurrentMonth && "text-gray-300 opacity-50 cursor-default",
              isCurrentMonth && !isSelected && "hover:bg-gray-100 text-gray-900",
              isSelected && "bg-gray-900 text-white hover:bg-gray-800 shadow-sm",
              isSameDay(day, new Date()) && !isSelected && "bg-gray-50 text-gray-900 font-semibold border border-gray-200"
            )}
          >
            {formattedDate}
          </button>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="flex justify-between mt-1">
          {days}
        </div>
      );
      days = [];
    }
    return <div className="flex flex-col">{rows}</div>;
  };

  return (
    <div className={cn("bg-white p-3 w-full max-w-[300px]", className)}>
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
}

