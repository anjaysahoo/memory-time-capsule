import { motion } from 'motion/react';

interface PreviewContentProps {
  previewMessage?: string;
  previewPhotoUrl?: string;
  className?: string;
}

export default function PreviewContent({
  previewMessage,
  previewPhotoUrl,
  className = "",
}: PreviewContentProps) {
  // Return null if no preview content
  if (!previewMessage && !previewPhotoUrl) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Preview Photo - with subtle hover zoom */}
      {previewPhotoUrl && (
        <motion.div
          className="rounded-lg overflow-hidden border border-border cursor-pointer"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <img
            src={previewPhotoUrl}
            alt="Preview"
            className="w-full h-auto max-h-96 object-contain bg-gray-50"
            loading="lazy"
          />
        </motion.div>
      )}

      {/* Preview Message */}
      {previewMessage && (
        <div className="bg-muted/50 rounded-lg p-4 border border-border">
          <p className="text-muted-foreground italic text-sm leading-relaxed">
            {previewMessage}
          </p>
        </div>
      )}
    </div>
  );
}
