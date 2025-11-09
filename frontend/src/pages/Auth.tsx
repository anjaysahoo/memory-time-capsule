import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { authService } from "@/api/services";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Auth() {
  const [loading, setLoading] = useState<"github" | "gmail" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { userId, session } = useAuthStore();

  // If user is already fully authenticated, redirect to dashboard
  useEffect(() => {
    if (session?.githubConnected && session?.gmailConnected) {
      navigate("/dashboard");
    }
  }, [session, navigate]);

  const handleGitHubAuth = async () => {
    try {
      setError(null);
      setLoading("github");
      const authUrl = await authService.getGitHubAuthUrl();
      // Redirect to GitHub OAuth
      window.location.href = authUrl;
    } catch (error) {
      console.error("GitHub auth error:", error);
      setError("Failed to start GitHub authentication");
      setLoading(null);
    }
  };

  const handleGmailAuth = async () => {
    if (!userId) {
      setError("Please connect GitHub first");
      return;
    }

    try {
      setError(null);
      setLoading("gmail");
      const authUrl = await authService.getGmailAuthUrl(userId);
      // Redirect to Gmail OAuth
      window.location.href = authUrl;
    } catch (error: any) {
      console.error("Gmail auth error:", error);
      setError(
        error.response?.data?.error || "Failed to start Gmail authentication"
      );
      setLoading(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Connect Your Accounts</h1>
          <p className="text-xl text-muted-foreground">
            We need access to GitHub (for storage) and Gmail (for sending
            emails).
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Show connection status */}
        {session && (
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <AlertDescription className="text-blue-700">
              {session.githubConnected && !session.gmailConnected && (
                <>✅ GitHub connected. Now connect Gmail to continue.</>
              )}
              {session.githubConnected && session.gmailConnected && (
                <>✅ Both accounts connected! Redirecting to dashboard...</>
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {/* GitHub Connection Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📁</span>
                  </div>
                </div>
                <div className="flex-1">
                  <CardTitle>
                    GitHub
                    {session?.githubConnected && (
                      <span className="ml-2 text-sm font-normal text-green-600">
                        ✓ Connected
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    We'll create a private repository to store your time capsule
                    content. You get 1GB of free storage.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2 mb-4">
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>All content stored in your private repository</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>You maintain full ownership of your data</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Automatic backups via Git history</span>
                </li>
              </ul>
              <Button
                onClick={handleGitHubAuth}
                disabled={loading !== null || session?.githubConnected}
                className="w-full"
              >
                {loading === "github" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : session?.githubConnected ? (
                  <>
                    <span>✓ Connected</span>
                  </>
                ) : (
                  <>
                    <span>Connect GitHub</span>
                    <span className="ml-2">→</span>
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Gmail Connection Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📧</span>
                  </div>
                </div>
                <div className="flex-1">
                  <CardTitle>
                    Gmail
                    {session?.gmailConnected && (
                      <span className="ml-2 text-sm font-normal text-green-600">
                        ✓ Connected
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    We'll send emails on your behalf when capsules are created
                    and unlocked.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2 mb-4">
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Emails sent from your Gmail account</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Recipients see your email as sender</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>You can view sent emails in your Gmail</span>
                </li>
              </ul>
              <Button
                onClick={handleGmailAuth}
                disabled={
                  loading !== null ||
                  !session?.githubConnected ||
                  session?.gmailConnected
                }
                className="w-full"
              >
                {loading === "gmail" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : session?.gmailConnected ? (
                  <>
                    <span>✓ Connected</span>
                  </>
                ) : !session?.githubConnected ? (
                  <>
                    <span>Connect GitHub First</span>
                  </>
                ) : (
                  <>
                    <span>Connect Gmail</span>
                    <span className="ml-2">→</span>
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            By connecting your accounts, you agree to our{" "}
            <a href="#" className="text-primary hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-primary hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
