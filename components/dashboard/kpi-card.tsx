"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export interface KpiCardProps {
  title: string;
  value: number | string;
  target: number;
  unit?: string;
  description?: string;
  className?: string;
  progressColor?: string;
}

export function KpiCard({
  title,
  value,
  target,
  unit = "",
  description,
  className,
  progressColor = "bg-primary",
}: KpiCardProps) {
  // Calculate progress percentage
  const numericValue = typeof value === "string" ? parseFloat(value) : value;
  const percentage = Math.min(Math.round((numericValue / target) * 100), 100);
  
  // Determine status color based on percentage
  const getStatusColor = () => {
    if (percentage < 50) return "text-red-500";
    if (percentage < 75) return "text-amber-500";
    return "text-emerald-500";
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-bold">
            {value}
            {unit && <span className="ml-1 text-sm font-normal text-muted-foreground">{unit}</span>}
          </div>
          <div className={cn("text-sm font-medium", getStatusColor())}>
            {percentage}% of {target}
            {unit && unit}
          </div>
        </div>
        <div className="mt-4">
          <Progress 
            value={percentage} 
            className="h-2" 
            indicatorClassName={progressColor}
          />
        </div>
      </CardContent>
    </Card>
  );
}