import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ActionMenuProps = {
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
};

export function ActionMenu({ children, side = "bottom", className }: ActionMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8 p-0", className)}
          aria-label="Open actions"
        >
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side={side} onClick={(e) => e.stopPropagation()}>
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// For convenience, export the menu item and separator
export { DropdownMenuItem as ActionMenuItem, DropdownMenuSeparator as ActionMenuSeparator };
