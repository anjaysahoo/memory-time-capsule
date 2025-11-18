import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface CTAProps {
  isAuthenticated: boolean;
}

export function CTA({ isAuthenticated }: CTAProps) {
  return (
    <section className="py-24 bg-background" aria-label="Call to action">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="max-w-3xl mx-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" aria-hidden="true" />
            <motion.div
              className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
              aria-hidden="true"
            />
            <CardContent className="pt-12 pb-12 text-center relative z-10">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="inline-block mb-4"
                aria-hidden="true"
              >
                <Sparkles className="w-12 h-12 text-primary" aria-hidden="true" />
              </motion.div>

              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Send a Message to the{" "}
                <span className="text-primary">Future?</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                Create your first time capsule in minutes. No credit card
                required.
              </p>

              <ShimmerButton size="lg" className="px-8 py-6 text-lg" asChild>
                <Link to={isAuthenticated ? "/create" : "/auth"}>
                  {isAuthenticated
                    ? "Create Your First Capsule"
                    : "Get Started Free"}
                </Link>
              </ShimmerButton>

              <p className="mt-6 text-sm text-muted-foreground">
                Join others preserving memories for the future
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

