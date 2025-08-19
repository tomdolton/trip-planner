import * as React from "react";

import { cn } from "@/lib/utils";

interface TripItemCardProps extends React.ComponentProps<"div"> {
  hoverEffect?: boolean;
}

export function TripItemCard({ className, hoverEffect, ...props }: TripItemCardProps) {
  return (
    <div
      data-slot="card"
      className={cn(
        "card",
        hoverEffect && "hover:shadow-sm transition hover:-translate-y-0.5",
        className
      )}
      {...props}
    />
  );
}
