import {
  activityTypes,
  activityTypeLabels,
  activityTypeIcons,
  activityTypeLucideIcons,
  activityTypeColors,
  customSvgActivityTypes,
  getActivityTypeLabel,
  getActivityTypeIcon,
  getActivityTypeLucideIcon,
  getActivityTypeColor,
  isCustomSvgActivityType,
  ActivityType,
} from "../activityTypes";

describe("activityTypes constants and functions", () => {
  describe("activityTypes array", () => {
    it("should contain all expected activity types", () => {
      const expectedTypes = [
        "sightseeing",
        "food",
        "museum",
        "hike",
        "beach",
        "water_activities",
        "adventure_sports",
        "shopping",
        "nature_gardens",
        "travel",
        "relax",
        "event",
        "nightlife",
        "family_kids",
        "other",
      ];

      expect(activityTypes).toEqual(expectedTypes);
      expect(activityTypes).toHaveLength(15);
    });

    it("should be a readonly tuple", () => {
      // Type check - this ensures the as const assertion is working
      const firstType: ActivityType = activityTypes[0];
      expect(firstType).toBe("sightseeing");
    });
  });

  describe("activityTypeLabels", () => {
    it("should have labels for all activity types", () => {
      activityTypes.forEach((type) => {
        expect(activityTypeLabels[type]).toBeDefined();
        expect(typeof activityTypeLabels[type]).toBe("string");
        expect(activityTypeLabels[type]).not.toBe("");
      });
    });

    it("should have specific expected labels", () => {
      expect(activityTypeLabels.sightseeing).toBe("Sightseeing");
      expect(activityTypeLabels.food).toBe("Food & Drink");
      expect(activityTypeLabels.museum).toBe("Museum");
      expect(activityTypeLabels.hike).toBe("Hiking");
      expect(activityTypeLabels.beach).toBe("Beach");
      expect(activityTypeLabels.water_activities).toBe("Water Activities");
      expect(activityTypeLabels.adventure_sports).toBe("Adventure Sports");
      expect(activityTypeLabels.shopping).toBe("Shopping");
      expect(activityTypeLabels.nature_gardens).toBe("Nature & Gardens");
      expect(activityTypeLabels.travel).toBe("Travel Day");
      expect(activityTypeLabels.relax).toBe("Relax");
      expect(activityTypeLabels.event).toBe("Event");
      expect(activityTypeLabels.nightlife).toBe("Nightlife");
      expect(activityTypeLabels.family_kids).toBe("Family & Kids");
      expect(activityTypeLabels.other).toBe("Other");
    });

    it("should have exactly the same number of labels as activity types", () => {
      expect(Object.keys(activityTypeLabels)).toHaveLength(activityTypes.length);
    });
  });

  describe("activityTypeIcons", () => {
    it("should have icons for all activity types", () => {
      activityTypes.forEach((type) => {
        expect(activityTypeIcons[type]).toBeDefined();
        expect(typeof activityTypeIcons[type]).toBe("string");
        expect(activityTypeIcons[type]).not.toBe("");
      });
    });

    it("should have emoji icons for all types", () => {
      const expectedIcons = {
        sightseeing: "🗺️",
        food: "🍽️",
        museum: "🏛️",
        hike: "🥾",
        beach: "🏖️",
        water_activities: "🚤",
        adventure_sports: "🪂",
        shopping: "🛍️",
        nature_gardens: "🌿",
        travel: "✈️",
        relax: "🧘",
        event: "🎉",
        nightlife: "🌃",
        family_kids: "👨‍👩‍👧‍👦",
        other: "❓",
      };

      activityTypes.forEach((type) => {
        expect(activityTypeIcons[type]).toBe(expectedIcons[type]);
      });
    });
  });

  describe("activityTypeLucideIcons", () => {
    it("should have Lucide icons for all activity types", () => {
      activityTypes.forEach((type) => {
        expect(activityTypeLucideIcons[type]).toBeDefined();
        expect(typeof activityTypeLucideIcons[type]).toBe("string");
        expect(activityTypeLucideIcons[type]).not.toBe("");
      });
    });

    it("should have expected Lucide icon names", () => {
      const expectedLucideIcons = {
        sightseeing: "Map",
        food: "Utensils",
        museum: "Landmark",
        hike: "Mountain",
        beach: "Waves",
        water_activities: "Kayak",
        adventure_sports: "Bike",
        shopping: "ShoppingBag",
        nature_gardens: "Trees",
        travel: "Plane",
        relax: "custom",
        event: "PartyPopper",
        nightlife: "BottleWine",
        family_kids: "FerrisWheel",
        other: "HelpCircle",
      };

      activityTypes.forEach((type) => {
        expect(activityTypeLucideIcons[type]).toBe(expectedLucideIcons[type]);
      });
    });
  });

  describe("activityTypeColors", () => {
    it("should have colors for all activity types", () => {
      activityTypes.forEach((type) => {
        expect(activityTypeColors[type]).toBeDefined();
        expect(typeof activityTypeColors[type]).toBe("string");
        expect(activityTypeColors[type]).toMatch(/^var\(--color-icon-\w+\)$/);
      });
    });

    it("should use CSS custom properties format", () => {
      activityTypes.forEach((type) => {
        const color = activityTypeColors[type];
        expect(color).toMatch(/^var\(--color-icon-\w+\)$/);
      });
    });

    it("should have unique colors for most types", () => {
      const colors = Object.values(activityTypeColors);
      const uniqueColors = new Set(colors);

      // Allow some duplicate colors but most should be unique
      expect(uniqueColors.size).toBeGreaterThan(10);
    });
  });

  describe("customSvgActivityTypes", () => {
    it("should be an array", () => {
      expect(Array.isArray(customSvgActivityTypes)).toBe(true);
    });

    it("should contain only valid activity types", () => {
      customSvgActivityTypes.forEach((type) => {
        expect(activityTypes).toContain(type);
      });
    });

    it("should currently contain only 'relax'", () => {
      expect(customSvgActivityTypes).toEqual(["relax"]);
    });
  });

  describe("getActivityTypeLabel", () => {
    it("should return correct labels for all activity types", () => {
      activityTypes.forEach((type) => {
        const label = getActivityTypeLabel(type);
        expect(label).toBe(activityTypeLabels[type]);
      });
    });

    it("should return 'Other' for invalid activity type", () => {
      // This test ensures fallback behavior
      const invalidType = "invalid_type" as ActivityType;
      const label = getActivityTypeLabel(invalidType);
      expect(label).toBe("Other");
    });

    it("should handle edge cases", () => {
      expect(getActivityTypeLabel("sightseeing")).toBe("Sightseeing");
      expect(getActivityTypeLabel("other")).toBe("Other");
    });
  });

  describe("getActivityTypeIcon", () => {
    it("should return correct icons for all activity types", () => {
      activityTypes.forEach((type) => {
        const icon = getActivityTypeIcon(type);
        expect(icon).toBe(activityTypeIcons[type]);
      });
    });

    it("should return fallback icon for invalid activity type", () => {
      const invalidType = "invalid_type" as ActivityType;
      const icon = getActivityTypeIcon(invalidType);
      expect(icon).toBe("❓");
    });

    it("should return valid emojis", () => {
      activityTypes.forEach((type) => {
        const icon = getActivityTypeIcon(type);
        expect(icon).toBeDefined();
        expect(icon.length).toBeGreaterThan(0);
      });
    });
  });

  describe("getActivityTypeLucideIcon", () => {
    it("should return correct Lucide icons for all activity types", () => {
      activityTypes.forEach((type) => {
        const icon = getActivityTypeLucideIcon(type);
        expect(icon).toBe(activityTypeLucideIcons[type]);
      });
    });

    it("should return fallback icon for invalid activity type", () => {
      const invalidType = "invalid_type" as ActivityType;
      const icon = getActivityTypeLucideIcon(invalidType);
      expect(icon).toBe("HelpCircle");
    });

    it("should return valid Lucide icon names", () => {
      activityTypes.forEach((type) => {
        const icon = getActivityTypeLucideIcon(type);
        expect(icon).toBeDefined();
        expect(typeof icon).toBe("string");
        expect(icon).not.toBe("");
      });
    });
  });

  describe("getActivityTypeColor", () => {
    it("should return correct colors for all activity types", () => {
      activityTypes.forEach((type) => {
        const color = getActivityTypeColor(type);
        expect(color).toBe(activityTypeColors[type]);
      });
    });

    it("should return fallback color for invalid activity type", () => {
      const invalidType = "invalid_type" as ActivityType;
      const color = getActivityTypeColor(invalidType);
      expect(color).toBe("var(--color-icon-slate)");
    });

    it("should return valid CSS custom property format", () => {
      activityTypes.forEach((type) => {
        const color = getActivityTypeColor(type);
        expect(color).toMatch(/^var\(--color-icon-\w+\)$/);
      });
    });
  });

  describe("isCustomSvgActivityType", () => {
    it("should return true for custom SVG activity types", () => {
      customSvgActivityTypes.forEach((type) => {
        expect(isCustomSvgActivityType(type)).toBe(true);
      });
    });

    it("should return false for non-custom SVG activity types", () => {
      const nonCustomTypes = activityTypes.filter((type) => !customSvgActivityTypes.includes(type));

      nonCustomTypes.forEach((type) => {
        expect(isCustomSvgActivityType(type)).toBe(false);
      });
    });

    it("should currently return true only for 'relax'", () => {
      expect(isCustomSvgActivityType("relax")).toBe(true);
      expect(isCustomSvgActivityType("sightseeing")).toBe(false);
      expect(isCustomSvgActivityType("food")).toBe(false);
      expect(isCustomSvgActivityType("other")).toBe(false);
    });
  });

  describe("data consistency", () => {
    it("should have consistent keys across all mapping objects", () => {
      const labelKeys = Object.keys(activityTypeLabels) as ActivityType[];
      const iconKeys = Object.keys(activityTypeIcons) as ActivityType[];
      const lucideIconKeys = Object.keys(activityTypeLucideIcons) as ActivityType[];
      const colorKeys = Object.keys(activityTypeColors) as ActivityType[];

      // All mapping objects should have the same keys
      expect(labelKeys.sort()).toEqual(activityTypes.slice().sort());
      expect(iconKeys.sort()).toEqual(activityTypes.slice().sort());
      expect(lucideIconKeys.sort()).toEqual(activityTypes.slice().sort());
      expect(colorKeys.sort()).toEqual(activityTypes.slice().sort());
    });

    it("should not have missing or extra keys in any mapping", () => {
      const mappings = [
        activityTypeLabels,
        activityTypeIcons,
        activityTypeLucideIcons,
        activityTypeColors,
      ];

      mappings.forEach((mapping) => {
        const keys = Object.keys(mapping);
        expect(keys).toHaveLength(activityTypes.length);

        keys.forEach((key) => {
          expect(activityTypes).toContain(key as ActivityType);
        });
      });
    });
  });
});
