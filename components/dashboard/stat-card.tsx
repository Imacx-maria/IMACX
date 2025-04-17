import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCardData } from "@/lib/utils/mock-data";
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  data: StatCardData;
  className?: string;
}

export function StatCard({ data, className }: StatCardProps) {
  const { title, value, change, trend, description } = data;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="mt-2 flex items-center text-sm">
          <div
            className={cn(
              "flex items-center gap-1",
              trend === "up" && "text-emerald-500",
              trend === "down" && "text-rose-500"
            )}
          >
            {trend === "up" ? (
              <ArrowUpIcon className="h-4 w-4" />
            ) : trend === "down" ? (
              <ArrowDownIcon className="h-4 w-4" />
            ) : (
              <MinusIcon className="h-4 w-4" />
            )}
            <span>{Math.abs(change)}%</span>
          </div>
          <CardDescription className="ml-2">{description}</CardDescription>
        </div>
      </CardContent>
    </Card>
  );
}