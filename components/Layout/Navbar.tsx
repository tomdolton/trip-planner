"use client";

import { LogOut, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ModeToggle from "@/components/ui/ModeToggle";

import { supabase } from "@/lib/supabase";

import { useUser } from "@/hooks/useUser";

import { VenLogo } from "../Icons/VenLogo";

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useUser();

  const isActive = (path: string) => pathname === path;

  // Different nav items based on auth status
  const loggedInNavItems = [{ name: "Trips Dashboard", path: "/trips" }];

  const loggedOutNavItems: { name: string; path: string }[] = [
    // Add any public nav items here if needed
  ];

  const navItems = user ? loggedInNavItems : loggedOutNavItems;

  // Get user display name or email
  const getUserDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    return user?.email || "";
  };

  // Get user initials for avatar
  const getUserInitials = () => {
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
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="w-full px-6 py-4 bg-background">
      <nav className="max-w-6xl mx-auto flex justify-between items-center font-display">
        <Link href="/" className="flex items-center">
          <VenLogo className="inline-block mr-2" />
          <span className="border-l pl-2 mt-6">Trip Planner</span>
        </Link>

        <div className="flex gap-4 lg:gap-8 items-center">
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
            // Logged in: Show user dropdown
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="card"
                  className="flex items-center justify-start gap-2 h-auto p-2 min-w-44"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">{getUserInitials()}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{getUserDisplayName()}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-44">
                <DropdownMenuItem asChild>
                  <Link href="/account-settings" className="flex items-center gap-2 cursor-pointer">
                    <SlidersHorizontal className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
