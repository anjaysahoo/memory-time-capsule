import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Capsule } from '@/api/types';

interface CapsuleCardProps {
  capsule: Capsule;
}

export default function CapsuleCard({ capsule }: CapsuleCardProps) {
  const unlockDate = new Date(capsule.unlockAt * 1000);
  const isUnlocked = Date.now() / 1000 >= capsule.unlockAt;
  const isPending = !isUnlocked;

  const getContentIcon = () => {
    switch (capsule.contentType) {
      case 'video': return '🎥';
      case 'audio': return '🎵';
      case 'photo': return '📷';
      case 'text': return '📝';
      default: return '📦';
    }
  };

  const getStatusBadge = () => {
    if (isUnlocked && capsule.unlockEmailSent) {
      return <Badge variant="success">Unlocked</Badge>;
    }
    if (isUnlocked && !capsule.unlockEmailSent) {
      return <Badge variant="destructive">Failed</Badge>;
    }
    return <Badge variant="secondary">Pending</Badge>;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 text-4xl">
            {getContentIcon()}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold truncate">{capsule.title}</h3>
                <p className="text-sm text-muted-foreground">
                  To: {capsule.recipientName || capsule.recipientEmail}
                </p>
              </div>
              {getStatusBadge()}
            </div>

            <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div>
                <span className="font-medium">Unlocks:</span>{' '}
                {format(unlockDate, 'MMM d, yyyy h:mm a')}
              </div>
              <div>
                <span className="font-medium">Type:</span> {capsule.contentType}
              </div>
              {capsule.fileSize && (
                <div>
                  <span className="font-medium">Size:</span>{' '}
                  {(capsule.fileSize / 1024 / 1024).toFixed(1)} MB
                </div>
              )}
            </div>

            {capsule.viewedAt && (
              <p className="mt-2 text-xs text-muted-foreground">
                Viewed {format(new Date(capsule.viewedAt * 1000), 'MMM d, yyyy h:mm a')}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

