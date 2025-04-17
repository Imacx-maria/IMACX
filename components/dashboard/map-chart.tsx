"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface MapLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  value: number;
  color?: string;
}

export interface MapChartProps {
  title: string;
  description?: string;
  locations: MapLocation[];
  className?: string;
  width?: number;
  height?: number;
  defaultZoom?: number;
  defaultCenter?: { lat: number; lng: number };
  colorScale?: string[];
  maxValue?: number;
}

// Simple world map coordinates (simplified for demonstration)
const worldMapPath = "M2,111.3c12.2,0.4,24.4,0.4,36.6,0c0.2-10.8,0.2-21.6,0-32.4c7.8-0.2,15.6-0.2,23.4,0c0.2,3.6,0.2,7.2,0,10.8 c4.4,0.2,8.8,0.2,13.2,0c0.2-3.6,0.2-7.2,0-10.8c9.8-0.2,19.6-0.2,29.4,0c0.2,10.8,0.2,21.6,0,32.4c15.4,0.2,30.8,0.2,46.2,0 c0.2-3.6,0.2-7.2,0-10.8c4.4-0.2,8.8-0.2,13.2,0c0.2,3.6,0.2,7.2,0,10.8c7.8,0.2,15.6,0.2,23.4,0c0.2-10.8,0.2-21.6,0-32.4 c7.8-0.2,15.6-0.2,23.4,0c0.2,3.6,0.2,7.2,0,10.8c4.4,0.2,8.8,0.2,13.2,0c0.2-3.6,0.2-7.2,0-10.8c9.8-0.2,19.6-0.2,29.4,0 c0.2,10.8,0.2,21.6,0,32.4c12.2,0.2,24.4,0.2,36.6,0c0.2-25.2,0.2-50.4,0-75.6c-12.2-0.2-24.4-0.2-36.6,0c-0.2,3.6-0.2,7.2,0,10.8 c-4.4,0.2-8.8,0.2-13.2,0c-0.2-3.6-0.2-7.2,0-10.8c-9.8-0.2-19.6-0.2-29.4,0c-0.2,3.6-0.2,7.2,0,10.8c-4.4,0.2-8.8,0.2-13.2,0 c-0.2-3.6-0.2-7.2,0-10.8c-7.8-0.2-15.6-0.2-23.4,0c-0.2,3.6-0.2,7.2,0,10.8c-4.4,0.2-8.8,0.2-13.2,0c-0.2-3.6-0.2-7.2,0-10.8 c-9.8-0.2-19.6-0.2-29.4,0c-0.2,3.6-0.2,7.2,0,10.8c-4.4,0.2-8.8,0.2-13.2,0c-0.2-3.6-0.2-7.2,0-10.8c-7.8-0.2-15.6-0.2-23.4,0 c-0.2,3.6-0.2,7.2,0,10.8c-4.4,0.2-8.8,0.2-13.2,0c-0.2-3.6-0.2-7.2,0-10.8c-9.8-0.2-19.6-0.2-29.4,0c-0.2,3.6-0.2,7.2,0,10.8 c-4.4,0.2-8.8,0.2-13.2,0c-0.2-3.6-0.2-7.2,0-10.8c-12.2-0.2-24.4-0.2-36.6,0C1.8,60.9,1.8,86.1,2,111.3z";

export function MapChart({
  title,
  description,
  locations,
  className,
  width = 600,
  height = 300,
  defaultZoom = 1,
  defaultCenter = { lat: 0, lng: 0 },
  colorScale = ["#f3f4f6", "#dbeafe", "#93c5fd", "#60a5fa", "#3b82f6"],
  maxValue = 100,
}: MapChartProps) {
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  
  // This is a simplified map implementation
  // In a real application, you would use a proper map library like Leaflet or Google Maps
  
  // Convert lat/lng to x/y coordinates on our simplified map
  const projectPoint = (lat: number, lng: number): [number, number] => {
    // Simple Mercator-like projection
    const x = ((lng + 180) / 360) * width;
    const y = ((90 - lat) / 180) * height;
    return [x, y];
  };
  
  // Get color for a location based on its value
  const getColorForValue = (value: number) => {
    const index = Math.min(
      Math.floor((value / maxValue) * (colorScale.length - 1)),
      colorScale.length - 1
    );
    return colorScale[index];
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="relative" style={{ width, height }}>
          {/* Simplified world map background */}
          <svg width={width} height={height} viewBox="0 0 360 180" className="absolute inset-0">
            <path
              d={worldMapPath}
              fill="hsl(var(--muted))"
              stroke="hsl(var(--border))"
              strokeWidth="0.5"
            />
          </svg>
          
          {/* Location markers */}
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="absolute inset-0">
            {locations.map((location) => {
              const [x, y] = projectPoint(location.latitude, location.longitude);
              const radius = 5 + (location.value / maxValue) * 10;
              
              return (
                <g key={location.id}>
                  <circle
                    cx={x}
                    cy={y}
                    r={radius}
                    fill={location.color || getColorForValue(location.value)}
                    fillOpacity={0.7}
                    stroke="hsl(var(--border))"
                    strokeWidth="1"
                    onMouseEnter={() => setSelectedLocation(location)}
                    onMouseLeave={() => setSelectedLocation(null)}
                    className="cursor-pointer transition-all hover:fill-opacity-100"
                  />
                </g>
              );
            })}
          </svg>
          
          {/* Tooltip */}
          {selectedLocation && (
            <div
              className="absolute z-10 rounded-md bg-popover p-2 text-sm shadow-md"
              style={{
                left: projectPoint(selectedLocation.latitude, selectedLocation.longitude)[0],
                top: projectPoint(selectedLocation.latitude, selectedLocation.longitude)[1] - 40,
                transform: "translateX(-50%)",
              }}
            >
              <div className="font-medium">{selectedLocation.name}</div>
              <div className="text-muted-foreground">Value: {selectedLocation.value}</div>
            </div>
          )}
          
          {/* Legend */}
          <div className="absolute bottom-2 right-2 flex items-center space-x-2 rounded-md bg-background/80 p-2 text-xs backdrop-blur-sm">
            <span>Value:</span>
            {colorScale.map((color, i) => (
              <div key={i} className="flex items-center">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="ml-1">
                  {Math.round((i / (colorScale.length - 1)) * maxValue)}
                  {i === colorScale.length - 1 ? "+" : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}