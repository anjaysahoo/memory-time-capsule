import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2, Gift, PackageOpen, PartyPopper } from "lucide-react";
import { capsuleService } from "@/api/services";
import type { CapsuleViewResponse, PinVerificationResponse } from "@/api/types";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DrawLineText } from "@/components/gsap/draw-line-text";
import { SwapCountdown } from "@/components/ui/swap-countdown";
import { FireworksBackground } from "@/components/animate-ui/components/backgrounds/fireworks";
import PinInput from "@/components/PinInput";
import ContentViewer from "@/components/ContentViewer";
import PreviewContent from "@/components/PreviewContent";
import { cn } from "@/lib/utils";

type ViewState =
  | "loading"
  | "countdown"
  | "pending"
  | "pin-entry"
  | "unlocked"
  | "error";

export default function Open() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("t");

  const [state, setState] = useState<ViewState>("loading");
  const [capsuleData, setCapsuleData] = useState<CapsuleViewResponse | null>(
    null
  );
  const [unlockedData, setUnlockedData] =
    useState<PinVerificationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pinError, setPinError] = useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number>(5);
  const [isMobile, setIsMobile] = useState(false);

  // Memoize fireworks colors to prevent re-creating array on every render
  const fireworksColors = useMemo(
    () => ["#10b981", "#06b6d4", "#6366f1", "#8b5cf6", "#ec4899"],
    []
  );

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!token) {
      setState("error");
      setError("Invalid or missing token");
      return;
    }

    loadCapsule();
  }, [token]);

  const loadCapsule = async () => {
    if (!token) return;

    try {
      setState("loading");
      const data = await capsuleService.view(token);
      setCapsuleData(data);

      // Determine state based on status
      if (data.status.pending) {
        setState("pending");
      } else if (data.status.unlocked && data.status.requiresPin) {
        setState("pin-entry");
        if (data.rateLimit) {
          setRemainingAttempts(data.rateLimit.remaining);
        }
      } else if (data.status.unlocked) {
        // Unlocked but no PIN required (shouldn't happen in MVP)
        setState("unlocked");
      } else {
        // Not yet unlocked - show countdown
        setState("countdown");
      }
    } catch (err: any) {
      console.error("Failed to load capsule:", err);
      setState("error");
      setError(err.response?.data?.message || "Failed to load capsule");
    }
  };

  const handleCountdownComplete = () => {
    // Reload capsule data when countdown reaches zero
    loadCapsule();
  };

  const handlePinSubmit = async (pin: string) => {
    if (!token) return;

    try {
      setPinError(null);
      const data = await capsuleService.verifyPin(token, pin);
      setUnlockedData(data);
      setState("unlocked");
    } catch (err: any) {
      console.error("PIN verification failed:", err);
      const errorData = err.response?.data;

      if (errorData?.remaining !== undefined) {
        setRemainingAttempts(errorData.remaining);
      }

      if (err.response?.status === 429) {
        setPinError("Too many attempts. Please try again in 1 hour.");
      } else {
        setPinError(errorData?.error || "Incorrect PIN. Please try again.");
      }
    }
  };

  // Loading state
  if (state === "loading") {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  // Error state
  if (state === "error") {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-6xl mb-4">❌</div>
              <h2 className="text-2xl font-bold mb-4">Capsule Not Found</h2>
              <p className="text-muted-foreground">{error}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Pending state (unlock time passed but email not sent yet)
  if (state === "pending") {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-6xl mb-4">⏳</div>
              <h2 className="text-2xl font-bold mb-4">Capsule Unlocking...</h2>
              <p className="text-muted-foreground mb-4">
                This capsule has reached its unlock time and is being processed.
                You should receive an email with the PIN shortly.
              </p>
              <p className="text-sm text-muted-foreground">
                This usually takes less than an hour. Check your email for the
                unlock PIN.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const capsule = capsuleData?.capsule;

  if (!capsule) {
    return null;
  }

  // Countdown state (not yet unlocked)
  if (state === "countdown") {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
        <FireworksBackground
          className="absolute inset-0 z-0"
          population={0.3}
          color={fireworksColors}
          fireworkSpeed={7}
        />
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-3xl mx-auto">
            <Card className="bg-transparent border-0 shadow-none">
              <CardContent className="pt-12 pb-12 text-center">
                <Gift className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-6 md:mb-8 text-white animate-pulse" />

                <div className="flex justify-center mb-6 md:mb-8 px-4">
                  <div
                    className={cn(
                      "max-w-full overflow-hidden",
                      isMobile && "scale-75 origin-center"
                    )}
                  >
                    <DrawLineText
                      text={capsule.title}
                      oneByOne={false}
                      fontSize={isMobile ? 32 : 48}
                      strokeWidth={isMobile ? 1.5 : 2}
                      wordSpacing={isMobile ? 8 : 12}
                      color="white"
                    />
                  </div>
                </div>

                <p className="text-xl text-white/80 mb-12">
                  From{" "}
                  <strong className="text-white">{capsule.senderName}</strong>
                </p>

                {/* Preview Content (Photo + Message) */}
                <PreviewContent
                  previewMessage={capsule.previewMessage}
                  previewPhotoUrl={capsuleData?.previewPhotoUrl}
                  className="mb-12"
                />

                <SwapCountdown
                  unlockAt={capsule.unlockAt}
                  onComplete={handleCountdownComplete}
                  blur={true}
                  className="mb-12"
                />

                <div className="mt-8 pt-8 border-t border-white/10">
                  <p className="text-sm text-white/70">
                    This time capsule will unlock on{" "}
                    <strong className="text-white">
                      {new Date(capsule.unlockAt * 1000).toLocaleString(
                        "en-US",
                        {
                          dateStyle: "full",
                          timeStyle: "short",
                        }
                      )}
                    </strong>
                  </p>
                  <p className="text-sm text-white/70 mt-2">
                    You'll receive an email with a PIN to open it when the time
                    comes.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // PIN entry state
  if (state === "pin-entry") {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
        <FireworksBackground
          className="absolute inset-0 z-0"
          population={0.3}
          color={fireworksColors}
          fireworkSpeed={7}
        />
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-2xl mx-auto">
            <Card className="bg-transparent border-0 shadow-none">
              <CardContent className="pt-12 pb-12 text-center">
                <PackageOpen className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-6 md:mb-8 text-white animate-bounce" />

                <div className="flex justify-center mb-6 md:mb-8 px-4">
                  <div
                    className={cn(
                      "max-w-full overflow-hidden",
                      isMobile && "scale-75 origin-center"
                    )}
                  >
                    <DrawLineText
                      text={capsule.title}
                      oneByOne={false}
                      fontSize={isMobile ? 28 : 40}
                      strokeWidth={isMobile ? 1.5 : 2}
                      wordSpacing={isMobile ? 8 : 12}
                      color="white"
                    />
                  </div>
                </div>

                <p className="text-xl text-white/80 mb-8">
                  From{" "}
                  <strong className="text-white">{capsule.senderName}</strong>
                </p>

                {/* Preview Content (visible during PIN entry too) */}
                <PreviewContent
                  previewMessage={capsule.previewMessage}
                  previewPhotoUrl={capsuleData?.previewPhotoUrl}
                  className="mb-8"
                />

                <p className="text-lg font-medium mb-6 text-white">
                  Enter your 4-digit PIN to view
                </p>

                <PinInput onSubmit={handlePinSubmit} />

                {pinError && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertDescription>{pinError}</AlertDescription>
                  </Alert>
                )}

                <p className="text-sm text-white/70 mt-4">
                  {remainingAttempts} attempt
                  {remainingAttempts !== 1 ? "s" : ""} remaining
                </p>

                <div className="mt-8 pt-8 border-t border-white/10">
                  <p className="text-sm text-white/70">
                    Check your email for the PIN. The PIN was sent when this
                    capsule unlocked.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Unlocked state (content display)
  if (state === "unlocked" && unlockedData) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
        <FireworksBackground
          className="absolute inset-0 z-0"
          population={0.3}
          color={fireworksColors}
          fireworkSpeed={7}
        />
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-transparent border-0 shadow-none">
              <CardContent className="pt-12 pb-12">
                <div className="text-center mb-8">
                  <PartyPopper className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 md:mb-8 text-white animate-pulse" />

                  <div className="flex justify-center mb-4 md:mb-6 px-4">
                    <div
                      className={cn(
                        "max-w-full overflow-hidden",
                        isMobile && "scale-75 origin-center"
                      )}
                    >
                      <DrawLineText
                        text={capsule.title}
                        oneByOne={false}
                        fontSize={isMobile ? 36 : 52}
                        strokeWidth={isMobile ? 1.5 : 2}
                        wordSpacing={isMobile ? 8 : 12}
                        color="white"
                      />
                    </div>
                  </div>

                  <p className="text-xl text-white/80">
                    From{" "}
                    <strong className="text-white">{capsule.senderName}</strong>
                  </p>
                </div>

                {/* Preview Content (Photo + Message) */}
                <PreviewContent
                  previewMessage={capsule.previewMessage}
                  previewPhotoUrl={capsuleData?.previewPhotoUrl}
                  className="mb-8"
                />

                {/* Main Content */}
                <div className="mb-8">
                  <ContentViewer
                    contentType={capsule.contentType}
                    contentUrl={unlockedData.contentUrl}
                    textContent={unlockedData.capsule.textContent}
                  />
                </div>

                <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-white/70">
                  <p>
                    Created on{" "}
                    {new Date(capsule.createdAt * 1000).toLocaleDateString(
                      "en-US",
                      {
                        dateStyle: "long",
                      }
                    )}
                  </p>
                  <p className="mt-1">
                    Unlocked on{" "}
                    {new Date(capsule.unlockAt * 1000).toLocaleString("en-US", {
                      dateStyle: "long",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
