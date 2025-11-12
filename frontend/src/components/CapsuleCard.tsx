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
      return <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">🎉 Unlocked</Badge>;
    }
    if (isUnlocked && !capsule.unlockEmailSent) {
      return <Badge variant="destructive" className="border-0">⚠️ Failed</Badge>;
    }
    return <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0">⏳ Pending</Badge>;
  };

  return (
    <Card className="hover-lift border-2 border-transparent hover:border-purple-200 transition-all shadow-lg bg-gradient-to-br from-white to-purple-50/30">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md text-3xl">
              {getContentIcon()}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h3 className="text-xl font-bold truncate bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {capsule.title}
                </h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <span>📧</span>
                  <span>To: {capsule.recipientName || capsule.recipientEmail}</span>
                </p>
              </div>
              {getStatusBadge()}
            </div>

            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <div className="flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-lg">
                <span className="text-lg">⏰</span>
                <span className="font-medium text-gray-700">
                  {format(unlockDate, 'MMM d, yyyy h:mm a')}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-lg">
                <span className="text-lg">{getContentIcon()}</span>
                <span className="font-medium text-gray-700 capitalize">{capsule.contentType}</span>
              </div>
              {capsule.fileSize && (
                <div className="flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-lg">
                  <span className="text-lg">💾</span>
                  <span className="font-medium text-gray-700">
                    {(capsule.fileSize / 1024 / 1024).toFixed(1)} MB
                  </span>
                </div>
              )}
            </div>

            {capsule.viewedAt && (
              <p className="mt-3 text-xs text-muted-foreground flex items-center gap-1 bg-green-50 px-3 py-1.5 rounded-lg inline-flex">
                <span>👁️</span>
                <span>Viewed {format(new Date(capsule.viewedAt * 1000), 'MMM d, yyyy h:mm a')}</span>
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

