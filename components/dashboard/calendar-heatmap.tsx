"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, isSameMonth, isSameDay } from "date-fns";

export interface CalendarHeatmapData {
  date: Date;
  value: number;
}

export interface CalendarHeatmapProps {
  title: string;
  description?: string;
  data: CalendarHeatmapData[];
  className?: string;
  colorScale?: string[];
  maxValue?: number;
}

export function CalendarHeatmap({
  title,
  description,
  data,
  className,
  colorScale = ["#f3f4f6", "#dbeafe", "#93c5fd", "#60a5fa", "#3b82f6"],
  maxValue = 10,
}: CalendarHeatmapProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Get the start of the first week (might be in previous month)
  const firstDayOfMonth = startOfMonth(currentMonth);
  const startDate = startOfWeek(firstDayOfMonth);
  
  // Create a 7x6 grid (max possible for a month view with overflow)
  const calendarDays = Array(42)
    .fill(null)
    .map((_, i) => addDays(startDate, i));
  
  // Get color for a specific day based on its value
  const getColorForValue = (day: Date) => {
    const dayData = data.find(d => isSameDay(new Date(d.date), day));
    if (!dayData) return colorScale[0]; // Default color for no data
    
    const value = dayData.value;
    const index = Math.min(
      Math.floor((value / maxValue) * (colorScale.length - 1)),
      colorScale.length - 1
    );
    return colorScale[index];
  };
  
  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  
  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={prevMonth}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0"
            >
              <span className="sr-only">Previous month</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <div className="text-sm font-medium">
              {format(currentMonth, "MMMM yyyy")}
            </div>
            <button
              onClick={nextMonth}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0"
            >
              <span className="sr-only">Next month</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 text-center">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-xs font-medium text-muted-foreground py-1">
              {day}
            </div>
          ))}
          {calendarDays.map((day, i) => {
            const isCurrentMonth = isSameMonth(day, currentMonth);
            return (
              <div
                key={i}
                className={cn(
                  "aspect-square rounded-sm p-1",
                  !isCurrentMonth && "opacity-30"
                )}
              >
                <div
                  className="relative flex h-full w-full items-center justify-center rounded-sm text-xs"
                  style={{ backgroundColor: getColorForValue(day) }}
                  title={`${format(day, "PP")}: ${data.find(d => isSameDay(new Date(d.date), day))?.value || 0}`}
                >
                  <span className={cn(
                    "absolute top-0 left-0 p-0.5 text-[0.6rem]",
                    isCurrentMonth ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {format(day, "d")}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}