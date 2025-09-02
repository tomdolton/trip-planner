import type { User } from "@supabase/supabase-js";

import { getUserDisplayName, getUserInitials } from "../userUtils";

describe("userUtils", () => {
  describe("getUserDisplayName", () => {
    it("should return full name when available", () => {
      const user = {
        id: "1",
        user_metadata: {
          full_name: "John Doe",
        },
        email: "john@example.com",
      } as unknown as User;

      const result = getUserDisplayName(user);
      expect(result).toBe("John Doe");
    });

    it("should return email when full name is not available", () => {
      const user = {
        id: "1",
        user_metadata: {},
        email: "john@example.com",
      } as unknown as User;

      const result = getUserDisplayName(user);
      expect(result).toBe("john@example.com");
    });

    it("should return empty string when user is null", () => {
      const result = getUserDisplayName(null);
      expect(result).toBe("");
    });

    it("should return empty string when user is undefined", () => {
      const result = getUserDisplayName(undefined);
      expect(result).toBe("");
    });

    it("should return empty string when email is not available", () => {
      const user = {
        id: "1",
        user_metadata: {},
      } as unknown as User;

      const result = getUserDisplayName(user);
      expect(result).toBe("");
    });
  });

  describe("getUserInitials", () => {
    it("should return initials from full name", () => {
      const user = {
        id: "1",
        user_metadata: {
          full_name: "John Doe",
        },
        email: "john@example.com",
      } as unknown as User;

      const result = getUserInitials(user);
      expect(result).toBe("JD");
    });

    it("should return first two letters for single word full name", () => {
      const user = {
        id: "1",
        user_metadata: {
          full_name: "John",
        },
        email: "john@example.com",
      } as unknown as User;

      const result = getUserInitials(user);
      expect(result).toBe("J");
    });

    it("should limit to 2 characters for multiple names", () => {
      const user = {
        id: "1",
        user_metadata: {
          full_name: "John Michael Doe",
        },
        email: "john@example.com",
      } as unknown as User;

      const result = getUserInitials(user);
      expect(result).toBe("JM");
    });

    it("should return first letter of email when full name is not available", () => {
      const user = {
        id: "1",
        user_metadata: {},
        email: "john@example.com",
      } as unknown as User;

      const result = getUserInitials(user);
      expect(result).toBe("J");
    });

    it('should return "U" when user is null', () => {
      const result = getUserInitials(null);
      expect(result).toBe("U");
    });

    it('should return "U" when user is undefined', () => {
      const result = getUserInitials(undefined);
      expect(result).toBe("U");
    });

    it('should return "U" when email is not available', () => {
      const user = {
        id: "1",
        user_metadata: {},
      } as unknown as User;

      const result = getUserInitials(user);
      expect(result).toBe("U");
    });

    it("should return uppercase initials", () => {
      const user = {
        id: "1",
        user_metadata: {
          full_name: "john doe",
        },
        email: "john@example.com",
      } as unknown as User;

      const result = getUserInitials(user);
      expect(result).toBe("JD");
    });

    it("should handle names with extra spaces", () => {
      const user = {
        id: "1",
        user_metadata: {
          full_name: " John   Doe ",
        },
        email: "john@example.com",
      } as unknown as User;

      const result = getUserInitials(user);
      expect(result).toBe("JD");
    });
  });
});
