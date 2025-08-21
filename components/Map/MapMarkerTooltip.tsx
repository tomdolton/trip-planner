import * as Tooltip from "@radix-ui/react-tooltip";
import * as React from "react";

interface MapMarkerTooltipProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  content: React.ReactNode;
}

export function MapMarkerTooltip({ open, onOpenChange, children, content }: MapMarkerTooltipProps) {
  return (
    <Tooltip.Root open={open} onOpenChange={onOpenChange} delayDuration={0}>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content side="top" align="center" className="z-50">
          {content}
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
