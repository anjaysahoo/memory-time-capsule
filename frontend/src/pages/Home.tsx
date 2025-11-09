import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Home() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Handle OAuth callbacks that land on root instead of /auth/callback
  useEffect(() => {
    const userId = searchParams.get("userId");
    const success = searchParams.get("success");
    const gmailSuccess = searchParams.get("gmailSuccess");
    const error = searchParams.get("error");

    // If OAuth params are present, redirect to proper callback handler
    if (userId || success || gmailSuccess || error) {
      const params = new URLSearchParams();
      if (userId) params.set("userId", userId);
      if (success) params.set("success", success);
      if (gmailSuccess) params.set("gmailSuccess", gmailSuccess);
      if (error) params.set("error", error);

      navigate(`/auth/callback?${params.toString()}`, { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-8 text-foreground">
        Send Messages to the Future
      </h1>
      <p className="text-xl text-center text-muted-foreground">
        Create time capsules that unlock at a specific date and time.
      </p>
    </div>
  );
}
