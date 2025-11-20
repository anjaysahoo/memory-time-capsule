import { useEffect, useState, createElement } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ChevronDown,
  Github,
  Mail,
  Shield,
  Gift,
  Link as LinkIcon,
  Upload,
  Send,
  FileVideo,
  FileAudio,
  FileImage,
  Calendar,
  Database,
  Clock,
  Share2,
  Cake,
  Briefcase,
  Heart,
  Camera,
  Workflow,
  Cloud,
  Code,
  Lock,
  Key,
  EyeOff,
  Hash,
  FileText,
  CheckCircle,
} from "lucide-react";
import { StarsBackground } from "@/components/animate-ui/components/backgrounds/stars";
import { LineShadowText } from "@/components/ui/line-shadow-text";
import { TextLoop } from "@/components/ui/text-loop";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

export default function Home() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState("create");

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

  const scrollToNextSection = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <div>
      {/* Section 1: Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32">
        <StarsBackground starColor="#fff" className="absolute inset-0">
          {/* Content */}
          <div className="relative z-10 max-w-6xl mx-auto px-4 py-32 text-center flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 flex flex-wrap items-center justify-center gap-4">
              <span>Send Messages to the <LineShadowText className="italic" shadowColor="white">Future</LineShadowText></span>
            </h1>

            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Preserve memories with{" "}
              <TextLoop interval={2} className="text-white font-semibold">
                <span>video</span>
                <span>photos</span>
                <span>audio</span>
                <span>message</span>
              </TextLoop>

              . &nbsp; Delivered automatically to anyone, anywhere, at the perfect moment in time.
            </p>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="relative px-12 py-6 text-lg mb-8 bg-black text-white border-white/20 hover:bg-white/10"
            >
              <Link to={isAuthenticated() ? "/create" : "/auth"}>
                <div
                  className={cn(
                    "-inset-px pointer-events-none absolute rounded-[inherit] border-2 border-transparent border-inset [mask-clip:padding-box,border-box]",
                    "[mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]"
                  )}
                >
                  <motion.div
                    className={cn(
                      "absolute aspect-square bg-gradient-to-r from-transparent via-white to-white"
                    )}
                    animate={{
                      offsetDistance: ["0%", "100%"],
                    }}
                    style={{
                      width: 20,
                      offsetPath: `rect(0 auto auto 0 round ${20}px)`,
                    }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 5,
                      ease: "linear",
                    }}
                  />
                </div>
                {isAuthenticated() ? "Create Time Capsule" : "Get Started Free"}
              </Link>
            </Button>

            <div className="flex items-center justify-center gap-6 text-white/80 text-sm">
              <Github className="w-5 h-5" />
              <span>Powered by GitHub</span>
              <Mail className="w-5 h-5" />
              <span>Delivered via Gmail</span>
            </div>

            <button
              onClick={scrollToNextSection}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
              aria-label="Scroll to next section"
            >
              <ChevronDown className="w-8 h-8 text-white/70" />
            </button>
          </div>
        </StarsBackground>
      </section>

      {/* Section 2: Trust Indicators Bar */}
      <section className="max-w-7xl mx-auto px-4 py-16 bg-white">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {[
            { icon: Github, title: "Powered by GitHub", subtitle: "Your data, your repo" },
            { icon: Mail, title: "Sent via Gmail", subtitle: "Reliable delivery" },
            { icon: Shield, title: "Encrypted Storage", subtitle: "Private & secure" },
            { icon: Gift, title: "100% Free", subtitle: "No credit card" },
          ].map((badge, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.5,
                delay: i * 0.1,
                ease: "easeOut"
              }}
              whileHover={{
                y: -4,
                transition: { duration: 0.2, ease: "easeOut" }
              }}
              whileTap={{ scale: 0.98 }}
              className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-black/5 transition-colors duration-200"
            >
              <motion.div
                className="w-12 h-12 rounded-full bg-black/10 flex items-center justify-center"
                whileHover={{
                  scale: 1.1,
                  rotate: 5,
                  backgroundColor: "rgba(0, 0, 0, 0.15)",
                  transition: { duration: 0.2, ease: "easeOut" }
                }}
              >
                <badge.icon className="w-6 h-6 text-black" />
              </motion.div>
              <h3 className="font-semibold text-sm text-center text-black">{badge.title}</h3>
              <p className="text-xs text-black/60 text-center">{badge.subtitle}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Section 3: How It Works Timeline */}
      <section className="max-w-6xl mx-auto px-4 py-24 bg-black/5">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-16 text-black"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          How It Works
        </motion.h2>

        {/* Timeline */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-16">
          {/* Horizontal line (desktop) */}
          <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-black/20">
            <motion.div
              className="h-full bg-black"
              initial={{ width: "0%" }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>

          {/* Steps */}
          {[
            {
              icon: LinkIcon,
              title: "Connect Your Accounts",
              description: "Link GitHub and Gmail in under 2 minutes with OAuth",
              badge: "~2 min",
              supporting: [Github, Mail],
            },
            {
              icon: Upload,
              title: "Create Your Capsule",
              description: "Upload videos, photos, audio, or text. Set delivery date and recipient.",
              badge: "Any time",
              supporting: [FileVideo, FileAudio, FileImage],
            },
            {
              icon: Send,
              title: "Automatic Unlock",
              description: "GitHub Actions sends your capsule via Gmail at the exact moment.",
              badge: "Hourly precision",
              supporting: [Mail, Calendar],
            },
          ].map((step, i) => (
            <motion.div
              key={i}
              className="relative flex flex-col items-center gap-4"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.3,
                delay: 0.2 + (i * 0.15),
                ease: "easeOut"
              }}
            >
              {/* Node */}
              <motion.div
                className="w-16 h-16 rounded-full bg-black flex items-center justify-center relative z-10 shadow-lg"
                whileHover={{
                  scale: 1.1,
                  boxShadow: "0 0 20px rgba(0, 0, 0, 0.3)",
                  transition: { duration: 0.2, ease: "easeOut" }
                }}
                whileTap={{ scale: 1.1 }}
              >
                <motion.div
                  whileHover={{
                    rotate: 5,
                    transition: { duration: 0.2, ease: "easeOut" }
                  }}
                >
                  <step.icon className="w-8 h-8 text-white" />
                </motion.div>
              </motion.div>

              {/* Content */}
              <div className="text-center">
                <h3 className="text-2xl md:text-3xl font-bold mb-2 text-black">{step.title}</h3>
                <p className="text-base md:text-lg text-black/60 mb-3">{step.description}</p>
                <div className="flex gap-2 justify-center items-center flex-wrap">
                  <Badge variant="secondary" className="text-xs bg-black text-white">{step.badge}</Badge>
                  {step.supporting.map((Icon, idx) => (
                    <Icon key={idx} className="w-4 h-4 text-black/60" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Section 4: Interactive Demo */}
      <section className="max-w-5xl mx-auto px-4 py-32 bg-gradient-to-b from-white to-black/5">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          See It In Action
        </motion.h2>

        <motion.p
          className="text-lg md:text-xl text-center text-black/60 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        >
          Click through a sample time capsule journey
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
        >
          <Card className="p-6 md:p-8 shadow-2xl">
            <Tabs defaultValue="create" className="w-full" onValueChange={setActiveTab}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger value="create" className="transition-all duration-150">
                    <Upload className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                    Create
                  </TabsTrigger>
                  <TabsTrigger value="storage" className="transition-all duration-150">
                    <Database className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                    Storage
                  </TabsTrigger>
                  <TabsTrigger value="delivery" className="transition-all duration-150">
                    <Mail className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                    Delivery
                  </TabsTrigger>
                </TabsList>
              </motion.div>

              <AnimatePresence mode="wait">
                <TabsContent key="create" value="create" className="min-h-[400px] md:min-h-[350px]">
                  {activeTab === "create" && (
                    <motion.div
                      initial={{ opacity: 0, x: 30, scale: 0.97 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      {/* Mockup of upload UI */}
                      <div className="border-2 border-dashed border-black/10 rounded-lg p-12 text-center bg-black/5 hover:border-black/20 transition-colors duration-200">
                        <motion.div
                          animate={{
                            y: [0, -8, 0]
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <FileVideo className="w-16 h-16 mx-auto mb-4 text-black/60" />
                        </motion.div>
                        <p className="text-black/60 font-medium mb-2">Upload your content here</p>
                        <p className="text-sm text-black/60">Videos, photos, audio, or text messages</p>
                      </div>
                    </motion.div>
                  )}
                </TabsContent>

                <TabsContent key="storage" value="storage" className="min-h-[400px] md:min-h-[350px]">
                  {activeTab === "storage" && (
                    <motion.div
                      initial={{ opacity: 0, x: 30, scale: 0.97 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      {/* Mockup of GitHub repo */}
                      <motion.div
                        className="bg-black/5 rounded-lg p-8"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      >
                        <Github className="w-12 h-12 mb-4 text-black" />
                        <p className="font-mono text-sm mb-2">capsules/birthday-message.mp4</p>
                        <p className="text-sm text-black/60">Stored securely in your private GitHub repository</p>
                      </motion.div>
                    </motion.div>
                  )}
                </TabsContent>

                <TabsContent key="delivery" value="delivery" className="min-h-[400px] md:min-h-[350px]">
                  {activeTab === "delivery" && (
                    <motion.div
                      initial={{ opacity: 0, x: 30, scale: 0.97 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      {/* Mockup of Gmail */}
                      <motion.div
                        className="bg-white border rounded-lg p-8 shadow-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      >
                        <motion.div
                          animate={{
                            scale: [1, 1.05, 1]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <Mail className="w-12 h-12 mb-4 text-black" />
                        </motion.div>
                        <h4 className="font-bold mb-2">You have a Time Capsule!</h4>
                        <p className="text-sm text-black/60">
                          A message from the past is ready to open...
                        </p>
                      </motion.div>
                    </motion.div>
                  )}
                </TabsContent>
              </AnimatePresence>
            </Tabs>

            {/* Progress dots */}
            <div className="flex gap-2 justify-center mt-6">
              {["create", "storage", "delivery"].map((tab) => (
                <motion.div
                  key={tab}
                  className="w-2 h-2 rounded-full"
                  animate={{
                    scale: activeTab === tab ? 1.4 : 1,
                    backgroundColor: activeTab === tab ? "#000000" : "#F5F5F5"
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              ))}
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Section 5: Features Grid */}
      <section className="max-w-6xl mx-auto px-4 py-24 bg-white">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-16 text-black"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          Everything You Need
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {[
            {
              icon: FileVideo,
              title: "Rich Media Support",
              description: "Videos up to 100MB, audio, photos, or text messages",
            },
            {
              icon: Shield,
              title: "Bank-Level Security",
              description: "AES-256 encryption, private GitHub storage",
            },
            {
              icon: Clock,
              title: "Hourly Precision",
              description: "GitHub Actions cron, deliver any future date",
            },
            {
              icon: Mail,
              title: "Reliable Notifications",
              description: "Gmail delivery with PIN access for security",
            },
            {
              icon: Gift,
              title: "Forever Free",
              description: "Free tiers of GitHub, Gmail, Cloudflare. 1GB storage",
            },
            {
              icon: Share2,
              title: "WhatsApp Integration",
              description: "Pre-filled sharing messages for easy distribution",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.4,
                delay: i * 0.08,
                ease: "easeOut"
              }}
            >
              <Card className="p-6 border-black/10 hover:shadow-lg transition-all duration-200">
                <motion.div
                  whileHover={{
                    y: -4,
                    transition: { duration: 0.2, ease: "easeOut" }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="w-12 h-12 rounded-lg bg-black/10 flex items-center justify-center mb-4"
                    whileHover={{
                      scale: 1.1,
                      rotate: 5,
                      backgroundColor: "rgba(0, 0, 0, 0.15)",
                      transition: { duration: 0.2, ease: "easeOut" }
                    }}
                  >
                    <feature.icon className="w-6 h-6 text-black" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-2 text-black">{feature.title}</h3>
                  <p className="text-base text-black/60">{feature.description}</p>
                </motion.div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Section 6: Use Cases */}
      <section className="max-w-7xl mx-auto px-4 py-32 bg-white">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-4 text-black"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          Real Stories, Real Connections
        </motion.h2>

        <motion.p
          className="text-xl text-center text-black/60 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        >
          See how people use time capsules to create meaningful moments
        </motion.p>

        <div className="space-y-16 md:space-y-24">
          {[
            {
              icon: Cake,
              title: "Personal Milestones",
              quote: "I recorded a message to my daughter for her 18th birthday when she was 10. She'll receive it on her special day.",
              badge: "Birthday Messages",
              gradient: "from-black/80 to-black/60",
            },
            {
              icon: Briefcase,
              title: "Professional Reminders",
              quote: "I use it for quarterly business reviews 90 days apart. Keeps me accountable to my goals.",
              badge: "Business Planning",
              gradient: "from-black/70 to-black/50",
            },
            {
              icon: Heart,
              title: "Long-Distance Connections",
              quote: "My partner's deployment is 6 months. I scheduled weekly messages to arrive every Sunday.",
              badge: "Relationship Building",
              gradient: "from-black/60 to-black/40",
            },
            {
              icon: Camera,
              title: "Family Time Capsules",
              quote: "Every New Year's Eve, we record a family video for the next year. It's become our tradition.",
              badge: "Family Traditions",
              gradient: "from-black/50 to-black/30",
            },
          ].map((useCase, i) => (
            <motion.div
              key={i}
              className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center ${
                i % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {/* Image placeholder */}
              <motion.div
                className={`relative overflow-hidden rounded-xl shadow-lg h-64 md:h-80 ${i % 2 === 1 ? 'md:order-2' : ''}`}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
              >
                <div className={`w-full h-full bg-gradient-to-br ${useCase.gradient} relative`}>
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center opacity-10"
                    whileHover={{
                      opacity: 0.15,
                      transition: { duration: 0.2, ease: "easeOut" }
                    }}
                  >
                    <useCase.icon className="w-32 h-32 text-white" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Content */}
              <motion.div
                className={i % 2 === 1 ? 'md:order-1' : ''}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center"
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
                  >
                    <useCase.icon className="w-5 h-5 text-black" />
                  </motion.div>
                  <h3 className="text-2xl md:text-3xl font-bold text-black">{useCase.title}</h3>
                </div>

                <motion.blockquote
                  className="text-lg md:text-xl text-black/60 mb-4 italic"
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
                >
                  "{useCase.quote}"
                </motion.blockquote>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.3, delay: 0.6, ease: "easeOut" }}
                >
                  <Badge variant="secondary" className="bg-black text-white">{useCase.badge}</Badge>
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Section 7: Social Proof / Tech Stack */}
      <section className="max-w-6xl mx-auto px-4 py-24 bg-black/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {/* Tech Stack */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-black">Built on Enterprise Tech</h2>
            <ul className="space-y-4">
              {[
                { icon: Github, title: "GitHub Storage", subtitle: "Private repo (1GB free)" },
                { icon: Workflow, title: "GitHub Actions", subtitle: "Cron-based (99.9% uptime)" },
                { icon: Mail, title: "Gmail API", subtitle: "OAuth2 token-based auth" },
                { icon: Cloud, title: "Cloudflare Workers", subtitle: "Edge computing (<100ms)" },
                { icon: Code, title: "React + TypeScript", subtitle: "Open source, auditable" },
              ].map((item, i) => (
                <motion.li
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-black/5 transition-colors duration-200"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.15 + (i * 0.06),
                    ease: "easeOut"
                  }}
                  whileHover={{
                    x: 4,
                    backgroundColor: "rgba(0, 0, 0, 0.08)",
                    transition: { duration: 0.2, ease: "easeOut" }
                  }}
                >
                  <motion.div
                    whileHover={{
                      scale: 1.1,
                      rotate: 5,
                      transition: { duration: 0.2, ease: "easeOut" }
                    }}
                  >
                    <item.icon className="w-6 h-6 md:w-8 md:h-8 text-black flex-shrink-0" />
                  </motion.div>
                  <div>
                    <h4 className="font-semibold text-base md:text-lg text-black">{item.title}</h4>
                    <p className="text-sm text-black/60">{item.subtitle}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Security */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-black">Security & Privacy</h2>
            <ul className="space-y-4">
              {[
                { icon: Lock, title: "AES-256 Encryption", subtitle: "All files encrypted at rest" },
                { icon: EyeOff, title: "Zero-Knowledge", subtitle: "We can't access your content" },
                { icon: Key, title: "OAuth2", subtitle: "Revocable permissions" },
                { icon: Hash, title: "PIN Protection", subtitle: "6-digit recipient PIN" },
                { icon: FileText, title: "Audit Trail", subtitle: "GitHub activity logs" },
                { icon: CheckCircle, title: "GDPR Compliant", subtitle: "EU data protection" },
              ].map((item, i) => (
                <motion.li
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-black/5 transition-colors duration-200"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.45 + (i * 0.06),
                    ease: "easeOut"
                  }}
                  whileHover={{
                    x: 4,
                    backgroundColor: "rgba(0, 0, 0, 0.08)",
                    transition: { duration: 0.2, ease: "easeOut" }
                  }}
                >
                  <motion.div
                    whileHover={{
                      scale: 1.1,
                      rotate: 5,
                      transition: { duration: 0.2, ease: "easeOut" }
                    }}
                  >
                    <item.icon className="w-6 h-6 md:w-8 md:h-8 text-black flex-shrink-0" />
                  </motion.div>
                  <div>
                    <h4 className="font-semibold text-base md:text-lg text-black">{item.title}</h4>
                    <p className="text-sm text-black/60">{item.subtitle}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Section 8: FAQ */}
      <section className="max-w-4xl mx-auto px-4 py-24 bg-white">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-4 text-black"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          Frequently Asked Questions
        </motion.h2>

        <motion.p
          className="text-center text-base md:text-lg text-black/60 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        >
          Everything you need to know about Memory Time Capsule
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        >
          <Accordion type="single" collapsible className="w-full">
            {[
              {
                q: "Is it really free?",
                a: "Yes! We use free tiers of GitHub (1GB storage), Gmail API, and Cloudflare. No hidden costs, no credit card required.",
                icon: Gift,
              },
              {
                q: "How does scheduled delivery work?",
                a: "GitHub Actions runs hourly checks. When your delivery date arrives, it automatically sends your capsule via Gmail with a PIN-protected link.",
                icon: Clock,
              },
              {
                q: "Is my content secure and private?",
                a: "Absolutely. All files are encrypted with AES-256 and stored in your private GitHub repo. We use OAuth2 for access, which you can revoke anytime.",
                icon: Shield,
              },
              {
                q: "What file types can I send?",
                a: "Videos (up to 100MB), audio files, photos, and text messages. Most common formats supported: MP4, MP3, JPG, PNG, PDF.",
                icon: FileVideo,
              },
              {
                q: "What happens if I delete my GitHub account?",
                a: "Your time capsules are stored in your repo. If you delete your account, the capsules are lost. We recommend keeping your account active or exporting data first.",
                icon: Github,
              },
              {
                q: "Can I edit or cancel a capsule after creating it?",
                a: "Yes! You can edit or delete capsules anytime before their delivery date through your dashboard.",
                icon: FileText,
              },
              {
                q: "Why do you need Gmail access?",
                a: "We use Gmail API to send delivery emails on your behalf. We only request send permissions, not read access to your existing emails.",
                icon: Mail,
              },
              {
                q: "How long can I set a capsule?",
                a: "Any future date! Create capsules for tomorrow, next year, or decades from now. GitHub Actions supports far-future scheduling.",
                icon: Calendar,
              },
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: 0.3,
                  delay: 0.3 + (i * 0.05),
                  ease: "easeOut"
                }}
              >
                <AccordionItem value={`item-${i + 1}`}>
                  <AccordionTrigger className="text-lg font-semibold hover:text-black hover:bg-black/5 px-3 md:px-4 py-3 md:py-4 transition-all duration-200 rounded-lg group">
                    <div className="flex items-center gap-3 text-left">
                      <motion.div
                        whileHover={{
                          scale: 1.1,
                          transition: { duration: 0.2, ease: "easeOut" }
                        }}
                      >
                        {createElement(faq.icon, {
                          className: "w-4 h-4 md:w-5 md:h-5 text-black flex-shrink-0"
                        })}
                      </motion.div>
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        {faq.q}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-black/60 px-3 md:px-4 py-2">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>

        <motion.p
          className="text-center mt-8 text-sm text-black/60"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.3, delay: 0.7, ease: "easeOut" }}
        >
          Still have questions?{' '}
          <motion.a
            href="/support"
            className="text-black hover:underline inline-flex items-center gap-1"
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            Contact Support
          </motion.a>
        </motion.p>
      </section>

      {/* Section 9: Final CTA */}
      <section className="max-w-3xl mx-auto px-4 py-32 mb-16">
        <motion.div
          className="bg-black rounded-2xl p-8 md:p-12 lg:p-16 text-center relative overflow-hidden border border-white/10"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          animate={{
            boxShadow: [
              "0 0 20px rgba(255, 255, 255, 0.1)",
              "0 0 30px rgba(255, 255, 255, 0.15)",
              "0 0 20px rgba(255, 255, 255, 0.1)"
            ]
          }}
          style={{
            transition: "box-shadow 6s ease-in-out infinite"
          }}
        >
          <div className="relative z-10">
            <motion.h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
            >
              Ready to Send a Message to the Future?
            </motion.h2>

            <motion.p
              className="text-base md:text-lg lg:text-xl text-white/90 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
            >
              Join thousands creating meaningful time capsules. Free forever, secure by design, ready in minutes.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.4, delay: 0.35, ease: "easeOut" }}
            >
              <Button
                asChild
                size="lg"
                variant="outline"
                className="relative px-10 md:px-12 py-5 md:py-6 text-base md:text-lg mb-4 bg-black text-white border-white/20 hover:bg-white/10"
              >
                <Link to={isAuthenticated() ? "/create" : "/auth"}>
                  <motion.div
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      transition: { duration: 0.2, ease: "easeOut" }
                    }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2"
                  >
                    <div
                      className={cn(
                        "-inset-px pointer-events-none absolute rounded-[inherit] border-2 border-transparent border-inset [mask-clip:padding-box,border-box]",
                        "[mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]"
                      )}
                    >
                      <motion.div
                        className={cn(
                          "absolute aspect-square bg-gradient-to-r from-transparent via-white to-white"
                        )}
                        animate={{
                          offsetDistance: ["0%", "100%"],
                        }}
                        style={{
                          width: 20,
                          offsetPath: `rect(0 auto auto 0 round ${20}px)`,
                        }}
                        transition={{
                          repeat: Number.POSITIVE_INFINITY,
                          duration: 5,
                          ease: "linear",
                        }}
                      />
                    </div>
                    {isAuthenticated() ? "Create Time Capsule" : "Get Started Free"}
                  </motion.div>
                </Link>
              </Button>
            </motion.div>

            <motion.p
              className="text-sm text-white/70 mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.3, delay: 0.5, ease: "easeOut" }}
            >
              No credit card required • 2 minute setup
            </motion.p>

            <motion.div
              className="flex items-center justify-center gap-4 text-white/80 text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.3, delay: 0.6, ease: "easeOut" }}
            >
              <motion.div
                className="flex items-center gap-2"
                whileHover={{
                  scale: 1.1,
                  transition: { duration: 0.2, ease: "easeOut" }
                }}
              >
                <Github className="w-5 h-5" />
                <span>GitHub</span>
              </motion.div>
              <motion.div
                className="flex items-center gap-2"
                whileHover={{
                  scale: 1.1,
                  transition: { duration: 0.2, ease: "easeOut" }
                }}
              >
                <Mail className="w-5 h-5" />
                <span>Gmail</span>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
