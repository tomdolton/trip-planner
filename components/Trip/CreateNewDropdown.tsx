"use client";

import { Plus, ChevronDown, FolderPlus, MapPin } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { cn } from "@/lib/utils";

interface CreateNewDropdownProps {
  onAddPhase: () => void;
  onAddLocation: () => void;
  className?: string;
  buttonLabel?: string;
  buttonProps?: React.ComponentProps<typeof Button>;
}

export function CreateNewDropdown({
  onAddPhase,
  onAddLocation,
  className = "",
  buttonLabel = "Create New",
  buttonProps = {},
}: CreateNewDropdownProps) {
  return (
    <div className={cn(className, "w-full md:w-auto")}>
      {/* Mobile: flex row, two buttons, visible below md */}
      <div className="flex w-full justify-start gap-4 md:hidden">
        <Button className="flex-1" onClick={onAddPhase} variant="default">
          <Plus className="size-4" />
          <span>Phase</span>
        </Button>
        <Button className="flex-1" onClick={onAddLocation} variant="secondary">
          <Plus className="size-4" />
          <span>Location</span>
        </Button>
      </div>

      {/* Desktop: dropdown, visible md and up */}
      <div className="hidden md:block">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-full" {...buttonProps}>
              <Plus className="size-4" />
              {buttonLabel}
              <ChevronDown className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-40">
            <DropdownMenuItem
              className="flex cursor-pointer items-center gap-2 py-2"
              onSelect={onAddPhase}
            >
              <FolderPlus className="size-4" />
              <span>Phase</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex cursor-pointer items-center gap-2 border-t py-2"
              onSelect={onAddLocation}
            >
              <MapPin className="size-4" />
              <span>Location</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
