import { FileVideo, Shield, Clock, Mail, Gift, Share2 } from "lucide-react";
import { NeonGradientCard } from "@/components/ui/neon-gradient-card";
import { BorderBeam } from "@/components/ui/border-beam";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const features = [
  {
    icon: FileVideo,
    title: "Rich Media Support",
    description: "Videos up to 100MB, audio files, photos, or simple text messages.",
    color: "text-purple-500",
  },
  {
    icon: Shield,
    title: "Bank-Level Security",
    description: "All content stored in your private GitHub repository with encrypted access tokens.",
    color: "text-blue-500",
  },
  {
    icon: Clock,
    title: "Hourly Precision",
    description: "Set any future date and time with hourly unlock precision using GitHub Actions.",
    color: "text-amber-500",
  },
  {
    icon: Mail,
    title: "Reliable Notifications",
    description: "Recipients get emails when capsules are created and when they unlock, with secure PIN access.",
    color: "text-red-500",
  },
  {
    icon: Gift,
    title: "Forever Free",
    description: "Uses free tiers of GitHub, Gmail, and Cloudflare. 1GB storage per user.",
    color: "text-green-500",
  },
  {
    icon: Share2,
    title: "WhatsApp Integration",
    description: "Optional WhatsApp sharing with pre-filled messages for easy communication.",
    color: "text-teal-500",
  },
];

export function Features() {
  return (
    <section className="py-24 bg-muted/50" aria-labelledby="features-heading">
      <div className="container mx-auto px-4">
        <motion.h2
          id="features-heading"
          className="text-4xl md:text-5xl font-bold text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Features
        </motion.h2>
        <motion.p
          className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Everything you need to create meaningful time capsules
        </motion.p>

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto list-none">
          {features.map((feature, index) => (
            <motion.li
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <NeonGradientCard className="h-full">
                <article className="relative">
                  <BorderBeam
                    size={200}
                    duration={3}
                    delay={index * 0.2}
                    aria-hidden="true"
                  />
                  <CardHeader>
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4`}
                      aria-hidden="true"
                    >
                      <feature.icon className={`w-7 h-7 ${feature.color}`} aria-hidden="true" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </article>
              </NeonGradientCard>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

