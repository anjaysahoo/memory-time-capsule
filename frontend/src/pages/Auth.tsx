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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12 slide-up">
            <div className="mb-6">
              <span className="inline-block text-6xl float">🔗</span>
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Connect Your Accounts
            </h1>
            <p className="text-xl text-muted-foreground">
              Quick 2-step setup: GitHub for storage, Gmail for notifications
            </p>
          </div>

        {error && (
          <Alert variant="destructive" className="mb-6 scale-in border-2 shadow-lg">
            <AlertDescription className="font-medium">{error}</AlertDescription>
          </Alert>
        )}

        {/* Show connection status */}
        {session && (
          <Alert className="mb-6 border-2 border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50 scale-in shadow-lg">
            <AlertDescription className="text-blue-700 font-medium flex items-center gap-2">
              {session.githubConnected && !session.gmailConnected && (
                <>
                  <span className="text-2xl">✅</span>
                  <span>GitHub connected! Now connect Gmail to continue.</span>
                </>
              )}
              {session.githubConnected && session.gmailConnected && (
                <>
                  <span className="text-2xl">🎉</span>
                  <span>Both accounts connected! Redirecting to dashboard...</span>
                </>
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {/* GitHub Connection Card */}
          <Card className="hover-lift border-2 border-transparent hover:border-indigo-200 transition-all shadow-lg slide-up">
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-3xl">📁</span>
                  </div>
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    GitHub
                    {session?.githubConnected && (
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                        <span>✓</span> Connected
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription className="mt-2 text-base">
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
          <Card className="hover-lift border-2 border-transparent hover:border-purple-200 transition-all shadow-lg slide-up" style={{animationDelay: '0.1s'}}>
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-3xl">📧</span>
                  </div>
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    Gmail
                    {session?.gmailConnected && (
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                        <span>✓</span> Connected
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription className="mt-2 text-base">
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

        <div className="mt-8 text-center text-sm text-muted-foreground slide-up" style={{animationDelay: '0.2s'}}>
          <p>
            By connecting your accounts, you agree to our{" "}
            <a href="#" className="text-indigo-600 hover:text-indigo-700 underline font-medium">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-indigo-600 hover:text-indigo-700 underline font-medium">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
    </div>
  );
}
