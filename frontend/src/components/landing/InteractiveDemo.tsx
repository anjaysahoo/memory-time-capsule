import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { FileVideo, Image as ImageIcon, MessageSquare, Calendar } from 'lucide-react';

interface DemoStep {
  id: string;
  label: string;
  icon: React.ElementType;
  title: string;
  description: string;
  visual: React.ReactNode;
}

const demoSteps: DemoStep[] = [
  {
    id: 'upload',
    label: 'Upload',
    icon: FileVideo,
    title: 'Upload Your Media',
    description: 'Add videos (up to 100MB), photos, and messages to your time capsule.',
    visual: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="border-2 border-dashed border-primary/50 rounded-lg p-6 flex flex-col items-center justify-center bg-muted/30 hover:bg-muted/50 transition-colors">
            <FileVideo className="w-12 h-12 text-primary mb-2" />
            <p className="text-sm font-medium">Drop video here</p>
            <p className="text-xs text-muted-foreground">Up to 100MB</p>
          </div>
          <div className="border-2 border-dashed border-secondary/50 rounded-lg p-6 flex flex-col items-center justify-center bg-muted/30 hover:bg-muted/50 transition-colors">
            <ImageIcon className="w-12 h-12 text-secondary mb-2" />
            <p className="text-sm font-medium">Drop photos here</p>
            <p className="text-xs text-muted-foreground">Multiple files</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'message',
    label: 'Message',
    icon: MessageSquare,
    title: 'Write Your Message',
    description: 'Add a personal message that will be delivered with your capsule.',
    visual: (
      <div className="space-y-4">
        <div className="border-2 border-primary/30 rounded-lg p-6 bg-muted/30">
          <div className="space-y-3">
            <div className="h-4 bg-primary/20 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-primary/20 rounded w-full animate-pulse [animation-delay:100ms]"></div>
            <div className="h-4 bg-primary/20 rounded w-5/6 animate-pulse [animation-delay:200ms]"></div>
            <div className="h-4 bg-primary/20 rounded w-2/3 animate-pulse [animation-delay:300ms]"></div>
          </div>
          <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
            <MessageSquare className="w-4 h-4" />
            <span>Your heartfelt message here...</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'schedule',
    label: 'Schedule',
    icon: Calendar,
    title: 'Set Delivery Time',
    description: 'Choose exactly when your capsule should be unlocked and delivered.',
    visual: (
      <div className="space-y-4">
        <div className="border-2 border-secondary/30 rounded-lg p-6 bg-muted/30">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Date</label>
              <div className="border-2 border-secondary/50 rounded-lg p-3 bg-background">
                <Calendar className="w-5 h-5 text-secondary mx-auto" />
                <p className="text-center text-sm font-medium mt-2">Dec 25, 2025</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Time</label>
              <div className="border-2 border-secondary/50 rounded-lg p-3 bg-background">
                <div className="text-center">
                  <p className="text-2xl font-bold text-secondary">10:00</p>
                  <p className="text-xs text-muted-foreground">AM</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-secondary/10 rounded-lg">
            <p className="text-xs text-center">
              <span className="font-medium">Capsule will unlock in:</span>
              <br />
              <span className="text-lg font-bold text-secondary">402 days, 14 hours</span>
            </p>
          </div>
        </div>
      </div>
    ),
  },
];

export function InteractiveDemo() {
  const [activeTab, setActiveTab] = useState(demoSteps[0].id);

  return (
    <section className="py-24 bg-gradient-to-br from-muted/50 to-background" aria-labelledby="demo-heading">
      <div className="container px-4 mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 id="demo-heading" className="text-3xl md:text-4xl font-bold mb-4">
            See How It <span className="text-primary">Works</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Creating a time capsule is simple. Follow these steps to send your memories to the future.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8" aria-label="Interactive demo steps">
            {demoSteps.map((step) => {
              const Icon = step.icon;
              return (
                <TabsTrigger
                  key={step.id}
                  value={step.id}
                  className="flex items-center gap-2"
                  aria-label={step.title}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  {step.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {demoSteps.map((step) => (
            <TabsContent key={step.id} value={step.id} className="mt-0">
              <Card className="p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                  <div>{step.visual}</div>
                </div>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}

