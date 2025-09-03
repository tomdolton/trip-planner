"use client";

import * as React from "react";
import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  // Safely parse the date, handling invalid dates
  const selectedDate = React.useMemo(() => {
    if (!value) return undefined;
    try {
      const date = new Date(value);
      // Check if the date is valid
      if (isNaN(date.getTime())) return undefined;
      return date;
    } catch {
      return undefined;
    }
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="input"
          className={cn(
            "w-full justify-between font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          {selectedDate ? format(selectedDate, "dd MMM yyyy") : placeholder}
          <ChevronDownIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            if (date) {
              onChange(format(date, "yyyy-MM-dd"));
              setOpen(false);
            }
          }}
          captionLayout="dropdown"
        />
      </PopoverContent>
    </Popover>
  );
}
