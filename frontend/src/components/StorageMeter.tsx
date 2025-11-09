import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface StorageMeterProps {
  used: number;
  limit: number;
  percentage: number;
}

export default function StorageMeter({
  used,
  limit,
  percentage,
}: StorageMeterProps) {
  const formatBytes = (bytes: number) => {
    const mb = bytes / 1024 / 1024;
    if (mb < 1024) {
      return `${mb.toFixed(1)} MB`;
    }
    return `${(mb / 1024).toFixed(2)} GB`;
  };

  const getProgressColor = () => {
    if (percentage >= 90) return "[&>div]:bg-red-600";
    if (percentage >= 70) return "[&>div]:bg-yellow-600";
    return ""; // Uses default primary color
  };

  return (
    <Card className="mb-8">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Storage Usage</h3>
          <span className="text-sm text-muted-foreground">
            {formatBytes(used)} / {formatBytes(limit)}
          </span>
        </div>

        <Progress
          value={percentage}
          className={cn("w-full h-4", getProgressColor())}
        />

        <p className="text-sm text-muted-foreground mt-2">{percentage}% used</p>
      </CardContent>
    </Card>
  );
}

