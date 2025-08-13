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
          <Search className="h-3 w-3 mr-1" />
          {searchText}
        </>
      ) : (
        <>
          <Edit3 className="h-3 w-3 mr-1" />
          {manualText}
        </>
      )}
    </Button>
  );
}
