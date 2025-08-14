"use client";

import * as LucideIcons from "lucide-react";

import { JourneyMode, getJourneyModeLucideIcon } from "@/lib/constants/journeyModes";

interface JourneyTimelineProps {
  mode: JourneyMode;
  size?: "sm" | "lg";
  className?: string;
  children?: React.ReactNode;
}

export function JourneyTimeline({
  mode,
  size = "lg",
  className = "",
  children,
}: JourneyTimelineProps) {
  const iconName = getJourneyModeLucideIcon(mode);
  const IconComponent = LucideIcons[
    iconName as keyof typeof LucideIcons
  ] as React.ComponentType<LucideIcons.LucideProps>;

  const sizeClasses = size === "sm" ? "size-12" : "size-12 lg:size-20";
  const iconSizeClasses = size === "sm" ? "w-6 h-6" : "w-6 h-6 lg:w-10 lg:h-10";

  return (
    <div className={`relative -mb-4 flex items-start pl-12 lg:pl-20 ${className}`}>
      {/* Journey Icon with vertical line - positioned at left edge */}
      <div className="absolute top-0 bottom-0 left-0 flex flex-col items-center">
        {/* Vertical line extending upward */}
        <div className="w-0.5 h-full bg-border"></div>

        {/* Journey Icon */}
        <div
          className={`flex-shrink-0 ${sizeClasses} bg-background border-2 border-border rounded-full flex items-center justify-center relative z-10`}
        >
          {IconComponent && (
            <IconComponent className={`${iconSizeClasses} text-muted-foreground`} />
          )}
        </div>

        {/* Vertical line extending downward */}
        <div className="w-0.5 h-full bg-border"></div>
      </div>

      {/* Content rendered to the right of the icon */}
      {children}
    </div>
  );
}
