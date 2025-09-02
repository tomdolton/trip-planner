// Utility functions for user display and nav logic
import type { User } from "@supabase/supabase-js";

/**
 * Returns the user's display name, preferring full name if available, otherwise email.
 * @param {User | null | undefined} user - The user object from Supabase auth.
 * @returns {string} The display name or empty string if not available.
 */
export function getUserDisplayName(user: User | null | undefined): string {
  if (user?.user_metadata?.full_name) {
    return user.user_metadata.full_name;
  }
  return user?.email || "";
}

/**
 * Returns the user's initials, using the first two letters of the full name if available, otherwise the first letter of the email.
 * @param {User | null | undefined} user - The user object from Supabase auth.
 * @returns {string} The user's initials (max 2 chars), or 'U' if not available.
 */
export function getUserInitials(user: User | null | undefined): string {
  const name = user?.user_metadata?.full_name;
  if (name) {
    return name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  return user?.email?.[0]?.toUpperCase() || "U";
}
