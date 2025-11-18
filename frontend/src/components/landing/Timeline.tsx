import { Link, Upload, Send } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: Link,
    title: "Connect Your Accounts",
    description:
      "Link your GitHub (for storage) and Gmail (for sending) in under 3 minutes. All your data stays in your own accounts.",
    time: "~2 min",
  },
  {
    icon: Upload,
    title: "Create Your Capsule",
    description:
      "Upload a video, audio, photo, or write a message. Set the unlock date and add the recipient's email.",
    time: "Any time",
  },
  {
    icon: Send,
    title: "Automatic Unlock",
    description:
      "We'll automatically send the capsule to your recipient when the time comes, with a secure PIN for access.",
    time: "Hourly precision",
  },
];

export function Timeline() {
  return (
    <section className="py-24 bg-background" aria-labelledby="timeline-heading">
      <div className="container mx-auto px-4">
        <motion.h2
          id="timeline-heading"
          className="text-4xl md:text-5xl font-bold text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          How It Works
        </motion.h2>
        <motion.p
          className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Three simple steps to send your message to the future
        </motion.p>

        <ol className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto list-none">
          {steps.map((step, index) => (
            <motion.li
              key={step.title}
              className="relative flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              {/* Step number badge */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg z-10" aria-label={`Step ${index + 1}`}>
                {index + 1}
              </div>

              {/* Icon container */}
              <motion.div
                className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-6 relative overflow-hidden"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                aria-hidden="true"
              >
                <step.icon className="w-12 h-12 text-primary relative z-10" aria-hidden="true" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                    delay: index * 0.3,
                  }}
                />
              </motion.div>

              <h3 className="text-2xl font-semibold mb-2">{step.title}</h3>
              <div className="inline-block px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium mb-4">
                {step.time}
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>

              {/* Connector line (hidden on last item and mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-primary/50 to-transparent" aria-hidden="true" />
              )}
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

