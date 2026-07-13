"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import {
  LayoutDashboard, Users, Kanban, Sparkles, Send, CheckSquare,
  BarChart3, UserCog, Settings, ChevronLeft, ChevronRight,
  Zap, Search, Command, X,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Leads", href: "/dashboard/leads", icon: Users },
  { label: "Pipeline", href: "/dashboard/pipeline", icon: Kanban },
  { label: "AI Workspace", href: "/dashboard/workspace", icon: Sparkles },
  { label: "Outreach", href: "/dashboard/outreach", icon: Send },
  { label: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Team", href: "/dashboard/team", icon: UserCog },
];

const bottomItems = [
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const { sidebarCollapsed: collapsed, toggleSidebar, mobileSidebarOpen, setMobileSidebarOpen } = useUIStore();
  const pathname = usePathname();

  // Auto-close mobile sidebar on route change
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname, setMobileSidebarOpen]);

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className={cn("flex items-center h-16 px-4 gap-3 shrink-0", collapsed && !mobileSidebarOpen && "justify-center")}>
        <div className="flex items-center justify-center w-9 h-9 rounded-lg gradient-primary shrink-0">
          <Zap className="w-5 h-5 text-white" />
        </div>
        {(!collapsed || mobileSidebarOpen) && (
          <div className="flex flex-col flex-1">
            <span className="text-sm font-bold gradient-text">SalesNova</span>
            <span className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase">AI Platform</span>
          </div>
        )}
        {/* Mobile close button */}
        {mobileSidebarOpen && (
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-8 w-8"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      <Separator />

      {/* Search */}
      {(!collapsed || mobileSidebarOpen) && (
        <div className="px-3 py-3 shrink-0">
          <button className="flex items-center w-full gap-2 px-3 py-2 text-sm text-muted-foreground rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
            <Search className="w-4 h-4" />
            <span>Search...</span>
            <kbd className="ml-auto text-[10px] bg-background px-1.5 py-0.5 rounded border border-border font-mono hidden sm:inline-flex items-center gap-0.5">
              <Command className="w-3 h-3 inline" />K
            </kbd>
          </button>
        </div>
      )}

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 py-2">
          {(!collapsed || mobileSidebarOpen) && (
            <p className="px-3 mb-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Main Menu
            </p>
          )}
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;
            const isCompact = collapsed && !mobileSidebarOpen;

            const link = (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                  isCompact && "justify-center px-2",
                  isActive
                    ? "bg-primary/10 text-primary glow-purple"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <Icon className={cn("w-5 h-5 shrink-0", isActive && "text-primary")} />
                {!isCompact && <span>{item.label}</span>}
                {!isCompact && item.label === "AI Workspace" && (
                  <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full gradient-primary text-white font-bold">
                    AI
                  </span>
                )}
              </Link>
            );

            if (isCompact) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{link}</TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              );
            }
            return link;
          })}
        </div>
      </ScrollArea>

      {/* Bottom */}
      <div className="px-3 pb-3 space-y-1 shrink-0">
        <Separator className="mb-2" />
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const isCompact = collapsed && !mobileSidebarOpen;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                isCompact && "justify-center px-2",
                isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <Icon className="w-5 h-5" />
              {!isCompact && <span>{item.label}</span>}
            </Link>
          );
        })}
      </div>

      {/* Collapse Toggle (desktop only) */}
      <Button
        variant="outline"
        size="icon"
        className="absolute -right-3 top-20 h-6 w-6 rounded-full border bg-card shadow-md z-50 hidden md:flex"
        onClick={toggleSidebar}
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </Button>
    </>
  );

  return (
    <TooltipProvider delayDuration={0}>
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar — desktop */}
      <aside
        className={cn(
          "relative flex-col h-screen border-r border-border bg-card/50 backdrop-blur-xl transition-all duration-300 z-40 hidden md:flex",
          collapsed ? "w-[68px]" : "w-[260px]"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Sidebar — mobile drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col w-[280px] border-r border-border bg-card backdrop-blur-xl transition-transform duration-300 md:hidden",
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>
    </TooltipProvider>
  );
}
