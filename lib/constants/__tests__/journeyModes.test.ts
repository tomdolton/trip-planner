import {
  journeyModes,
  journeyModeLabels,
  journeyModeIcons,
  journeyModeLucideIcons,
  getJourneyModeLabel,
  getJourneyModeIcon,
  getJourneyModeLucideIcon,
  type JourneyMode,
} from "../journeyModes";

describe("journeyModes", () => {
  describe("journeyModes array", () => {
    it("should contain all expected journey modes", () => {
      const expectedModes = [
        "flight",
        "train",
        "bus",
        "car",
        "boat",
        "walk",
        "bike",
        "metro",
        "ferry",
        "taxi",
        "other",
      ];

      expect(journeyModes).toEqual(expectedModes);
    });

    it("should have correct length", () => {
      expect(journeyModes).toHaveLength(11);
    });

    it("should be readonly array", () => {
      // TypeScript should enforce readonly, but we can check the values
      expect(Array.isArray(journeyModes)).toBe(true);
      expect(journeyModes[0]).toBe("flight");
      expect(journeyModes[journeyModes.length - 1]).toBe("other");
    });
  });

  describe("journeyModeLabels", () => {
    it("should have labels for all journey modes", () => {
      journeyModes.forEach((mode) => {
        expect(journeyModeLabels[mode]).toBeDefined();
        expect(typeof journeyModeLabels[mode]).toBe("string");
        expect(journeyModeLabels[mode]).not.toBe("");
      });
    });

    it("should have correct specific labels", () => {
      expect(journeyModeLabels.flight).toBe("Flight");
      expect(journeyModeLabels.train).toBe("Train");
      expect(journeyModeLabels.bus).toBe("Bus");
      expect(journeyModeLabels.car).toBe("Car");
      expect(journeyModeLabels.boat).toBe("Boat");
      expect(journeyModeLabels.walk).toBe("Walk");
      expect(journeyModeLabels.bike).toBe("Bike");
      expect(journeyModeLabels.metro).toBe("Metro/Subway");
      expect(journeyModeLabels.ferry).toBe("Ferry");
      expect(journeyModeLabels.taxi).toBe("Taxi/Rideshare");
      expect(journeyModeLabels.other).toBe("Other");
    });

    it("should have no extra properties", () => {
      const labelKeys = Object.keys(journeyModeLabels);
      expect(labelKeys).toHaveLength(journeyModes.length);
      labelKeys.forEach((key) => {
        expect(journeyModes).toContain(key as JourneyMode);
      });
    });
  });

  describe("journeyModeIcons", () => {
    it("should have icons for all journey modes", () => {
      journeyModes.forEach((mode) => {
        expect(journeyModeIcons[mode]).toBeDefined();
        expect(typeof journeyModeIcons[mode]).toBe("string");
        expect(journeyModeIcons[mode]).not.toBe("");
      });
    });

    it("should have correct specific icons", () => {
      expect(journeyModeIcons.flight).toBe("✈️");
      expect(journeyModeIcons.train).toBe("🚆");
      expect(journeyModeIcons.bus).toBe("🚌");
      expect(journeyModeIcons.car).toBe("🚗");
      expect(journeyModeIcons.boat).toBe("🛥️");
      expect(journeyModeIcons.walk).toBe("🚶");
      expect(journeyModeIcons.bike).toBe("🚴");
      expect(journeyModeIcons.metro).toBe("🚇");
      expect(journeyModeIcons.ferry).toBe("⛴️");
      expect(journeyModeIcons.taxi).toBe("🚕");
      expect(journeyModeIcons.other).toBe("❓");
    });

    it("should have no extra properties", () => {
      const iconKeys = Object.keys(journeyModeIcons);
      expect(iconKeys).toHaveLength(journeyModes.length);
      iconKeys.forEach((key) => {
        expect(journeyModes).toContain(key as JourneyMode);
      });
    });
  });

  describe("journeyModeLucideIcons", () => {
    it("should have Lucide icons for all journey modes", () => {
      journeyModes.forEach((mode) => {
        expect(journeyModeLucideIcons[mode]).toBeDefined();
        expect(typeof journeyModeLucideIcons[mode]).toBe("string");
        expect(journeyModeLucideIcons[mode]).not.toBe("");
      });
    });

    it("should have correct specific Lucide icons", () => {
      expect(journeyModeLucideIcons.flight).toBe("Plane");
      expect(journeyModeLucideIcons.train).toBe("TrainFront");
      expect(journeyModeLucideIcons.bus).toBe("Bus");
      expect(journeyModeLucideIcons.car).toBe("Car");
      expect(journeyModeLucideIcons.boat).toBe("Ship");
      expect(journeyModeLucideIcons.walk).toBe("Footprints");
      expect(journeyModeLucideIcons.bike).toBe("Bike");
      expect(journeyModeLucideIcons.metro).toBe("TramFront");
      expect(journeyModeLucideIcons.ferry).toBe("Ship");
      expect(journeyModeLucideIcons.taxi).toBe("CarTaxiFront");
      expect(journeyModeLucideIcons.other).toBe("Luggage");
    });

    it("should have no extra properties", () => {
      const lucideIconKeys = Object.keys(journeyModeLucideIcons);
      expect(lucideIconKeys).toHaveLength(journeyModes.length);
      lucideIconKeys.forEach((key) => {
        expect(journeyModes).toContain(key as JourneyMode);
      });
    });
  });

  describe("getJourneyModeLabel", () => {
    it("should return correct labels for all journey modes", () => {
      journeyModes.forEach((mode) => {
        const result = getJourneyModeLabel(mode);
        expect(result).toBe(journeyModeLabels[mode]);
      });
    });

    it("should return 'Other' for unknown mode", () => {
      const result = getJourneyModeLabel("unknown" as JourneyMode);
      expect(result).toBe("Other");
    });

    it("should return specific expected labels", () => {
      expect(getJourneyModeLabel("flight")).toBe("Flight");
      expect(getJourneyModeLabel("metro")).toBe("Metro/Subway");
      expect(getJourneyModeLabel("taxi")).toBe("Taxi/Rideshare");
    });
  });

  describe("getJourneyModeIcon", () => {
    it("should return correct icons for all journey modes", () => {
      journeyModes.forEach((mode) => {
        const result = getJourneyModeIcon(mode);
        expect(result).toBe(journeyModeIcons[mode]);
      });
    });

    it("should return '❓' for unknown mode", () => {
      const result = getJourneyModeIcon("unknown" as JourneyMode);
      expect(result).toBe("❓");
    });

    it("should return specific expected icons", () => {
      expect(getJourneyModeIcon("flight")).toBe("✈️");
      expect(getJourneyModeIcon("train")).toBe("🚆");
      expect(getJourneyModeIcon("other")).toBe("❓");
    });
  });

  describe("getJourneyModeLucideIcon", () => {
    it("should return correct Lucide icons for all journey modes", () => {
      journeyModes.forEach((mode) => {
        const result = getJourneyModeLucideIcon(mode);
        expect(result).toBe(journeyModeLucideIcons[mode]);
      });
    });

    it("should return 'HelpCircle' for unknown mode", () => {
      const result = getJourneyModeLucideIcon("unknown" as JourneyMode);
      expect(result).toBe("HelpCircle");
    });

    it("should return specific expected Lucide icons", () => {
      expect(getJourneyModeLucideIcon("flight")).toBe("Plane");
      expect(getJourneyModeLucideIcon("train")).toBe("TrainFront");
      expect(getJourneyModeLucideIcon("other")).toBe("Luggage");
    });
  });

  describe("type safety", () => {
    it("should ensure JourneyMode type includes all expected modes", () => {
      // This test ensures the type definition is consistent with the array
      const testMode: JourneyMode = "flight";
      expect(journeyModes).toContain(testMode);
    });

    it("should ensure all mode records have proper typing", () => {
      // Test that we can access all modes through the type
      const testModes: JourneyMode[] = ["flight", "train", "bus"];
      testModes.forEach((mode) => {
        expect(journeyModeLabels[mode]).toBeDefined();
        expect(journeyModeIcons[mode]).toBeDefined();
        expect(journeyModeLucideIcons[mode]).toBeDefined();
      });
    });
  });
});
