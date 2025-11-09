import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FileUploadProps {
  contentType: "video" | "audio" | "photo";
  file: File | null;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
}

const CONTENT_LIMITS = {
  video: 30 * 1024 * 1024, // 30MB (Cloudflare Workers free tier limit)
  audio: 30 * 1024 * 1024, // 30MB
  photo: 30 * 1024 * 1024, // 30MB
};

const ALLOWED_TYPES = {
  video: ["video/mp4", "video/webm"],
  audio: ["audio/mpeg", "audio/mp4", "audio/m4a"],
  photo: ["image/jpeg", "image/png", "image/gif"],
};

export default function FileUpload({
  contentType,
  file,
  onFileSelect,
  onFileRemove,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    // Check file size
    const limit = CONTENT_LIMITS[contentType];
    if (file.size > limit) {
      return `File size exceeds ${Math.floor(limit / 1024 / 1024)}MB limit`;
    }

    // Check file type
    const allowedTypes = ALLOWED_TYPES[contentType];
    if (!allowedTypes.includes(file.type)) {
      return `Invalid file type. Allowed: ${allowedTypes.join(", ")}`;
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

  const getAcceptString = () => {
    return ALLOWED_TYPES[contentType].join(",");
  };

  if (file) {
    return (
      <div className="border-2 border-border rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 text-4xl">
            {contentType === "video" && "🎥"}
            {contentType === "audio" && "🎵"}
            {contentType === "photo" && "📷"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{file.name}</p>
            <p className="text-sm text-muted-foreground">
              {formatFileSize(file.size)}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
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
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
          dragActive
            ? "border-primary bg-primary/10"
            : "border-border hover:border-muted-foreground"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="text-6xl mb-4">
          {contentType === "video" && "🎥"}
          {contentType === "audio" && "🎵"}
          {contentType === "photo" && "📷"}
        </div>
        <p className="text-lg font-medium mb-2">
          Drop your {contentType} file here, or click to browse
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          Max size: {Math.floor(CONTENT_LIMITS[contentType] / 1024 / 1024)}MB
        </p>
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept={getAcceptString()}
          onChange={handleChange}
        />
        <Button asChild>
          <label htmlFor="file-upload" className="cursor-pointer">
            Choose File
          </label>
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
