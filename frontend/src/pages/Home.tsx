import { useEffect } from "react";
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

  const scrollToNextSection = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <div>
      {/* Section 1: Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-purple-700 to-secondary">
        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-32 text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            Send Messages to the <span className="text-secondary">Future</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            Create time capsules with videos, photos, and messages.
            Automatically delivered to anyone, anywhere, at exactly the right moment.
          </p>

          <Button
            asChild
            size="lg"
            className="px-12 py-6 text-lg mb-8 bg-white text-primary hover:bg-white/90 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
          >
            <Link to={isAuthenticated() ? "/create" : "/auth"}>
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
      </section>

      {/* Section 2: Trust Indicators Bar */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Github, title: "Powered by GitHub", subtitle: "Your data, your repo" },
            { icon: Mail, title: "Sent via Gmail", subtitle: "Reliable delivery" },
            { icon: Shield, title: "Encrypted Storage", subtitle: "Private & secure" },
            { icon: Gift, title: "100% Free", subtitle: "No credit card" },
          ].map((badge, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <badge.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-sm text-center">{badge.title}</h3>
              <p className="text-xs text-muted-foreground text-center">{badge.subtitle}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: How It Works Timeline */}
      <section className="max-w-6xl mx-auto px-4 py-24 bg-muted/20">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
          How It Works
        </h2>

        {/* Timeline */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-16">
          {/* Horizontal line (desktop) */}
          <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-border">
            <div className="h-full bg-primary w-full" />
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
            <div key={i} className="relative flex flex-col items-center gap-4">
              {/* Node */}
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center relative z-10 shadow-lg">
                <step.icon className="w-8 h-8 text-white" />
              </div>

              {/* Content */}
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground mb-3">{step.description}</p>
                <div className="flex gap-2 justify-center items-center flex-wrap">
                  <Badge variant="secondary" className="text-xs">{step.badge}</Badge>
                  {step.supporting.map((Icon, idx) => (
                    <Icon key={idx} className="w-4 h-4 text-muted-foreground" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4: Interactive Demo */}
      <section className="max-w-5xl mx-auto px-4 py-32 bg-gradient-to-b from-background to-muted/30">
        <h2 className="text-4xl font-bold text-center mb-4">See It In Action</h2>
        <p className="text-lg text-center text-muted-foreground mb-8">
          Click through a sample time capsule journey
        </p>

        <Card className="p-8 shadow-2xl">
          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="create">
                <Upload className="w-4 h-4 mr-2" />
                Create
              </TabsTrigger>
              <TabsTrigger value="storage">
                <Database className="w-4 h-4 mr-2" />
                Storage
              </TabsTrigger>
              <TabsTrigger value="delivery">
                <Mail className="w-4 h-4 mr-2" />
                Delivery
              </TabsTrigger>
            </TabsList>

            <TabsContent value="create" className="min-h-[400px]">
              {/* Mockup of upload UI */}
              <div className="border-2 border-dashed border-muted rounded-lg p-12 text-center bg-muted/20">
                <FileVideo className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground font-medium mb-2">Upload your content here</p>
                <p className="text-sm text-muted-foreground">Videos, photos, audio, or text messages</p>
              </div>
            </TabsContent>

            <TabsContent value="storage" className="min-h-[400px]">
              {/* Mockup of GitHub repo */}
              <div className="bg-muted/50 rounded-lg p-8">
                <Github className="w-12 h-12 mb-4 text-primary" />
                <p className="font-mono text-sm mb-2">capsules/birthday-message.mp4</p>
                <p className="text-sm text-muted-foreground">Stored securely in your private GitHub repository</p>
              </div>
            </TabsContent>

            <TabsContent value="delivery" className="min-h-[400px]">
              {/* Mockup of Gmail */}
              <div className="bg-white border rounded-lg p-8 shadow-sm">
                <Mail className="w-12 h-12 mb-4 text-primary" />
                <h4 className="font-bold mb-2">You have a Time Capsule!</h4>
                <p className="text-sm text-muted-foreground">
                  A message from the past is ready to open...
                </p>
              </div>
            </TabsContent>
          </Tabs>

          {/* Progress dots */}
          <div className="flex gap-2 justify-center mt-6">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <div className="w-2 h-2 rounded-full bg-muted" />
            <div className="w-2 h-2 rounded-full bg-muted" />
          </div>
        </Card>
      </section>

      {/* Section 5: Features Grid */}
      <section className="max-w-6xl mx-auto px-4 py-24">
        <h2 className="text-4xl font-bold text-center mb-16">Everything You Need</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
            <Card
              key={i}
              className="p-6 group hover:shadow-lg hover:-translate-y-2 transition-all duration-250"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Section 6: Use Cases */}
      <section className="max-w-7xl mx-auto px-4 py-32 bg-gradient-to-b from-background via-muted/10 to-background">
        <h2 className="text-4xl font-bold text-center mb-4">Real Stories, Real Connections</h2>
        <p className="text-xl text-center text-muted-foreground mb-16">
          See how people use time capsules to create meaningful moments
        </p>

        <div className="space-y-16">
          {[
            {
              icon: Cake,
              title: "Personal Milestones",
              quote: "I recorded a message to my daughter for her 18th birthday when she was 10. She'll receive it on her special day.",
              badge: "Birthday Messages",
              gradient: "from-pink-500 to-rose-500",
            },
            {
              icon: Briefcase,
              title: "Professional Reminders",
              quote: "I use it for quarterly business reviews 90 days apart. Keeps me accountable to my goals.",
              badge: "Business Planning",
              gradient: "from-blue-500 to-cyan-500",
            },
            {
              icon: Heart,
              title: "Long-Distance Connections",
              quote: "My partner's deployment is 6 months. I scheduled weekly messages to arrive every Sunday.",
              badge: "Relationship Building",
              gradient: "from-red-500 to-pink-500",
            },
            {
              icon: Camera,
              title: "Family Time Capsules",
              quote: "Every New Year's Eve, we record a family video for the next year. It's become our tradition.",
              badge: "Family Traditions",
              gradient: "from-purple-500 to-indigo-500",
            },
          ].map((useCase, i) => (
            <div
              key={i}
              className={`grid md:grid-cols-2 gap-12 items-center ${
                i % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Image placeholder */}
              <div className={`relative overflow-hidden rounded-xl shadow-lg h-80 ${i % 2 === 1 ? 'md:order-2' : ''}`}>
                <div className={`w-full h-full bg-gradient-to-br ${useCase.gradient}`} />
              </div>

              {/* Content */}
              <div className={i % 2 === 1 ? 'md:order-1' : ''}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                    <useCase.icon className="w-5 h-5 text-secondary" />
                  </div>
                  <h3 className="text-2xl font-bold">{useCase.title}</h3>
                </div>
                <blockquote className="text-lg text-muted-foreground mb-4 italic">
                  "{useCase.quote}"
                </blockquote>
                <Badge variant="secondary">{useCase.badge}</Badge>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 7: Social Proof / Tech Stack */}
      <section className="max-w-6xl mx-auto px-4 py-24 bg-muted/50">
        <div className="grid md:grid-cols-2 gap-16">
          {/* Tech Stack */}
          <div>
            <h2 className="text-3xl font-bold mb-8">Built on Enterprise Tech</h2>
            <ul className="space-y-4">
              {[
                { icon: Github, title: "GitHub Storage", subtitle: "Private repo (1GB free)" },
                { icon: Workflow, title: "GitHub Actions", subtitle: "Cron-based (99.9% uptime)" },
                { icon: Mail, title: "Gmail API", subtitle: "OAuth2 token-based auth" },
                { icon: Cloud, title: "Cloudflare Workers", subtitle: "Edge computing (<100ms)" },
                { icon: Code, title: "React + TypeScript", subtitle: "Open source, auditable" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <item.icon className="w-8 h-8 text-primary flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Security */}
          <div>
            <h2 className="text-3xl font-bold mb-8">Security & Privacy</h2>
            <ul className="space-y-4">
              {[
                { icon: Lock, title: "AES-256 Encryption", subtitle: "All files encrypted at rest" },
                { icon: EyeOff, title: "Zero-Knowledge", subtitle: "We can't access your content" },
                { icon: Key, title: "OAuth2", subtitle: "Revocable permissions" },
                { icon: Hash, title: "PIN Protection", subtitle: "6-digit recipient PIN" },
                { icon: FileText, title: "Audit Trail", subtitle: "GitHub activity logs" },
                { icon: CheckCircle, title: "GDPR Compliant", subtitle: "EU data protection" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <item.icon className="w-8 h-8 text-primary flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Section 8: FAQ */}
      <section className="max-w-4xl mx-auto px-4 py-24 bg-background">
        <h2 className="text-4xl font-bold text-center mb-4">Frequently Asked Questions</h2>
        <p className="text-center text-muted-foreground mb-12">
          Everything you need to know about Memory Time Capsule
        </p>

        <Accordion type="single" collapsible className="w-full">
          {[
            {
              q: "Is it really free?",
              a: "Yes! We use free tiers of GitHub (1GB storage), Gmail API, and Cloudflare. No hidden costs, no credit card required.",
            },
            {
              q: "How does scheduled delivery work?",
              a: "GitHub Actions runs hourly checks. When your delivery date arrives, it automatically sends your capsule via Gmail with a PIN-protected link.",
            },
            {
              q: "Is my content secure and private?",
              a: "Absolutely. All files are encrypted with AES-256 and stored in your private GitHub repo. We use OAuth2 for access, which you can revoke anytime.",
            },
            {
              q: "What file types can I send?",
              a: "Videos (up to 100MB), audio files, photos, and text messages. Most common formats supported: MP4, MP3, JPG, PNG, PDF.",
            },
            {
              q: "What happens if I delete my GitHub account?",
              a: "Your time capsules are stored in your repo. If you delete your account, the capsules are lost. We recommend keeping your account active or exporting data first.",
            },
            {
              q: "Can I edit or cancel a capsule after creating it?",
              a: "Yes! You can edit or delete capsules anytime before their delivery date through your dashboard.",
            },
            {
              q: "Why do you need Gmail access?",
              a: "We use Gmail API to send delivery emails on your behalf. We only request send permissions, not read access to your existing emails.",
            },
            {
              q: "How long can I set a capsule?",
              a: "Any future date! Create capsules for tomorrow, next year, or decades from now. GitHub Actions supports far-future scheduling.",
            },
          ].map((faq, i) => (
            <AccordionItem key={i} value={`item-${i + 1}`}>
              <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <p className="text-center mt-8 text-sm text-muted-foreground">
          Still have questions?{' '}
          <a href="/support" className="text-primary hover:underline">
            Contact Support
          </a>
        </p>
      </section>

      {/* Section 9: Final CTA */}
      <section className="max-w-3xl mx-auto px-4 py-32 mb-16">
        <div className="bg-gradient-to-br from-primary via-purple-700 to-secondary rounded-2xl p-16 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Send a Message to the Future?
            </h2>

            <p className="text-xl text-white/90 mb-8">
              Join thousands creating meaningful time capsules. Free forever, secure by design, ready in minutes.
            </p>

            <Button
              asChild
              size="lg"
              className="px-12 py-6 text-lg mb-4 bg-white text-primary hover:bg-white/90 shadow-xl"
            >
              <Link to={isAuthenticated() ? "/create" : "/auth"}>
                {isAuthenticated() ? "Create Time Capsule" : "Get Started Free"}
              </Link>
            </Button>

            <p className="text-sm text-white/70 mb-8">
              No credit card required • 2 minute setup
            </p>

            <div className="flex items-center justify-center gap-4 text-white/80 text-sm">
              <Github className="w-5 h-5" />
              <span>GitHub</span>
              <Mail className="w-5 h-5" />
              <span>Gmail</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
