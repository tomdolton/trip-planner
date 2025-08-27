"use client";

import * as LucideIcons from "lucide-react";

import { JourneyMode, getJourneyModeLucideIcon } from "@/lib/constants/journeyModes";
import { cn } from "@/lib/utils";

interface JourneyTimelineProps {
  mode: JourneyMode;
  size?: "sm" | "lg";
  className?: string;
  children?: React.ReactNode;
  showUpwardLine?: boolean;
  showDownwardLine?: boolean;
}

export function JourneyTimeline({
  mode,
  size = "lg",
  className = "",
  children,
  showUpwardLine = true,
  showDownwardLine = true,
}: JourneyTimelineProps) {
  const iconName = getJourneyModeLucideIcon(mode);
  const IconComponent = LucideIcons[
    iconName as keyof typeof LucideIcons
  ] as React.ComponentType<LucideIcons.LucideProps>;

  const sizeClasses = size === "sm" ? "size-12" : "size-20";
  const iconSizeClasses = size === "sm" ? "size-6" : "size-10";

  return (
    <div className={cn("relative flex items-start @md:-mb-4 @md:pl-20", className)}>
      {/* Journey Icon with vertical line - positioned at left edge */}
      <div className="absolute top-10 right-0 left-0 flex items-center justify-center @md:top-0 @md:right-[unset] @md:bottom-0 @md:left-0">
        {/* Vertical line extending upward */}
        {showUpwardLine && (
          <div className="bg-border absolute top-0 left-1/2 h-1/2 w-0.5 -translate-x-1/2 transform"></div>
        )}

        {/* Journey Icon - centered */}
        <div
          className={`flex-shrink-0 ${sizeClasses} bg-background border-border relative z-10 flex items-center justify-center rounded-full border-2`}
        >
          {IconComponent && (
            <IconComponent className={`${iconSizeClasses} text-muted-foreground`} />
          )}
        </div>

        {/* Vertical line extending downward */}
        {showDownwardLine && (
          <div className="bg-border absolute bottom-0 left-1/2 h-1/2 w-0.5 -translate-x-1/2 transform"></div>
        )}
      </div>

      {/* Content rendered to the right of the icon */}
      {children}
    </div>
  );
}
