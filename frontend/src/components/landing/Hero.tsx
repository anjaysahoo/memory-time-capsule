import { Link } from "react-router-dom";
import { ChevronDown, Gift } from "lucide-react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { motion } from "framer-motion";

// Import brand logos from svgl
import { GitHubLight, Gmail } from "@ridemountainpig/svgl-react";

interface HeroProps {
  isAuthenticated: boolean;
}

export function Hero({ isAuthenticated }: HeroProps) {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Hero section"
    >
      <BackgroundBeams className="absolute inset-0 z-0" aria-hidden="true" />

      <div
        className="absolute inset-0 bg-gradient-to-br from-primary/80 via-purple-700/80 to-secondary/80 z-0"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
          aria-hidden="true"
        >
          <Gift className="w-20 h-20 text-secondary mx-auto animate-float" />
        </motion.div>

        <AnimatedGradientText className="text-6xl md:text-7xl font-bold text-white mb-6">
          Send Messages to the{" "}
          <span className="text-secondary">Future</span>
        </AnimatedGradientText>

        <motion.p
          className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Create time capsules with videos, photos, and messages. Automatically
          delivered to anyone, anywhere, at exactly the right moment.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ShimmerButton size="lg" className="px-12 py-6 text-lg mb-8" asChild>
            <Link to={isAuthenticated ? "/create" : "/auth"}>
              {isAuthenticated ? "Create Time Capsule" : "Get Started Free"}
            </Link>
          </ShimmerButton>
        </motion.div>

        <motion.div
          className="flex items-center justify-center gap-6 text-white/80 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex items-center gap-2">
            <GitHubLight className="w-5 h-5" />
            <span>Powered by GitHub</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-white/50" />
          <div className="flex items-center gap-2">
            <Gmail className="w-5 h-5" />
            <span>Delivered via Gmail</span>
          </div>
        </motion.div>

        <motion.button
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent rounded-lg"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          onClick={() => {
            document
              .getElementById("trust-section")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
          aria-label="Scroll to next section"
        >
          <ChevronDown className="w-8 h-8" aria-hidden="true" />
        </motion.button>
      </div>
    </section>
  );
}

