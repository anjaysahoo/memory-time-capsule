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
      {/* Preview Photo */}
      {previewPhotoUrl && (
        <div className="rounded-lg overflow-hidden border border-border">
          <img
            src={previewPhotoUrl}
            alt="Preview"
            className="w-full h-auto max-h-96 object-contain bg-gray-50"
            loading="lazy"
          />
        </div>
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

