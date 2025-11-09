import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/api/services";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Helper function to fetch session with retry logic
async function fetchSessionWithRetry(userId: string, maxRetries = 3, delayMs = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const session = await authService.getSession(userId);
      console.log(`Session fetch attempt ${i + 1}:`, {
        githubConnected: session.githubConnected,
        gmailConnected: session.gmailConnected,
      });
      return session;
    } catch (error) {
      console.error(`Session fetch attempt ${i + 1} failed:`, error);
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      } else {
        throw error;
      }
    }
  }
  throw new Error('Failed to fetch session after retries');
}

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUserId, setSession } = useAuthStore();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("Processing authentication...");

  useEffect(() => {
    const handleCallback = async () => {
      const userId = searchParams.get("userId");
      const success = searchParams.get("success");
      const gmailSuccess = searchParams.get("gmailSuccess");
      const error = searchParams.get("error");

      console.log("AuthCallback received params:", {
        userId,
        success,
        gmailSuccess,
        error,
      });

      if (error) {
        setStatus("error");
        setMessage(`Authentication failed: ${error}`);
        setTimeout(() => navigate("/auth"), 3000);
        return;
      }

      if (!userId) {
        setStatus("error");
        setMessage("No user ID received");
        setTimeout(() => navigate("/auth"), 3000);
        return;
      }

      try {
        // Store userId immediately
        setUserId(userId);

        // Fetch session with retry logic
        setMessage("Fetching session data...");
        const session = await fetchSessionWithRetry(userId);
        
        console.log("Session fetched successfully:", {
          userId: session.userId,
          githubConnected: session.githubConnected,
          gmailConnected: session.gmailConnected,
        });

        // Store session in zustand
        setSession(session);

        if (success === "true") {
          // GitHub connected
          setStatus("success");
          setMessage("GitHub connected! Now connect Gmail...");
          setTimeout(() => navigate("/auth"), 2000);
        } else if (gmailSuccess === "true") {
          // Gmail connected - verify both are connected before redirecting
          if (session.githubConnected && session.gmailConnected) {
            setStatus("success");
            setMessage("Gmail connected! Redirecting to dashboard...");
            setTimeout(() => navigate("/dashboard"), 2000);
          } else {
            // Session not fully updated yet, show warning
            console.warn("Session flags not fully updated:", session);
            setStatus("error");
            setMessage(
              `Connection incomplete. GitHub: ${session.githubConnected}, Gmail: ${session.gmailConnected}. Please try again.`
            );
            setTimeout(() => navigate("/auth"), 3000);
          }
        } else {
          // Unknown state
          setStatus("error");
          setMessage("Unknown authentication state");
          setTimeout(() => navigate("/auth"), 3000);
        }
      } catch (err: any) {
        console.error("Session fetch error:", err);
        setStatus("error");
        setMessage(err.message || "Failed to fetch user session");
        setTimeout(() => navigate("/auth"), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate, setUserId, setSession]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <Card>
          <CardContent className="pt-6">
            {status === "loading" && (
              <>
                <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
                <p className="mt-4 text-muted-foreground">{message}</p>
              </>
            )}

            {status === "success" && (
              <>
                <div className="text-6xl mb-4">✅</div>
                <Alert className="border-green-200 bg-green-50">
                  <AlertDescription className="text-green-700 font-semibold">
                    {message}
                  </AlertDescription>
                </Alert>
              </>
            )}

            {status === "error" && (
              <>
                <div className="text-6xl mb-4">❌</div>
                <Alert variant="destructive">
                  <AlertDescription className="font-semibold">
                    {message}
                  </AlertDescription>
                </Alert>
                <p className="mt-2 text-sm text-muted-foreground">
                  Redirecting...
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
