"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils/index";

interface AccordionContextType {
  openItems: Set<string>;
  toggleItem: (value: string) => void;
  type: "single" | "multiple";
}

const AccordionContext = React.createContext<AccordionContextType | null>(null);

interface AccordionProps {
  type: "single" | "multiple";
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  className?: string;
  children: React.ReactNode;
}

function Accordion({
  type,
  defaultValue,
  value,
  onValueChange,
  className,
  children,
}: AccordionProps) {
  // Initialise open items based on type and default/controlled values
  const [internalOpenItems, setInternalOpenItems] = React.useState<Set<string>>(() => {
    if (defaultValue) {
      return new Set(Array.isArray(defaultValue) ? defaultValue : [defaultValue]);
    }
    return new Set();
  });

  // Use controlled value if provided, otherwise use internal state
  const openItems = React.useMemo(() => {
    if (value !== undefined) {
      return new Set(Array.isArray(value) ? value : [value]);
    }
    return internalOpenItems;
  }, [value, internalOpenItems]);

  const toggleItem = React.useCallback(
    (itemValue: string) => {
      const newOpenItems = new Set(openItems);

      if (type === "single") {
        // For single accordion, close all others and toggle this one
        if (newOpenItems.has(itemValue)) {
          newOpenItems.clear();
        } else {
          newOpenItems.clear();
          newOpenItems.add(itemValue);
        }
      } else {
        // For multiple accordion, just toggle this item
        if (newOpenItems.has(itemValue)) {
          newOpenItems.delete(itemValue);
        } else {
          newOpenItems.add(itemValue);
        }
      }

      const newValue = Array.from(newOpenItems);

      // Update internal state if not controlled
      if (value === undefined) {
        setInternalOpenItems(newOpenItems);
      }

      // Call onChange callback
      if (onValueChange) {
        onValueChange(type === "single" ? newValue[0] || "" : newValue);
      }
    },
    [openItems, type, value, onValueChange]
  );

  const contextValue = React.useMemo(
    () => ({
      openItems,
      toggleItem,
      type,
    }),
    [openItems, toggleItem, type]
  );

  return (
    <AccordionContext.Provider value={contextValue}>
      <div className={cn("space-y-2", className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

// Context for AccordionItem to pass value to children
interface AccordionItemContextType {
  value: string;
}

const AccordionItemContext = React.createContext<AccordionItemContextType | null>(null);

interface AccordionTriggerProps {
  chevronAlign?: "left" | "right";
  className?: string;
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

function AccordionTrigger({
  chevronAlign = "right",
  className,
  children,
  onClick,
}: AccordionTriggerProps) {
  const context = React.useContext(AccordionContext);
  const accordionItem = React.useContext(AccordionItemContext);

  if (!context) {
    throw new Error("AccordionTrigger must be used within an Accordion");
  }

  if (!accordionItem) {
    throw new Error("AccordionTrigger must be used within an AccordionItem");
  }

  const { openItems, toggleItem } = context;
  const { value } = accordionItem;
  const isOpen = openItems.has(value);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    toggleItem(value);
    onClick?.(event);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "px-4 py-3 flex items-center gap-3 text-left hover:bg-muted focus:bg-muted transition-colors focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none cursor-pointer rounded-md",
        className
      )}
      aria-expanded={isOpen}
      aria-controls={`accordion-content-${value}`}
    >
      {chevronAlign === "left" && (
        <ChevronDown
          className={cn(
            "size-6 shrink-0 transition-transform duration-200",
            isOpen ? "rotate-180" : ""
          )}
        />
      )}

      {children}

      {chevronAlign === "right" && (
        <ChevronDown
          className={cn(
            "size-6 shrink-0 transition-transform duration-200",
            isOpen ? "rotate-180" : ""
          )}
        />
      )}
    </button>
  );
}

interface AccordionContentProps {
  className?: string;
  children: React.ReactNode;
}

function AccordionContent({ className, children }: AccordionContentProps) {
  const context = React.useContext(AccordionContext);
  const accordionItem = React.useContext(AccordionItemContext);

  if (!context) {
    throw new Error("AccordionContent must be used within an Accordion");
  }

  if (!accordionItem) {
    throw new Error("AccordionContent must be used within an AccordionItem");
  }

  const { openItems } = context;
  const { value } = accordionItem;
  const isOpen = openItems.has(value);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      id={`accordion-content-${value}`}
      role="region"
      aria-labelledby={`accordion-trigger-${value}`}
      className={cn("", className)}
    >
      {children}
    </div>
  );
}

// Enhanced AccordionItem with context
function AccordionItemWithContext({ value, className, children }: AccordionItemProps) {
  const contextValue = React.useMemo(() => ({ value }), [value]);

  return (
    <AccordionItemContext.Provider value={contextValue}>
      <div className={cn("", className)}>{children}</div>
    </AccordionItemContext.Provider>
  );
}

export { Accordion, AccordionItemWithContext as AccordionItem, AccordionTrigger, AccordionContent };
