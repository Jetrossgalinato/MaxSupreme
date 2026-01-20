"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  CheckCircle2,
  BarChart3,
  Users,
  MessageSquare,
  Zap,
} from "lucide-react";
import { TypographyH3, TypographyMuted } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: <MessageSquare className="w-6 h-6 text-blue-500" />,
    title: "Unified Inbox",
    description:
      "Consolidate conversations from SMS, Email, Facebook Messenger, and Instagram DM into a single stream.",
  },
  {
    icon: <Zap className="w-6 h-6 text-yellow-500" />,
    title: "Marketing Automation",
    description:
      "Build powerful workflows to nurture leads automatically. Trigger actions based on behavior and engagement.",
  },
  {
    icon: <Users className="w-6 h-6 text-rose-500" />,
    title: "CRM & Pipeline",
    description:
      "Visual pipelines to track opportunities. Move leads through stages and never lose track of a potential sale.",
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-purple-500" />,
    title: "Analytics & Reporting",
    description:
      "Deep insights into your campaign performance, call tracking, and team productivity.",
  },
  {
    icon: <CheckCircle2 className="w-6 h-6 text-green-500" />,
    title: "Reputation Management",
    description:
      "Automate review requests and manage your online reputation across Google and Facebook.",
  },
  {
    icon: <Zap className="w-6 h-6 text-orange-500" />,
    title: "Funnel Builder",
    description:
      "Construct high-converting landing pages and funnels with our intuitive drag-and-drop editor.",
  },
];

export default function FeaturesCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollTo = (index: number) => {
    const container = scrollRef.current;
    if (!container) return;

    const child = container.children[index] as HTMLElement;
    if (child) {
      // Calculate the center position
      const targetScroll =
        child.offsetLeft - (container.offsetWidth - child.offsetWidth) / 2;
      container.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };

  // Track active index on scroll
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      // Simple logic: find which child is closest to the left edge
      const scrollLeft = container.scrollLeft;
      let minDistance = Infinity;
      let newIndex = 0;

      Array.from(container.children).forEach((child, index) => {
        const htmlChild = child as HTMLElement;
        const distance = Math.abs(htmlChild.offsetLeft - scrollLeft);
        if (distance < minDistance) {
          minDistance = distance;
          newIndex = index;
        }
      });

      setActiveIndex(newIndex);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-full">
      {/* Carousel Container */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8 gap-4 md:gap-8 px-[10%] md:px-[20%]"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {features.map((feature, index) => (
          <div
            key={index}
            className={cn(
              "flex-shrink-0 w-full snap-center transition-all duration-500 ease-in-out",
              // This logic handles the blur and scale of inactive cards
              activeIndex !== index
                ? "blur-[1px] opacity-60 scale-90"
                : "blur-0 opacity-100 scale-100",
            )}
          >
            <div className="max-w-4xl mx-auto h-full">
              <FeatureCard {...feature} />
            </div>
          </div>
        ))}
      </div>

      {/* Custom Selector / Indicators */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {features.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              activeIndex === index
                ? "w-8 bg-blue-600" // Active pill
                : "w-2 bg-gray-300 hover:bg-gray-400", // Inactive dot
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
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
    <div className="flex flex-col items-center justify-center text-center h-full min-h-[400px] p-8 md:p-12 rounded-2xl border bg-card hover:shadow-lg transition-all duration-300 group">
      <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
        {React.cloneElement(
          icon as React.ReactElement<{ className?: string }>,
          {
            className: cn(
              "w-8 h-8",
              (icon as React.ReactElement<{ className?: string }>).props
                .className,
            ),
          },
        )}
      </div>
      <TypographyH3 className="text-2xl mb-4">{title}</TypographyH3>
      <TypographyMuted className="text-lg max-w-2xl">
        {description}
      </TypographyMuted>
    </div>
  );
}
