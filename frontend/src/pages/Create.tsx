import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { capsuleService } from "@/api/services";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import FileUpload from "@/components/FileUpload";
import DateTimePicker from "@/components/DateTimePicker";

type ContentType = "video" | "audio" | "photo" | "text";

interface FormData {
  title: string;
  unlockDate: Date | null;
  recipientEmail: string;
  recipientName: string;
  contentType: ContentType;
  textContent: string;
}

export default function Create() {
  const navigate = useNavigate();
  const { userId, isAuthenticated } = useAuthStore();
  const [formData, setFormData] = useState<FormData>({
    title: "",
    unlockDate: null,
    recipientEmail: "",
    recipientName: "",
    contentType: "text",
    textContent: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{
    magicLink: string;
    whatsappLink: string;
  } | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadStartTime, setUploadStartTime] = useState<number>(0);

  // Redirect if not authenticated
  if (!isAuthenticated()) {
    navigate("/auth");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.title.trim()) {
      setError("Please enter a title");
      return;
    }
    if (!formData.unlockDate) {
      setError("Please select an unlock date");
      return;
    }
    if (!formData.recipientEmail.trim()) {
      setError("Please enter recipient email");
      return;
    }

    // Validate unlock date is in future
    if (formData.unlockDate <= new Date()) {
      setError("Unlock date must be in the future");
      return;
    }

    // Validate content
    if (formData.contentType === "text") {
      if (!formData.textContent.trim()) {
        setError("Please enter text content");
        return;
      }
    } else {
      if (!file) {
        setError(`Please upload a ${formData.contentType} file`);
        return;
      }
    }

    try {
      setLoading(true);
      setUploadProgress(0);
      setUploadStartTime(Date.now());

      // Prepare form data for API
      const apiFormData = new FormData();
      apiFormData.append("userId", userId!);
      apiFormData.append(
        "metadata",
        JSON.stringify({
          title: formData.title,
          unlockAt: Math.floor(formData.unlockDate.getTime() / 1000),
          recipientEmail: formData.recipientEmail,
          recipientName: formData.recipientName || undefined,
          contentType: formData.contentType,
          textContent:
            formData.contentType === "text" ? formData.textContent : undefined,
        })
      );

      if (file) {
        apiFormData.append("file", file);
      }

      // Create capsule with progress tracking
      const response = await capsuleService.create(
        apiFormData,
        (progress) => {
          setUploadProgress(progress);
        }
      );

      // Show success
      setSuccess({
        magicLink: response.capsule.magicLink,
        whatsappLink: response.capsule.whatsappLink,
      });
    } catch (err: any) {
      console.error("Capsule creation error:", err);

      // Provide specific error messages
      let errorMessage = "Failed to create capsule";

      if (err.code === "ECONNABORTED" || err.message?.includes("timeout")) {
        errorMessage = "Upload timed out. Please try a smaller file or check your connection.";
      } else if (err.response?.status === 413) {
        errorMessage = "File is too large for the server to process.";
      } else if (err.response?.status === 500 && file && file.size > 30 * 1024 * 1024) {
        errorMessage = "Large file upload failed. Cloudflare Workers on free tier have limits. Try files under 30MB for now.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleContentTypeChange = (type: ContentType) => {
    setFormData({ ...formData, contentType: type });
    setFile(null); // Clear file when switching type
  };

  // Success screen
  if (success) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold mb-4">Time Capsule Created!</h2>
              <p className="text-muted-foreground mb-2">
                Your capsule has been sealed and the recipient has been notified
                via email.
              </p>
              <p className="text-sm text-muted-foreground/70 mb-8">
                💡 Storage usage will update on your dashboard within 5-10 minutes
              </p>

              <div className="bg-muted p-6 rounded-lg mb-6">
                <p className="text-sm text-muted-foreground mb-2">
                  Magic Link (for recipient):
                </p>
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    value={success.magicLink}
                    readOnly
                    className="flex-1 text-sm"
                  />
                  <Button
                    variant="secondary"
                    onClick={() => {
                      navigator.clipboard.writeText(success.magicLink);
                      alert("Link copied!");
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => window.open(success.whatsappLink, "_blank")}
                  className="flex items-center justify-center gap-2"
                >
                  <span>📱</span>
                  <span>Share via WhatsApp</span>
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate("/dashboard")}
                >
                  View Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Form screen
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Time Capsule</h1>
          <p className="text-muted-foreground">
            Send a message, video, or photo to unlock in the future
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <Card>
            <CardContent className="pt-6">
              <Label htmlFor="title">Capsule Title *</Label>
              <Input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Happy Birthday! 🎂"
                maxLength={100}
                className="mt-2"
              />
            </CardContent>
          </Card>

          {/* Unlock Date */}
          <Card>
            <CardContent className="pt-6">
              <Label>Unlock Date & Time *</Label>
              <div className="mt-2">
                <DateTimePicker
                  value={formData.unlockDate}
                  onChange={(date) =>
                    setFormData({ ...formData, unlockDate: date })
                  }
                  minDate={new Date()}
                />
              </div>
            </CardContent>
          </Card>

          {/* Recipient */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Recipient</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="recipientEmail">Email Address *</Label>
                  <Input
                    id="recipientEmail"
                    type="email"
                    value={formData.recipientEmail}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        recipientEmail: e.target.value,
                      })
                    }
                    placeholder="friend@example.com"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="recipientName">Name (optional)</Label>
                  <Input
                    id="recipientName"
                    type="text"
                    value={formData.recipientName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        recipientName: e.target.value,
                      })
                    }
                    placeholder="Alex Smith"
                    className="mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Type */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Content Type *</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(["text", "video", "audio", "photo"] as ContentType[]).map(
                  (type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleContentTypeChange(type)}
                      className={`p-4 border-2 rounded-lg transition-colors ${
                        formData.contentType === type
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-muted-foreground"
                      }`}
                    >
                      <div className="text-3xl mb-2">
                        {type === "text" && "📝"}
                        {type === "video" && "🎥"}
                        {type === "audio" && "🎵"}
                        {type === "photo" && "📷"}
                      </div>
                      <div className="font-medium capitalize">{type}</div>
                    </button>
                  )
                )}
              </div>
            </CardContent>
          </Card>

          {/* Content Input */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Your Content *</h3>

              {formData.contentType === "text" ? (
                <Textarea
                  value={formData.textContent}
                  onChange={(e) =>
                    setFormData({ ...formData, textContent: e.target.value })
                  }
                  placeholder="Write your message here... (max 10,000 characters)"
                  rows={10}
                  maxLength={10000}
                  className="font-mono"
                />
              ) : (
                <FileUpload
                  contentType={formData.contentType}
                  file={file}
                  onFileSelect={setFile}
                  onFileRemove={() => setFile(null)}
                />
              )}
            </CardContent>
          </Card>

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Upload Progress (for files > 10MB) */}
          {loading && file && file.size > 10 * 1024 * 1024 && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Uploading {file.name}...</span>
                    <span className="text-muted-foreground">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {(file.size / 1024 / 1024).toFixed(1)} MB
                    </span>
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <span>
                        {(() => {
                          const elapsed = (Date.now() - uploadStartTime) / 1000;
                          const rate = uploadProgress / elapsed;
                          const remaining = (100 - uploadProgress) / rate;
                          const mins = Math.floor(remaining / 60);
                          const secs = Math.floor(remaining % 60);
                          return mins > 0
                            ? `~${mins}m ${secs}s remaining`
                            : `~${secs}s remaining`;
                        })()}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/dashboard")}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>
                    {file && file.size > 10 * 1024 * 1024
                      ? `Uploading... ${uploadProgress}%`
                      : "Creating..."}
                  </span>
                </>
              ) : (
                "🔒 Lock Capsule"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
