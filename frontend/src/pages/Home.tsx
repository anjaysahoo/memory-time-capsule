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
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-overlay filter blur-xl animate-pulse delay-75"></div>
          <div className="absolute -bottom-20 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-overlay filter blur-xl animate-pulse delay-150"></div>
        </div>

        <div className="container mx-auto px-4 py-32 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="scale-in mb-8">
              <span className="inline-block text-7xl mb-4 float">🎁</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold mb-6 slide-up bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-white">
              Send Messages to the Future
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-purple-100 max-w-2xl mx-auto slide-up" style={{animationDelay: '0.1s'}}>
              Create time capsules with videos, photos, or messages that unlock
              exactly when you want them to. Magical moments, preserved in time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center slide-up" style={{animationDelay: '0.2s'}}>
              <Button asChild size="lg" className="text-lg px-8 py-6 bg-white text-purple-600 hover:bg-purple-50 hover-lift shadow-xl">
                <Link to={isAuthenticated() ? "/create" : "/auth"}>
                  {isAuthenticated() ? "🚀 Create Capsule" : "✨ Get Started Free"}
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm">
                <a href="#features">Learn More</a>
              </Button>
            </div>
            <p className="mt-8 text-sm text-purple-200 slide-up" style={{animationDelay: '0.3s'}}>
              No credit card required • 1GB free storage • 100% open source
            </p>
          </div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* How It Works */}
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-16 slide-up">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground">Three simple steps to preserve your memories</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          <div className="text-center group hover-lift">
            <div className="relative mb-6">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg group-hover:shadow-2xl transition-shadow">
                1
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-sm">⚡</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-4 group-hover:text-indigo-600 transition-colors">
              Connect Accounts
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Link GitHub (storage) and Gmail (sending) in under 3 minutes.
              All data stays in your own accounts.
            </p>
          </div>

          <div className="text-center group hover-lift">
            <div className="relative mb-6">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg group-hover:shadow-2xl transition-shadow">
                2
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-sm">✨</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-4 group-hover:text-purple-600 transition-colors">
              Create Capsule
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Upload video, audio, photo, or write a message. Set unlock
              date and recipient's email.
            </p>
          </div>

          <div className="text-center group hover-lift">
            <div className="relative mb-6">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-pink-500 to-orange-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg group-hover:shadow-2xl transition-shadow">
                3
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-sm">🎉</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-4 group-hover:text-pink-600 transition-colors">
              Automatic Unlock
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Capsule automatically sends to recipient at the right time,
              with secure PIN access.
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div id="features" className="bg-gradient-to-b from-purple-50 to-white py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 slide-up">
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-xl text-muted-foreground">Everything you need to create magical time capsules</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="hover-lift border-2 border-transparent hover:border-indigo-200 transition-all">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-3xl mb-3 shadow-lg">
                  🎥
                </div>
                <CardTitle className="text-xl">Multiple Content Types</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Videos up to 100MB, audio files, photos, or simple text
                  messages.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift border-2 border-transparent hover:border-purple-200 transition-all">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-3xl mb-3 shadow-lg">
                  🔒
                </div>
                <CardTitle className="text-xl">Secure & Private</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  All content stored in your private GitHub repository with
                  encrypted access tokens.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift border-2 border-transparent hover:border-pink-200 transition-all">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-orange-600 rounded-xl flex items-center justify-center text-3xl mb-3 shadow-lg">
                  ⏰
                </div>
                <CardTitle className="text-xl">Precise Timing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Hourly unlock precision using GitHub Actions. Set any future
                  date and time.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift border-2 border-transparent hover:border-blue-200 transition-all">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-3xl mb-3 shadow-lg">
                  📧
                </div>
                <CardTitle className="text-xl">Email Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Recipients get emails when capsules are created and when they
                  unlock, with secure PIN access.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift border-2 border-transparent hover:border-green-200 transition-all">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-3xl mb-3 shadow-lg">
                  💰
                </div>
                <CardTitle className="text-xl">100% Free</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Uses free tiers of GitHub, Gmail, and Cloudflare. 1GB storage
                  per user.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift border-2 border-transparent hover:border-yellow-200 transition-all">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center text-3xl mb-3 shadow-lg">
                  📱
                </div>
                <CardTitle className="text-xl">WhatsApp Sharing</CardTitle>
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
        <div className="max-w-4xl mx-auto">
          <Card className="relative overflow-hidden border-2 border-purple-200 shadow-2xl hover-lift">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-3xl opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-indigo-400 to-purple-400 rounded-full blur-3xl opacity-20"></div>
            <CardContent className="relative pt-12 pb-12 text-center">
              <div className="mb-6 float">
                <span className="text-6xl">✨</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Ready to Send a Message to the Future?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Create your first time capsule in minutes. No credit card required.
                Your memories, preserved perfectly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button asChild size="lg" className="text-lg px-10 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all">
                  <Link to={isAuthenticated() ? "/create" : "/auth"}>
                    {isAuthenticated()
                      ? "🚀 Create Your First Capsule"
                      : "✨ Get Started Free"}
                  </Link>
                </Button>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                Join thousands preserving their special moments
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
