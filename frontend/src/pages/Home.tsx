import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

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
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-purple-700 text-white">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Send Messages to the Future 🎁
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-purple-100">
              Create time capsules with videos, photos, or messages that unlock
              exactly when you want them to.
            </p>
            <Button asChild size="lg">
              <Link to={isAuthenticated() ? "/create" : "/auth"}>
                {isAuthenticated() ? "Create Capsule" : "Get Started Free"}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="container mx-auto px-4 py-24">
        <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="text-6xl mb-6">1️⃣</div>
            <h3 className="text-2xl font-semibold mb-4">
              Connect Your Accounts
            </h3>
            <p className="text-muted-foreground">
              Link your GitHub (for storage) and Gmail (for sending) in under 3
              minutes. All your data stays in your own accounts.
            </p>
          </div>

          <div className="text-center">
            <div className="text-6xl mb-6">2️⃣</div>
            <h3 className="text-2xl font-semibold mb-4">Create Your Capsule</h3>
            <p className="text-muted-foreground">
              Upload a video, audio, photo, or write a message. Set the unlock
              date and add the recipient's email.
            </p>
          </div>

          <div className="text-center">
            <div className="text-6xl mb-6">3️⃣</div>
            <h3 className="text-2xl font-semibold mb-4">Automatic Unlock</h3>
            <p className="text-muted-foreground">
              We'll automatically send the capsule to your recipient when the
              time comes, with a secure PIN for access.
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-muted/50 py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <div className="text-4xl mb-2">🎥</div>
                <CardTitle>Multiple Content Types</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Videos up to 100MB, audio files, photos, or simple text
                  messages.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="text-4xl mb-2">🔒</div>
                <CardTitle>Secure & Private</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  All content stored in your private GitHub repository with
                  encrypted access tokens.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="text-4xl mb-2">⏰</div>
                <CardTitle>Precise Timing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Hourly unlock precision using GitHub Actions. Set any future
                  date and time.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="text-4xl mb-2">📧</div>
                <CardTitle>Email Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Recipients get emails when capsules are created and when they
                  unlock, with secure PIN access.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="text-4xl mb-2">💰</div>
                <CardTitle>100% Free</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Uses free tiers of GitHub, Gmail, and Cloudflare. 1GB storage
                  per user.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="text-4xl mb-2">📱</div>
                <CardTitle>WhatsApp Sharing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Optional WhatsApp sharing with pre-filled messages for easy
                  communication.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-24">
        <Card className="max-w-2xl mx-auto bg-primary/5 border-primary/20">
          <CardContent className="pt-6 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Send a Message to the Future?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Create your first time capsule in minutes. No credit card
              required.
            </p>
            <Button asChild size="lg">
              <Link to={isAuthenticated() ? "/create" : "/auth"}>
                {isAuthenticated()
                  ? "Create Your First Capsule"
                  : "Get Started Free"}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
