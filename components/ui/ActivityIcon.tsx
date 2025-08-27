import { LucideIcon } from "lucide-react";
import * as LucideIcons from "lucide-react";

import { RelaxIcon } from "@/components/Icons/RelaxIcon";

import {
  ActivityType,
  getActivityTypeLucideIcon,
  getActivityTypeColor,
  isCustomSvgActivityType,
} from "@/lib/constants/activityTypes";

interface ActivityIconProps {
  activityType: ActivityType;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ActivityIcon({ activityType, size = "md", className = "" }: ActivityIconProps) {
  const backgroundColor = getActivityTypeColor(activityType);

  // Check if this activity type uses a custom SVG
  if (isCustomSvgActivityType(activityType)) {
    return (
      <div
        className={`inline-flex items-center justify-center rounded-full p-2 ${className}`}
        style={{ backgroundColor }}
      >
        {activityType === "relax" && <RelaxIcon className={getIconSizeClasses(size)} />}
      </div>
    );
  }

  // Handle Lucide icons
  const iconName = getActivityTypeLucideIcon(activityType);

  // Dynamically get the icon component from lucide-react
  const IconComponent = (LucideIcons as unknown as Record<string, LucideIcon>)[
    iconName
  ] as LucideIcon;

  if (!IconComponent) {
    const FallbackIcon = LucideIcons.HelpCircle;
    return (
      <div
        className={`inline-flex items-center justify-center rounded-full p-2 ${className}`}
        style={{ backgroundColor }}
      >
        <FallbackIcon className={getIconSizeClasses(size)} />
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full p-2 ${className}`}
      style={{ backgroundColor }}
    >
      <IconComponent className={getIconSizeClasses(size)} />
    </div>
  );
}

function getIconSizeClasses(size: "sm" | "md" | "lg"): string {
  switch (size) {
    case "sm":
      return "size-3";
    case "md":
      return "size-4";
    case "lg":
      return "size-5";
    default:
      return "size-4";
  }
}
