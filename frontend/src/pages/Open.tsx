import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { capsuleService } from "@/api/services";
import type { CapsuleViewResponse, PinVerificationResponse } from "@/api/types";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Countdown from "@/components/Countdown";
import PinInput from "@/components/PinInput";
import ContentViewer from "@/components/ContentViewer";

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
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-6xl mb-6">🎁</div>
              <h1 className="text-3xl font-bold mb-4">{capsule.title}</h1>
              <p className="text-xl text-muted-foreground mb-8">
                From <strong>{capsule.senderName}</strong>
              </p>

              {capsule.previewMessage && (
                <div className="mb-8 p-4 bg-muted rounded-lg">
                  <p className="text-sm italic text-muted-foreground">
                    "{capsule.previewMessage}"
                  </p>
                </div>
              )}

              <Countdown
                targetDate={new Date(capsule.unlockAt * 1000)}
                onComplete={loadCapsule}
              />

              <div className="mt-8 pt-8 border-t">
                <p className="text-sm text-muted-foreground">
                  This time capsule will unlock on{" "}
                  <strong>
                    {new Date(capsule.unlockAt * 1000).toLocaleString("en-US", {
                      dateStyle: "full",
                      timeStyle: "short",
                    })}
                  </strong>
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  You'll receive an email with a PIN to open it when the time
                  comes.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // PIN entry state
  if (state === "pin-entry") {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-6xl mb-6">🔓</div>
              <h1 className="text-2xl font-bold mb-4">
                Time Capsule Unlocked!
              </h1>
              <p className="text-muted-foreground mb-8">
                From <strong>{capsule.senderName}</strong>
              </p>

              <p className="text-lg font-medium mb-6">
                Enter your 4-digit PIN to view
              </p>

              <PinInput onSubmit={handlePinSubmit} />

              {pinError && (
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>{pinError}</AlertDescription>
                </Alert>
              )}

              <p className="text-sm text-muted-foreground mt-4">
                {remainingAttempts} attempt{remainingAttempts !== 1 ? "s" : ""}{" "}
                remaining
              </p>

              <div className="mt-8 pt-8 border-t">
                <p className="text-sm text-muted-foreground">
                  Check your email for the PIN. The PIN was sent when this
                  capsule unlocked.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Unlocked state (content display)
  if (state === "unlocked" && unlockedData) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🎉</div>
                <h1 className="text-3xl font-bold mb-2">{capsule.title}</h1>
                <p className="text-muted-foreground">
                  From <strong>{capsule.senderName}</strong>
                </p>
              </div>

              {capsule.additionalMessage && (
                <div className="mb-6 p-4 bg-muted rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">
                    {capsule.additionalMessage}
                  </p>
                </div>
              )}

              <ContentViewer
                contentType={capsule.contentType}
                contentUrl={unlockedData.contentUrl}
                textContent={unlockedData.capsule.textContent}
                photoUrls={unlockedData.photoUrls}
              />

              <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
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
                  {new Date(capsule.unlockAt * 1000).toLocaleString(
                    "en-US",
                    {
                      dateStyle: "long",
                      timeStyle: "short",
                    }
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}
