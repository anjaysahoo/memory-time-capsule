import { Shield, Gift } from "lucide-react";
import { GitHubLight, Gmail } from "@ridemountainpig/svgl-react";
import { motion } from "framer-motion";

const badges = [
  {
    icon: "github",
    title: "Powered by GitHub",
    subtitle: "Your data, your repo",
  },
  {
    icon: "gmail",
    title: "Sent via Gmail",
    subtitle: "Reliable delivery",
  },
  {
    icon: "shield",
    title: "Encrypted Storage",
    subtitle: "Private & secure",
  },
  {
    icon: "gift",
    title: "100% Free",
    subtitle: "No credit card",
  },
];

export function TrustBar() {
  return (
    <section id="trust-section" className="bg-muted/30 py-16" aria-label="Trust indicators">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto" role="list">
          {badges.map((badge, index) => (
            <motion.div
              key={badge.title}
              className="flex flex-col items-center text-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              role="listitem"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center" aria-hidden="true">
                {badge.icon === "github" && (
                  <GitHubLight className="w-8 h-8 text-primary" />
                )}
                {badge.icon === "gmail" && (
                  <Gmail className="w-8 h-8 text-primary" />
                )}
                {badge.icon === "shield" && (
                  <Shield className="w-8 h-8 text-primary" />
                )}
                {badge.icon === "gift" && (
                  <Gift className="w-8 h-8 text-primary" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{badge.title}</h3>
                <p className="text-sm text-muted-foreground">{badge.subtitle}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

