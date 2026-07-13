"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Bell, Moon, Sun, Plus, Sparkles, Menu, LogOut, User, Settings as SettingsIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useUIStore } from "@/lib/store";
import { getCurrentUser, signOut } from "@/lib/auth";
import { getInitials } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: string;
  avatarUrl: string | null;
  status: string;
}

export function Topbar() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { setMobileSidebarOpen } = useUIStore();
  
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch logged in user profile
  useEffect(() => {
    async function loadUser() {
      const u = await getCurrentUser();
      if (u) {
        setUser(u);
      }
    }
    loadUser();
  }, []);

  // Handle click outside to close profile dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    const res = await signOut();
    if (res.success) {
      router.push("/login");
      router.refresh();
    }
  };

  const displayName = user?.fullName || "User";
  const displayRole = user?.role ? user.role.replace("_", " ") : "Outreach Agent";
  const initials = getInitials(displayName);

  return (
    <header className="sticky top-0 z-30 flex items-center h-16 px-4 sm:px-6 border-b border-border bg-card/50 backdrop-blur-xl">
      {/* Mobile hamburger */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden mr-2 shrink-0"
        onClick={() => setMobileSidebarOpen(true)}
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Left - AI status */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/10">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-primary">AI Agents Active</span>
          <Badge variant="purple" className="text-[10px] px-1.5">3</Badge>
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">
        <Link href="/dashboard/leads">
          <Button variant="gradient" size="sm" className="gap-2 hidden sm:flex">
            <Plus className="w-4 h-4" />
            New Lead
          </Button>
        </Link>

        <Separator orientation="vertical" className="h-6 mx-1 hidden sm:block" />

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="text-muted-foreground"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative text-muted-foreground">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive animate-pulse" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* User Dropdown Shell */}
        <div className="relative" ref={dropdownRef}>
          <div 
            className="flex items-center gap-3 cursor-pointer select-none group"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <Avatar className="h-8 w-8 border-2 border-primary/20 group-hover:border-primary/50 transition-colors">
              <AvatarFallback className="text-xs gradient-primary text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:flex flex-col">
              <span className="text-sm font-medium group-hover:text-primary transition-colors">{displayName}</span>
              <span className="text-[11px] text-muted-foreground capitalize">{displayRole}</span>
            </div>
          </div>

          {/* Animated Dropdown Menu */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-popover text-popover-foreground shadow-lg glow-purple p-1.5 z-50 focus:outline-none"
              >
                {/* Header */}
                <div className="px-3 py-2 text-xs">
                  <p className="font-semibold truncate">{displayName}</p>
                  <p className="text-muted-foreground truncate text-[11px] mt-0.5">{user?.email}</p>
                </div>
                
                <Separator className="my-1.5" />

                {/* Items */}
                <div className="space-y-0.5">
                  <Link href="/dashboard/settings" onClick={() => setIsDropdownOpen(false)}>
                    <button className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-left hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                      <User className="w-4 h-4" />
                      <span>My Profile</span>
                    </button>
                  </Link>
                  <Link href="/dashboard/settings" onClick={() => setIsDropdownOpen(false)}>
                    <button className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-left hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                      <SettingsIcon className="w-4 h-4" />
                      <span>Account Settings</span>
                    </button>
                  </Link>
                </div>

                <Separator className="my-1.5" />

                {/* Log Out */}
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-left text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
