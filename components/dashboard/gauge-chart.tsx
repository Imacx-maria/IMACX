"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export interface GaugeChartProps {
  title: string;
  description?: string;
  value: number;
  target: number;
  min?: number;
  max?: number;
  className?: string;
  size?: number;
  thickness?: number;
  colors?: {
    indicator: string;
    track: string;
    text: string;
  };
  formatValue?: (value: number) => string;
  label?: string;
}

export function GaugeChart({
  title,
  description,
  value,
  target,
  min = 0,
  max = 100,
  className,
  size = 150,
  thickness = 10,
  colors = {
    indicator: "hsl(var(--primary))",
    track: "hsl(var(--muted))",
    text: "hsl(var(--foreground))",
  },
  formatValue = (value) => `${Math.round(value)}%`,
  label,
}: GaugeChartProps) {
  // Normalize value between 0 and 1
  const normalizedValue = Math.min(Math.max((value - min) / (max - min), 0), 1);
  
  // Calculate the angle for the gauge (from -135° to 135°, so 270° total)
  const angle = normalizedValue * 270 - 135;
  
  // Calculate the coordinates for the gauge arc
  const radius = size / 2 - thickness / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference * (1 - normalizedValue * 0.75);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <div className="relative" style={{ width: size, height: size }}>
          {/* Track */}
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="absolute"
          >
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={colors.track}
              strokeWidth={thickness}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={circumference * 0.25} // Only show 270° (from -135° to 135°)
              transform={`rotate(-135 ${size / 2} ${size / 2})`}
            />
          </svg>
          
          {/* Indicator */}
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="absolute"
          >
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={colors.indicator}
              strokeWidth={thickness}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform={`rotate(-135 ${size / 2} ${size / 2})`}
            />
          </svg>
          
          {/* Needle */}
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="absolute"
          >
            <line
              x1={size / 2}
              y1={size / 2}
              x2={size / 2 + Math.cos((angle * Math.PI) / 180) * (radius - thickness)}
              y2={size / 2 + Math.sin((angle * Math.PI) / 180) * (radius - thickness)}
              stroke={colors.text}
              strokeWidth={2}
              strokeLinecap="round"
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={thickness / 3}
              fill={colors.text}
            />
          </svg>
          
          {/* Value */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center text-center"
          >
            <span className="text-2xl font-bold" style={{ color: colors.text }}>
              {formatValue(value)}
            </span>
            {label && (
              <span className="text-xs text-muted-foreground mt-1">
                {label}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}