import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { capsuleService } from "@/api/services";
import type { CapsuleViewResponse, PinVerificationResponse } from "@/api/types";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LineShadowText } from "@/components/ui/line-shadow-text";
import PinInput from "@/components/PinInput";
import ContentViewer from "@/components/ContentViewer";
import PreviewContent from "@/components/PreviewContent";
import { CapsuleBackground } from "@/components/capsule/CapsuleBackground";
import { AnimatedCountdown } from "@/components/capsule/AnimatedCountdown";
import { UnlockAnimation } from "@/components/capsule/UnlockAnimation";
import { CelebrationEffect } from "@/components/capsule/CelebrationEffect";
import { CapsuleCard, childVariants } from "@/components/capsule/CapsuleCard";
import { useKonamiCode } from "@/hooks/useKonamiCode";

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
  const [lockState, setLockState] = useState<'locked' | 'unlocking' | 'unlocked'>('locked');
  const [showCelebration, setShowCelebration] = useState(false);

  // Easter egg: gift emoji click counter
  const [giftClickCount, setGiftClickCount] = useState(0);
  const [showMiniConfetti, setShowMiniConfetti] = useState(false);

  // Easter egg: Konami code
  const konamiActivated = useKonamiCode();

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
      setLockState('unlocking');

      const data = await capsuleService.verifyPin(token, pin);

      // Success sequence
      setLockState('unlocked');
      setShowCelebration(true);

      // Wait for animations before transitioning
      setTimeout(() => {
        setUnlockedData(data);
        setState("unlocked");
      }, 1000);

    } catch (err: any) {
      console.error("PIN verification failed:", err);
      const errorData = err.response?.data;

      setLockState('locked');

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

  // Easter egg: Gift emoji click handler
  const handleGiftClick = () => {
    const newCount = giftClickCount + 1;
    setGiftClickCount(newCount);

    if (newCount === 5) {
      setShowMiniConfetti(true);
      setTimeout(() => {
        setShowMiniConfetti(false);
        setGiftClickCount(0);
      }, 3000);
    }
  };

  // Konami code rainbow animation
  const konamiColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];

  // Loading state
  if (state === "loading") {
    return (
      <CapsuleBackground state="loading">
        <motion.div
          className="container mx-auto px-4 py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex justify-center items-center min-h-[400px]">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Loader2 className="h-14 w-14 md:h-16 md:w-16 lg:h-20 lg:w-20 animate-spin text-white" />
            </motion.div>
          </div>
        </motion.div>
      </CapsuleBackground>
    );
  }

  // Error state
  if (state === "error") {
    return (
      <CapsuleBackground state="loading">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <Card>
              <CardContent className="pt-6 text-center">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', damping: 10 }}
                >
                  <div className="text-6xl mb-4">❌</div>
                </motion.div>
                <motion.h2
                  className="text-2xl font-bold mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Capsule Not Found
                </motion.h2>
                <motion.p
                  className="text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {error}
                </motion.p>
              </CardContent>
            </Card>
          </div>
        </div>
      </CapsuleBackground>
    );
  }

  // Pending state (unlock time passed but email not sent yet)
  if (state === "pending") {
    return (
      <CapsuleBackground state="pending">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <CapsuleCard state="pending" maxWidth="sm">
              <motion.div variants={childVariants} className="text-center">
                <div className="text-6xl mb-4">⏳</div>
              </motion.div>
              <motion.h2 variants={childVariants} className="text-2xl font-bold mb-4 text-center text-white">
                Capsule Unlocking...
              </motion.h2>
              <motion.p variants={childVariants} className="text-white/80 mb-4 text-center">
                This capsule has reached its unlock time and is being processed.
                You should receive an email with the PIN shortly.
              </motion.p>
              <motion.p variants={childVariants} className="text-sm text-white/70 text-center">
                This usually takes less than an hour. Check your email for the
                unlock PIN.
              </motion.p>
            </CapsuleCard>
          </div>
        </div>
      </CapsuleBackground>
    );
  }

  const capsule = capsuleData?.capsule;

  if (!capsule) {
    return null;
  }

  // Countdown state (not yet unlocked)
  if (state === "countdown") {
    return (
      <>
        {/* Mini confetti for easter egg */}
        <CelebrationEffect
          trigger={showMiniConfetti}
          particleCount={30}
          duration={2000}
          onComplete={() => setShowMiniConfetti(false)}
        />

        {/* Konami code rainbow border effect */}
        <AnimatePresence>
          {konamiActivated && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 pointer-events-none z-50"
            >
              <motion.div
                className="absolute inset-0 rounded-lg"
                animate={{
                  boxShadow: konamiColors.map((color, i) =>
                    `inset 0 0 ${40 + i * 10}px ${color}`
                  ).join(', ')
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'reverse'
                }}
              />
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl"
              >
                🎮
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <CapsuleBackground state="countdown">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-2xl mx-auto">
              <CapsuleCard state="countdown">
                <motion.div
                  variants={childVariants}
                  className="text-center cursor-pointer select-none"
                  onClick={handleGiftClick}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-6xl mb-6">🎁</div>
                </motion.div>

                <motion.h1 variants={childVariants} className="text-3xl font-bold mb-4 text-center">
                  <LineShadowText shadowColor="white">
                    {capsule.title}
                  </LineShadowText>
                </motion.h1>

                {/* Sender name with gentle fade-in and delay */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-xl text-white/90 mb-8 text-center"
                >
                  From <strong>{capsule.senderName}</strong>
                </motion.p>

                {/* Preview Content (Photo + Message) */}
                <motion.div variants={childVariants}>
                  <PreviewContent
                    previewMessage={capsule.previewMessage}
                    previewPhotoUrl={capsuleData?.previewPhotoUrl}
                    className="mb-8"
                  />
                </motion.div>

                <motion.div variants={childVariants} className="flex justify-center">
                  <AnimatedCountdown
                    targetDate={new Date(capsule.unlockAt * 1000)}
                    onComplete={loadCapsule}
                  />
                </motion.div>

                {/* Metadata with subtle slide-up */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="mt-8 pt-8 border-t border-white/10"
                >
                  <p className="text-sm text-white/80 text-center">
                    This time capsule will unlock on{" "}
                    <strong className="text-white">
                      {new Date(capsule.unlockAt * 1000).toLocaleString("en-US", {
                        dateStyle: "full",
                        timeStyle: "short",
                      })}
                    </strong>
                  </p>
                  <p className="text-sm text-white/70 mt-2 text-center">
                    You'll receive an email with a PIN to open it when the time
                    comes.
                  </p>
                </motion.div>
              </CapsuleCard>
            </div>
          </div>
        </CapsuleBackground>
      </>
    );
  }

  // PIN entry state
  if (state === "pin-entry") {
    return (
      <>
        <CelebrationEffect trigger={showCelebration} onComplete={() => setShowCelebration(false)} />

        {/* Konami code rainbow border effect */}
        <AnimatePresence>
          {konamiActivated && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 pointer-events-none z-50"
            >
              <motion.div
                className="absolute inset-0"
                animate={{
                  background: [
                    `radial-gradient(circle at 50% 50%, ${konamiColors[0]}33 0%, transparent 50%)`,
                    `radial-gradient(circle at 50% 50%, ${konamiColors[1]}33 0%, transparent 50%)`,
                    `radial-gradient(circle at 50% 50%, ${konamiColors[2]}33 0%, transparent 50%)`,
                    `radial-gradient(circle at 50% 50%, ${konamiColors[3]}33 0%, transparent 50%)`,
                    `radial-gradient(circle at 50% 50%, ${konamiColors[4]}33 0%, transparent 50%)`,
                    `radial-gradient(circle at 50% 50%, ${konamiColors[5]}33 0%, transparent 50%)`
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <CapsuleBackground state="pin-entry">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-md mx-auto">
              {/* Shake entire card on PIN error */}
              <motion.div
                animate={pinError ? {
                  x: [0, -10, 10, -10, 10, 0],
                  transition: { duration: 0.5 }
                } : {}}
              >
                <CapsuleCard state="pin-entry" maxWidth="sm">
                  <motion.div variants={childVariants} className="flex justify-center mb-6">
                    <UnlockAnimation
                      state={lockState}
                      size={64}
                      onUnlockComplete={() => {}}
                    />
                  </motion.div>

                  <motion.h1 variants={childVariants} className="text-2xl font-bold mb-4 text-center text-white">
                    Time Capsule Unlocked!
                  </motion.h1>

                  {/* Sender name with gentle fade-in and delay */}
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-white/90 mb-8 text-center"
                  >
                    From <strong>{capsule.senderName}</strong>
                  </motion.p>

                  {/* Preview Content (visible during PIN entry too) */}
                  <motion.div variants={childVariants}>
                    <PreviewContent
                      previewMessage={capsule.previewMessage}
                      previewPhotoUrl={capsuleData?.previewPhotoUrl}
                      className="mb-8"
                    />
                  </motion.div>

                  <motion.p variants={childVariants} className="text-lg font-medium mb-6 text-center text-white">
                    Enter your 4-digit PIN to view
                  </motion.p>

                  <motion.div variants={childVariants}>
                    <PinInput onSubmit={handlePinSubmit} />
                  </motion.div>

                  {pinError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      className="mt-4"
                    >
                      <Alert variant="destructive">
                        <AlertDescription>{pinError}</AlertDescription>
                      </Alert>
                    </motion.div>
                  )}

                  <motion.p variants={childVariants} className="text-sm text-white/70 mt-4 text-center">
                    {remainingAttempts} attempt{remainingAttempts !== 1 ? "s" : ""}{" "}
                    remaining
                  </motion.p>

                  {/* Metadata with subtle slide-up */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="mt-8 pt-8 border-t border-white/10"
                  >
                    <p className="text-sm text-white/80 text-center">
                      Check your email for the PIN. The PIN was sent when this
                      capsule unlocked.
                    </p>
                  </motion.div>
                </CapsuleCard>
              </motion.div>
            </div>
          </div>
        </CapsuleBackground>
      </>
    );
  }

  // Unlocked state (content display)
  if (state === "unlocked" && unlockedData) {
    return (
      <>
        <CelebrationEffect trigger={true} />
        <CapsuleBackground state="unlocked">
          <motion.div
            className="container mx-auto px-4 py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <div className="max-w-4xl mx-auto">
              <CapsuleCard state="unlocked" maxWidth="lg">
                <motion.div variants={childVariants} className="text-center mb-8">
                  <div className="text-6xl mb-4">🎉</div>
                  <h1 className="text-3xl font-bold mb-2">
                    <LineShadowText shadowColor="black">
                      {capsule.title}
                    </LineShadowText>
                  </h1>
                  {/* Sender name with gentle fade-in and delay */}
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-muted-foreground"
                  >
                    From <strong>{capsule.senderName}</strong>
                  </motion.p>
                </motion.div>

                {/* Preview Content (Photo + Message) */}
                <motion.div variants={childVariants}>
                  <PreviewContent
                    previewMessage={capsule.previewMessage}
                    previewPhotoUrl={capsuleData?.previewPhotoUrl}
                    className="mb-8"
                  />
                </motion.div>

                {/* Main Content */}
                <motion.div variants={childVariants} className="mb-8">
                  <ContentViewer
                    contentType={capsule.contentType}
                    contentUrl={unlockedData.contentUrl}
                    textContent={unlockedData.capsule.textContent}
                  />
                </motion.div>

                {/* Metadata with subtle slide-up */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground"
                >
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
                </motion.div>
              </CapsuleCard>
            </div>
          </motion.div>
        </CapsuleBackground>
      </>
    );
  }

  return null;
}
