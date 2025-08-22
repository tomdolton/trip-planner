"use client";

import { LogOut, SlidersHorizontal, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useMemo } from "react";

import { getUserDisplayName, getUserInitials } from "@/util/userUtils";

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

type NavItem = { name: string; path: string };

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useUser();

  // Nav items based on auth status
  const navItems: NavItem[] = useMemo(() => {
    const loggedInNavItems: NavItem[] = [
      { name: "Trips Dashboard", path: "/trips" },
      { name: "Create New Trip", path: "/trips/create-new-trip" },
    ];
    const loggedOutNavItems: NavItem[] = [
      // Add any public nav items here if needed
    ];
    return user ? loggedInNavItems : loggedOutNavItems;
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const [menuOpen, setMenuOpen] = useState(false);

  // Handlers for menu state
  const handleMenuToggle = () => setMenuOpen((v) => !v);
  const handleMenuClose = () => setMenuOpen(false);

  const isActive = (pathname: string, path: string): boolean => pathname === path;

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="container py-4 bg-background">
      <nav className="flex justify-between items-center font-display relative">
        {/* Logo always left */}
        <Link href="/" className="flex items-center z-30">
          <VenLogo className="inline-block mr-2" />
          <span className="border-l pl-2 mt-6">Trip Planner</span>
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex gap-4 lg:gap-8 items-center">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={`text-sm font-medium transition-colors ${
                isActive(pathname, item.path) ? "underline" : ""
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
                    <AvatarFallback className="text-xs">{getUserInitials(user)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{getUserDisplayName(user)}</span>
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

        {/* Hamburger menu for mobile */}
        <Button
          size="icon"
          variant="ghost"
          className="md:hidden ml-auto z-30 rounded "
          aria-label="Open menu"
          onClick={handleMenuToggle}
        >
          <Menu className="size-10" strokeWidth={1.5} />
        </Button>

        {/* Mobile menu overlay */}
        {menuOpen && (
          <div className="fixed inset-0 bg-background z-20 font-medium flex flex-col items-center justify-start pt-24 px-6 animate-in fade-in duration-200 md:hidden">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={`w-full  py-4 text-center border-b border-border ${
                  isActive(pathname, item.path) ? "underline" : ""
                }`}
                onClick={handleMenuClose}
              >
                {item.name}
              </Link>
            ))}

            {user ? (
              <div className="w-full flex flex-col items-center">
                <Link
                  href="/account-settings"
                  className="w-full flex items-center justify-center gap-2 py-4 border-b border-border"
                >
                  <SlidersHorizontal className="size-5" />
                  <span>Settings</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-4 border-b border-border cursor-pointer"
                >
                  <LogOut className="size-5" />
                  <span>Log out</span>
                </button>

                <div className="flex items-center gap-2 mt-2">
                  <Avatar className="size-8">
                    <AvatarFallback className="text-xs">{getUserInitials(user)}</AvatarFallback>
                  </Avatar>
                  <span className="text-base font-medium">{getUserDisplayName(user)}</span>
                </div>
              </div>
            ) : (
              <div className="w-full flex flex-col gap-2 mt-6">
                <Link href="/login" className="w-full">
                  <Button variant="ghost" size="lg" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link href="/signup" className="w-full">
                  <Button size="lg" className="w-full">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
            <div className="mt-8">
              <ModeToggle />
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
