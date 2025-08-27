import { Button } from "./button";
import { Search, Edit3 } from "lucide-react";

interface PlaceToggleButtonProps {
  isManualEntry: boolean;
  onToggle: () => void;
  searchText?: string;
  manualText?: string;
}

export function PlaceToggleButton({
  isManualEntry,
  onToggle,
  searchText = "Search places",
  manualText = "Enter manually",
}: PlaceToggleButtonProps) {
  return (
    <Button type="button" variant="outline" size="sm" onClick={onToggle} className="text-xs">
      {isManualEntry ? (
        <>
          <Search className="mr-1 size-3" />
          {searchText}
        </>
      ) : (
        <>
          <Edit3 className="mr-1 size-3" />
          {manualText}
        </>
      )}
    </Button>
  );
}
