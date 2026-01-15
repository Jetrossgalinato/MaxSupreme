import Navbar from "./components/navbar";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  BarChart3,
  Users,
  MessageSquare,
  Zap,
} from "lucide-react";
import {
  TypographyH1,
  TypographyLead,
  TypographyH2,
  TypographyH3,
  TypographyP,
  TypographyMuted,
  TypographyH4,
  TypographySmall,
} from "@/components/ui/typography";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/20">
      <Navbar />

      <main className="pt-50 pb-16">
        {/* Hero Section */}
        <section className="px-6 max-w-7xl mx-auto mb-24 md:mb-32">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 text-center lg:text-left space-y-8">
              <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                <TypographySmall className="flex h-2 w-2 rounded-full bg-blue-600 mr-2"></TypographySmall>
                Powered by Next-Gen Intelligence
              </div>
              <TypographyH1>
                Scale Your Agency with{" "}
                <span className="text-rose-500">Automated</span> Intelligence
              </TypographyH1>
              <TypographyLead className="max-w-2xl mx-auto lg:mx-0">
                The ultimate platform for agencies and marketers. Manage leads,
                automate follow-ups, and grow your revenue—all from one
                centralized dashboard.
              </TypographyLead>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button className="h-11 px-8 rounded-full bg-foreground text-background font-medium hover:bg-foreground/90 transition-all flex items-center gap-2">
                  Start Free Trial <ArrowRight className="w-4 h-4" />
                </button>
                <button className="h-11 px-8 rounded-full border border-border bg-background hover:bg-muted font-medium transition-all">
                  Book a Demo
                </button>
              </div>
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" /> No credit
                  card required
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" /> 14-day
                  free trial
                </div>
              </div>
            </div>

            <div className="flex-1 w-full relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-rose-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative rounded-2xl border bg-card overflow-hidden shadow-2xl">
                {/* Placeholder for Hero Dashboard Image */}
                <div className="aspect-[16/10] relative bg-muted/50 flex items-center justify-center text-muted-foreground">
                  <Image
                    src="/hero-dashboard.png"
                    alt="Dashboard Preview"
                    width={800}
                    height={500}
                    className="object-cover w-full h-full dark:brightness-75"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="px-6 max-w-7xl mx-auto mb-24">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <TypographyH2 className="text-3xl md:text-5xl font-bold mb-6">
              Everything you need to grow
            </TypographyH2>
            <TypographyLead className="text-lg text-muted-foreground">
              Stop stitching together multiple tools. We integrate directly with
              industry-leading platforms to provide a seamless experience for
              lead management and automation.
            </TypographyLead>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<MessageSquare className="w-6 h-6 text-blue-500" />}
              title="Unified Inbox"
              description="Consolidate conversations from SMS, Email, Facebook Messenger, and Instagram DM into a single stream."
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6 text-yellow-500" />}
              title="Marketing Automation"
              description="Build powerful workflows to nurture leads automatically. Trigger actions based on behavior and engagement."
            />
            <FeatureCard
              icon={<Users className="w-6 h-6 text-rose-500" />}
              title="CRM & Pipeline"
              description="Visual pipelines to track opportunities. Move leads through stages and never lose track of a potential sale."
            />
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6 text-purple-500" />}
              title="Analytics & Reporting"
              description="Deep insights into your campaign performance, call tracking, and team productivity."
            />
            <FeatureCard
              icon={<CheckCircle2 className="w-6 h-6 text-green-500" />}
              title="Reputation Management"
              description="Automate review requests and manage your online reputation across Google and Facebook."
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6 text-orange-500" />}
              title="Funnel Builder"
              description="Construct high-converting landing pages and funnels with our intuitive drag-and-drop editor."
            />
          </div>
        </section>

        {/* Feature Highlight Section (Alternating) */}
        <section className="px-6 max-w-7xl mx-auto mb-24 space-y-24">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 relative aspect-square md:aspect-video w-full bg-muted rounded-2xl overflow-hidden border">
              <Image
                src="/Automation.png"
                alt="Automation Builder"
                width={600}
                height={400}
                className="object-cover w-full h-full dark:brightness-75"
              />
            </div>
            <div className="flex-1 space-y-6">
              <div className="inline-block p-2 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                <Zap className="w-6 h-6" />
              </div>
              <TypographyH2 className="text-3xl font-bold border-none">
                Automate Your Entire Business
              </TypographyH2>
              <TypographyLead className="text-lg">
                Save time and reduce errors by automating repetitive tasks. From
                appointment reminders to birthday wishes, let our intelligent
                workflows handle it all while you focus on strategy.
              </TypographyLead>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary" />{" "}
                  Drag-and-drop workflow builder
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary" />{" "}
                  Multi-channel campaigns (SMS, Email, Voice)
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary" /> AI-powered
                  response handling
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row-reverse items-center gap-12">
            <div className="flex-1 relative aspect-square md:aspect-video w-full bg-muted rounded-2xl overflow-hidden border">
              <Image
                src="/template.png"
                alt="Funnel Builder"
                width={600}
                height={400}
                className="object-cover w-full h-full dark:brightness-75"
              />
            </div>
            <div className="flex-1 space-y-6">
              <div className="inline-block p-2 rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">
                <BarChart3 className="w-6 h-6" />
              </div>
              <TypographyH2 className="text-3xl font-bold border-none">
                Capture & Convert More Leads
              </TypographyH2>
              <TypographyLead className="text-lg">
                Create stunning landing pages, surveys, and forms that convert
                visitors into leads. Our integration ensures every submission is
                instantly synced and actionable.
              </TypographyLead>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary" />{" "}
                  High-converting templates included
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary" /> Integrated
                  calendar booking
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary" /> A/B testing
                  capabilities
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 max-w-5xl mx-auto mb-16">
          <div className="bg-primary text-primary-foreground rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <TypographyH2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10 border-none">
              Ready to transform your agency?
            </TypographyH2>
            <TypographyP className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto relative z-10">
              Join thousands of marketers who are saving time and closing more
              deals with our powerful platform.
            </TypographyP>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <button className="h-12 px-8 rounded-full bg-background text-foreground font-bold hover:bg-background/90 transition-all">
                Get Started Now
              </button>
              <button className="h-12 px-8 rounded-full border border-primary-foreground/30 hover:bg-primary-foreground/10 transition-all font-medium">
                View Pricing
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Logo"
                width={40}
                height={40}
                className="flex-shrink-0"
              />
              <div className="font-bold text-xl">MaxSupreme</div>
            </div>
            <TypographyMuted>
              Empowering agencies with next-gen automation and CRM tools.
            </TypographyMuted>
          </div>
          <div>
            <TypographyH4 className="mb-4">Product</TypographyH4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Integrations
                </a>
              </li>
            </ul>
          </div>
          <div>
            <TypographyH4 className="mb-4">Resources</TypographyH4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Community
                </a>
              </li>
            </ul>
          </div>
          <div>
            <TypographyH4 className="mb-4">Legal</TypographyH4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} MaxSupreme. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-2xl border bg-card hover:shadow-lg transition-all duration-300 group">
      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <TypographyH3 className="text-xl mb-2">{title}</TypographyH3>
      <TypographyMuted>{description}</TypographyMuted>
    </div>
  );
}
