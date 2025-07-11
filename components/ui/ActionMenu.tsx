import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

type ActionMenuProps = {
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
};

export function ActionMenu({ children, side = "bottom" }: ActionMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0" aria-label="Open actions">
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
