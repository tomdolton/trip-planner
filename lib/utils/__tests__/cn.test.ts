import { cn } from "../cn";

describe("cn utility function", () => {
  it("should combine class names using clsx and twMerge", () => {
    const result = cn("text-red-500", "bg-blue-500");
    expect(result).toBe("text-red-500 bg-blue-500");
  });

  it("should handle conditional classes", () => {
    const result = cn("base-class", true && "conditional-class", false && "ignored-class");
    expect(result).toBe("base-class conditional-class");
  });

  it("should merge conflicting Tailwind classes", () => {
    // twMerge should resolve conflicts by keeping the last one
    const result = cn("text-red-500", "text-blue-500");
    expect(result).toBe("text-blue-500");
  });

  it("should handle undefined and null values", () => {
    const result = cn("base-class", undefined, null, "another-class");
    expect(result).toBe("base-class another-class");
  });

  it("should handle arrays and objects", () => {
    const result = cn(["class1", "class2"], { class3: true, class4: false });
    expect(result).toBe("class1 class2 class3");
  });

  it("should handle empty input", () => {
    const result = cn();
    expect(result).toBe("");
  });

  it("should merge complex Tailwind utilities", () => {
    // Test that twMerge properly handles complex Tailwind class conflicts
    const result = cn("px-2 py-1", "px-4");
    expect(result).toBe("py-1 px-4");
  });
});
