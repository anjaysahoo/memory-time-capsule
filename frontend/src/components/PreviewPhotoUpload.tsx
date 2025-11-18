import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PreviewPhotoUploadProps {
  file: File | null;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
}

const PREVIEW_PHOTO_LIMIT = 30 * 1024 * 1024; // 30MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif"];
const RECOMMENDED_RESOLUTION = "1200x800px";

export default function PreviewPhotoUpload({
  file,
  onFileSelect,
  onFileRemove,
}: PreviewPhotoUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > PREVIEW_PHOTO_LIMIT) {
      return `File size exceeds ${Math.floor(PREVIEW_PHOTO_LIMIT / 1024 / 1024)}MB limit`;
    }

    // Check file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `Invalid file type. Allowed: JPEG, PNG, GIF`;
    }

    return null;
  };

  const handleFile = (file: File) => {
    setError(null);
    const validationError = validateFile(file);

    if (validationError) {
      setError(validationError);
      return;
    }

    onFileSelect(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  if (file) {
    return (
      <div className="border-2 border-border rounded-lg p-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 text-3xl">📷</div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{file.name}</p>
            <p className="text-sm text-muted-foreground">
              {formatFileSize(file.size)}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onFileRemove}
            className="text-destructive hover:text-destructive/80"
          >
            Remove
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? "border-primary bg-primary/10"
            : "border-border hover:border-muted-foreground"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="text-4xl mb-3">📷</div>
        <p className="text-sm font-medium mb-1">
          Drop preview photo here, or click to browse
        </p>
        <p className="text-xs text-muted-foreground mb-3">
          Max size: {Math.floor(PREVIEW_PHOTO_LIMIT / 1024 / 1024)}MB • Recommended: {RECOMMENDED_RESOLUTION}
        </p>
        <input
          type="file"
          id="preview-photo-upload"
          className="hidden"
          accept="image/jpeg,image/png,image/gif"
          onChange={handleChange}
        />
        <Button size="sm" variant="outline" asChild>
          <label htmlFor="preview-photo-upload" className="cursor-pointer">
            Choose Photo
          </label>
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mt-3">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

