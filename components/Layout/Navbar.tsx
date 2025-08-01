"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import ModeToggle from "@/components/ui/ModeToggle";

import { supabase } from "@/lib/supabase";

import { useUser } from "@/hooks/useUser";

import { VenLogo } from "../Icons/VenLogo";

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useUser();

  const isActive = (path: string) => pathname === path;

  // Different nav items based on auth status
  const loggedInNavItems = [
    { name: "Trips", path: "/trips" },
    { name: "Account", path: "/account-settings" },
  ];

  const loggedOutNavItems: { name: string; path: string }[] = [
    // Add any public nav items here if needed
  ];

  const navItems = user ? loggedInNavItems : loggedOutNavItems;

  return (
    <header className="w-full px-6 py-4 shadow-sm border-b bg-background">
      <nav className="max-w-6xl mx-auto flex justify-between items-center font-display">
        <Link href="/" className="flex items-center">
          <VenLogo className="inline-block mr-2" />
          <span className="border-l pl-2 mt-6">Trip Planner</span>
        </Link>

        <div className="flex gap-4 items-center">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={`text-sm font-medium transition-colors ${
                isActive(item.path) ? "underline" : ""
              }`}
            >
              {item.name}
            </Link>
          ))}

          {user ? (
            // Logged in: Show logout button
            <Button variant="outline" size="sm" onClick={async () => await supabase.auth.signOut()}>
              Logout
            </Button>
          ) : (
            // Not logged in: Show login and signup buttons
            <div className="flex gap-2">
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}
          <ModeToggle />
        </div>
      </nav>
    </header>
  );
}
