"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface CalendarProps {
  mode?: "single" | "multiple" | "range";
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  className?: string;
}

function Calendar({
  mode = "single",
  selected,
  onSelect,
  className,
}: CalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const handleDateClick = (day: number) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    onSelect?.(date);
  };

  const renderCalendarDays = () => {
    const days = [];
    const totalCells = 42; // 6 weeks * 7 days

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-9 w-9"></div>
      );
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected =
        selected &&
        selected.getDate() === day &&
        selected.getMonth() === currentDate.getMonth() &&
        selected.getFullYear() === currentDate.getFullYear();

      const isToday =
        new Date().getDate() === day &&
        new Date().getMonth() === currentDate.getMonth() &&
        new Date().getFullYear() === currentDate.getFullYear();

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={cn(
            "h-9 w-9 rounded-md text-sm font-normal transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            isSelected && "bg-primary text-primary-foreground",
            isToday && !isSelected && "bg-accent text-accent-foreground"
          )}
        >
          {day}
        </button>
      );
    }

    // Fill remaining cells
    while (days.length < totalCells) {
      days.push(
        <div key={`empty-end-${days.length}`} className="h-9 w-9"></div>
      );
    }

    return days;
  };

  return (
    <div className={cn("p-3", className)}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevMonth}
            className="inline-flex items-center justify-center rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="text-sm font-medium">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </div>
          <button
            onClick={handleNextMonth}
            className="inline-flex items-center justify-center rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {dayNames.map((day) => (
            <div
              key={day}
              className="h-9 w-9 p-0 text-center text-sm font-normal text-muted-foreground"
            >
              {day}
            </div>
          ))}
          {renderCalendarDays()}
        </div>
      </div>
    </div>
  );
}

export { Calendar };
