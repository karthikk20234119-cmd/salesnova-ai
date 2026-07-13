"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Settings, User, Bell, Palette, Link2, Save, Moon, Sun, Monitor,
  Mail, Phone, Shield, MessageSquare, MapPin, Instagram, Facebook,
  Check, ExternalLink,
} from "lucide-react";
import { useTheme } from "next-themes";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "integrations", label: "Integrations", icon: Link2 },
  { id: "appearance", label: "Appearance", icon: Palette },
];

const integrations = [
  { id: "whatsapp", name: "WhatsApp Business", desc: "Send outreach messages via WhatsApp", icon: MessageSquare, color: "text-emerald-500", connected: true },
  { id: "google_maps", name: "Google Maps API", desc: "Discover business leads from Maps", icon: MapPin, color: "text-red-500", connected: true },
  { id: "instagram", name: "Instagram Graph API", desc: "Analyze business Instagram profiles", icon: Instagram, color: "text-pink-500", connected: false },
  { id: "facebook", name: "Facebook Business", desc: "Sync Facebook page leads", icon: Facebook, color: "text-blue-500", connected: false },
  { id: "email", name: "Email (SMTP)", desc: "Send outreach emails", icon: Mail, color: "text-cyan-500", connected: true },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? "bg-primary" : "bg-secondary"}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const { theme, setTheme } = useTheme();
  const [saved, setSaved] = useState(false);

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    pushNotifications: true,
    outreachAlerts: true,
    dailyDigest: false,
    teamUpdates: true,
    aiInsights: true,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Settings className="w-6 h-6 text-muted-foreground" /> Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account, notifications, and integrations</p>
        </div>
        <Button variant="gradient" size="sm" className="gap-2 self-start" onClick={handleSave}>
          {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Tab Navigation */}
        <motion.div variants={item}>
          <Card className="glass">
            <CardContent className="p-2">
              <div className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Content */}
        <motion.div variants={item} className="lg:col-span-3">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <Card className="glass">
              <CardHeader><CardTitle className="text-base font-semibold">Profile Settings</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-2 border-primary/20">
                    <AvatarFallback className="gradient-primary text-white text-xl font-bold">AM</AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm">Change Avatar</Button>
                    <p className="text-xs text-muted-foreground mt-1">JPG, PNG or SVG. Max 2MB.</p>
                  </div>
                </div>
                <Separator />
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input defaultValue="Arjun Mehta" className="bg-secondary/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input defaultValue="arjun@salesnova.ai" className="bg-secondary/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <Input defaultValue="+91 98765 43210" className="bg-secondary/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Role</label>
                    <Input defaultValue="Admin" disabled className="bg-secondary/50 opacity-60" />
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <label className="text-sm font-medium">Organization</label>
                  <Input defaultValue="SalesNova AI" className="bg-secondary/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bio</label>
                  <Input defaultValue="Founder & CEO at SalesNova AI. Building the future of AI-powered sales." className="bg-secondary/50" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <Card className="glass">
              <CardHeader><CardTitle className="text-base font-semibold">Notification Preferences</CardTitle></CardHeader>
              <CardContent className="space-y-1">
                {[
                  { key: "emailAlerts", title: "Email Alerts", desc: "Receive important updates via email", icon: Mail },
                  { key: "pushNotifications", title: "Push Notifications", desc: "Browser push notifications for real-time updates", icon: Bell },
                  { key: "outreachAlerts", title: "Outreach Alerts", desc: "Get notified when leads reply to messages", icon: MessageSquare },
                  { key: "dailyDigest", title: "Daily Digest", desc: "Receive a daily summary of activity", icon: Mail },
                  { key: "teamUpdates", title: "Team Updates", desc: "Notifications about team member activity", icon: User },
                  { key: "aiInsights", title: "AI Insights", desc: "Get notified when AI generates new insights", icon: Shield },
                ].map((pref, i) => (
                  <React.Fragment key={pref.key}>
                    <div className="flex items-center justify-between py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-secondary">
                          <pref.icon className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{pref.title}</p>
                          <p className="text-xs text-muted-foreground">{pref.desc}</p>
                        </div>
                      </div>
                      <Toggle
                        checked={notifications[pref.key as keyof typeof notifications]}
                        onChange={(v) => setNotifications((prev) => ({ ...prev, [pref.key]: v }))}
                      />
                    </div>
                    {i < 5 && <Separator />}
                  </React.Fragment>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Integrations Tab */}
          {activeTab === "integrations" && (
            <Card className="glass">
              <CardHeader><CardTitle className="text-base font-semibold">Connected Services</CardTitle></CardHeader>
              <CardContent className="space-y-1">
                {integrations.map((int, i) => (
                  <React.Fragment key={int.id}>
                    <div className="flex items-center justify-between py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-secondary">
                          <int.icon className={`w-5 h-5 ${int.color}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">{int.name}</p>
                            {int.connected && <Badge variant="success" className="text-[10px]">Connected</Badge>}
                          </div>
                          <p className="text-xs text-muted-foreground">{int.desc}</p>
                        </div>
                      </div>
                      <Button variant={int.connected ? "outline" : "default"} size="sm" className="gap-1.5">
                        {int.connected ? (
                          <>Settings <ExternalLink className="w-3 h-3" /></>
                        ) : (
                          <>Connect <Link2 className="w-3 h-3" /></>
                        )}
                      </Button>
                    </div>
                    {i < integrations.length - 1 && <Separator />}
                  </React.Fragment>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Appearance Tab */}
          {activeTab === "appearance" && (
            <Card className="glass">
              <CardHeader><CardTitle className="text-base font-semibold">Appearance</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-sm font-medium mb-3">Theme</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "light", label: "Light", icon: Sun },
                      { id: "dark", label: "Dark", icon: Moon },
                      { id: "system", label: "System", icon: Monitor },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                          theme === t.id
                            ? "border-primary bg-primary/5 glow-purple"
                            : "border-border bg-secondary/30 hover:bg-secondary/50"
                        }`}
                      >
                        <t.icon className={`w-6 h-6 ${theme === t.id ? "text-primary" : "text-muted-foreground"}`} />
                        <span className={`text-sm font-medium ${theme === t.id ? "text-primary" : ""}`}>{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium mb-1">Accent Color</p>
                  <p className="text-xs text-muted-foreground mb-3">Choose the primary color for the UI</p>
                  <div className="flex gap-3">
                    {[
                      { name: "Purple", color: "bg-purple-500" },
                      { name: "Blue", color: "bg-blue-500" },
                      { name: "Teal", color: "bg-teal-500" },
                      { name: "Pink", color: "bg-pink-500" },
                      { name: "Orange", color: "bg-orange-500" },
                    ].map((c) => (
                      <button
                        key={c.name}
                        className={`w-8 h-8 rounded-full ${c.color} ring-2 ring-offset-2 ring-offset-background ${c.name === "Purple" ? "ring-primary" : "ring-transparent"} hover:ring-primary/50 transition-all`}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
