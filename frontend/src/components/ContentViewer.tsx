interface ContentViewerProps {
  contentType: "video" | "audio" | "photo" | "text";
  contentUrl: string | null;
  textContent?: string;
  photoUrls?: string[];
}

export default function ContentViewer({
  contentType,
  contentUrl,
  textContent,
  photoUrls,
}: ContentViewerProps) {
  // Photo gallery component (reusable)
  const PhotoGallery = () => {
    if (!photoUrls || photoUrls.length === 0) return null;

    return (
      <div className="mt-8 pt-8 border-t">
        <h3 className="text-lg font-semibold mb-4 text-center">
          📷 Photos ({photoUrls.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {photoUrls.map((url, index) => (
            <div key={index} className="rounded-lg overflow-hidden border">
              <img
                src={url}
                alt={`Photo ${index + 1}`}
                className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => window.open(url, '_blank')}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (contentType === "text") {
    return (
      <>
        <div className="bg-gray-50 rounded-lg p-8">
          <div className="prose prose-lg max-w-none">
            <pre className="whitespace-pre-wrap font-sans">{textContent}</pre>
          </div>
        </div>
        <PhotoGallery />
      </>
    );
  }

  if (contentType === "video" && contentUrl) {
    return (
      <>
        <div className="bg-black rounded-lg overflow-hidden">
          <video controls className="w-full">
            <source src={contentUrl} type="video/mp4" />
            <source src={contentUrl} type="video/webm" />
            Your browser does not support the video tag.
          </video>
        </div>
        <PhotoGallery />
      </>
    );
  }

  if (contentType === "audio" && contentUrl) {
    return (
      <>
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
        <PhotoGallery />
      </>
    );
  }

  if (contentType === "photo" && contentUrl) {
    return (
      <>
        <div className="rounded-lg overflow-hidden">
          <img
            src={contentUrl}
            alt="Time capsule content"
            className="w-full h-auto"
          />
        </div>
        <PhotoGallery />
      </>
    );
  }

  return (
    <>
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <p className="text-gray-600">Content not available</p>
      </div>
      <PhotoGallery />
    </>
  );
}
