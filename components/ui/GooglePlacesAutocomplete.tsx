"use client";

import { useState, useCallback, useMemo } from "react";
import debounce from "lodash.debounce";

import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

import { GooglePlaceResult } from "@/types/google-places";

interface GooglePlacesAutocompleteProps {
  onPlaceSelected: (place: GooglePlaceResult) => void;
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  autoFocus?: boolean;
  "aria-invalid"?: boolean;
}

export function GooglePlacesAutocomplete({
  onPlaceSelected,
  placeholder = "Search for a place...",
  className,
  value,
  onChange,
  autoFocus,
  "aria-invalid": ariaInvalid,
}: GooglePlacesAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value || "");
  const [suggestions, setSuggestions] = useState<GooglePlaceResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchPlaces = useCallback(async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/places/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.places || []);
        setShowSuggestions(true);
      } else {
        console.error("Places API error:", response.status);
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error searching places:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const debouncedSearch = useMemo(() => debounce(searchPlaces, 300), [searchPlaces]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange?.(newValue);
    debouncedSearch(newValue);
  };

  const handlePlaceSelect = (place: GooglePlaceResult) => {
    setInputValue(place.name);
    setShowSuggestions(false);
    setSuggestions([]);
    onPlaceSelected(place);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative">
      <Input
        placeholder={placeholder}
        className={className}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        autoComplete="off"
        autoFocus={autoFocus}
        aria-invalid={ariaInvalid}
      />

      {isLoading && (
        <div className="absolute top-full right-0 left-0 z-50 mt-1 rounded-md border bg-white p-2 shadow-lg dark:bg-gray-800">
          <p className="text-muted-foreground text-sm">Searching...</p>
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && !isLoading && (
        <div className="absolute top-full right-0 left-0 z-50 mt-1 max-h-64 overflow-y-auto rounded-md border bg-white shadow-lg dark:bg-gray-800">
          {suggestions.map((place) => (
            <Card
              key={place.place_id}
              className="hover:bg-muted m-1 cursor-pointer border-0"
              onClick={() => handlePlaceSelect(place)}
            >
              <CardContent className="p-3">
                <div>
                  <h4 className="text-sm font-medium">{place.name}</h4>
                  <p className="text-muted-foreground text-xs">{place.formatted_address}</p>
                  {place.rating && <p className="mt-1 text-xs">⭐ {place.rating}</p>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showSuggestions && (
        <div className="fixed inset-0 z-40" onClick={() => setShowSuggestions(false)} />
      )}
    </div>
  );
}
