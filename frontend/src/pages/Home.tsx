import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Hero } from "@/components/landing/Hero";
import { TrustBar } from "@/components/landing/TrustBar";
import { Timeline } from "@/components/landing/Timeline";
import { InteractiveDemo } from "@/components/landing/InteractiveDemo";
import { Features } from "@/components/landing/Features";
import { CTA } from "@/components/landing/CTA";

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
    <>
      {/* Skip to main content for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:shadow-lg"
      >
        Skip to main content
      </a>
      <main id="main-content">
        <Hero isAuthenticated={isAuthenticated()} />
        <TrustBar />
        <Timeline />
        <InteractiveDemo />
        <Features />
        <CTA isAuthenticated={isAuthenticated()} />
      </main>
    </>
  );
}
