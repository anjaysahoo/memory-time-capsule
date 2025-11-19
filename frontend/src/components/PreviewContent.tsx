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
        <div className="rounded-lg overflow-hidden">
          <img
            src={previewPhotoUrl}
            alt="Preview"
            className="w-full h-auto max-h-96 object-contain bg-transparent"
            loading="lazy"
          />
        </div>
      )}

      {/* Preview Message */}
      {previewMessage && (
        <div className="rounded-lg p-4 bg-transparent">
          <p className="text-white/70 italic text-base leading-relaxed">
            "{previewMessage}"
          </p>
        </div>
      )}
    </div>
  );
}

