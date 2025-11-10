interface ContentViewerProps {
  contentType: "video" | "audio" | "photo" | "text";
  contentUrl: string | null;
  textContent?: string;
}

export default function ContentViewer({
  contentType,
  contentUrl,
  textContent,
}: ContentViewerProps) {
  if (contentType === "text") {
    return (
      <div className="bg-gray-50 rounded-lg p-8">
        <div className="prose prose-lg max-w-none">
          <pre className="whitespace-pre-wrap font-sans">{textContent}</pre>
        </div>
      </div>
    );
  }

  if (contentType === "video" && contentUrl) {
    return (
      <div className="bg-black rounded-lg overflow-hidden">
        <video controls className="w-full">
          <source src={contentUrl} type="video/mp4" />
          <source src={contentUrl} type="video/webm" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  if (contentType === "audio" && contentUrl) {
    return (
      <div className="bg-gray-50 rounded-lg p-8">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🎵</div>
          <p className="text-gray-600">Audio Message</p>
        </div>
        <audio controls className="w-full">
          <source src={contentUrl} type="audio/mpeg" />
          <source src={contentUrl} type="audio/mp4" />
          Your browser does not support the audio tag.
        </audio>
      </div>
    );
  }

  if (contentType === "photo" && contentUrl) {
    return (
      <div className="rounded-lg overflow-hidden">
        <img
          src={contentUrl}
          alt="Time capsule content"
          className="w-full h-auto"
        />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg p-8 text-center">
      <p className="text-gray-600">Content not available</p>
    </div>
  );
}
