"use client";

import * as LucideIcons from "lucide-react";

import { JourneyMode, getJourneyModeLucideIcon } from "@/lib/constants/journeyModes";

interface JourneyIconProps {
  mode: JourneyMode;
  className?: string;
  size?: number | "sm" | "lg";
}

export function JourneyIcon({ mode, className = "", size = 24 }: JourneyIconProps) {
  const iconName = getJourneyModeLucideIcon(mode);
  const IconComponent = LucideIcons[
    iconName as keyof typeof LucideIcons
  ] as React.ComponentType<LucideIcons.LucideProps>;

  // Convert string sizes to numbers for consistency
  const iconSize = typeof size === "string" ? (size === "sm" ? 16 : 24) : size;

  if (!IconComponent) {
    const HelpCircle = LucideIcons.HelpCircle;
    return <HelpCircle className={className} size={iconSize} />;
  }

  return <IconComponent className={className} size={iconSize} />;
}
