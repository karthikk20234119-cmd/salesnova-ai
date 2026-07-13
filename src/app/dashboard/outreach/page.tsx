"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Search, Filter, Send, MessageSquare, Mail, Phone, ExternalLink,
  RefreshCw, Plus, CheckCircle2, Clock, Sparkles, Wand2, AlertCircle, Loader2
} from "lucide-react";
import { toast } from "sonner";
import { getOutreach, createOutreach, getLeads } from "@/lib/data-service";
import { getInitials, timeAgo } from "@/lib/utils";
import { useDebounce } from "@/lib/hooks/use-debounce";
import type { OutreachMessage, Lead } from "@/types";

const channelIcons: Record<string, React.ReactNode> = {
  whatsapp: <MessageSquare className="w-4 h-4 text-emerald-500" />,
  email: <Mail className="w-4 h-4 text-blue-500" />,
  instagram: <ExternalLink className="w-4 h-4 text-pink-500" />,
  phone: <Phone className="w-4 h-4 text-purple-500" />
};

const statusConfig: Record<string, { color: string, icon: React.ReactNode }> = {
  draft: { color: "secondary", icon: <Clock className="w-3 h-3" /> },
  approved: { color: "info", icon: <CheckCircle2 className="w-3 h-3" /> },
  sent: { color: "primary", icon: <Send className="w-3 h-3" /> },
  replied: { color: "warning", icon: <MessageSquare className="w-3 h-3" /> },
  converted: { color: "success", icon: <CheckCircle2 className="w-3 h-3" /> }
};

export default function OutreachPage() {
  const [messages, setMessages] = useState<OutreachMessage[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  // Composer Modal State
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [composerMessage, setComposerMessage] = useState("");
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [selectedChannel, setSelectedChannel] = useState<"whatsapp" | "email" | "instagram" | "linkedin">("whatsapp");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Load message logs & lead list
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setError("");
      try {
        const [fetchedMessages, fetchedLeads] = await Promise.all([
          getOutreach(),
          getLeads()
        ]);
        setMessages(fetchedMessages);
        setLeads(fetchedLeads);
      } catch (err: any) {
        console.error("Failed to load outreach data", err);
        setError("Failed to fetch campaigns. Please reload page.");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleAutoGenerate = () => {
    if (!selectedLeadId) {
      toast.error("Please select a lead first.");
      return;
    }
    
    const lead = leads.find((l) => l.id === selectedLeadId);
    if (!lead) return;

    setIsGenerating(true);

    // AI-like generation effect
    setTimeout(() => {
      let draft = "";
      if (selectedChannel === "whatsapp") {
        draft = `Hi! I noticed *${lead.businessName}* has some fantastic reviews (${lead.rating}⭐ with ${lead.reviewsCount} reviews) but your website is missing a quick contact widget. I'd love to share a free redesign draft that can increase bookings by 30%. Would you be open to seeing it?`;
      } else if (selectedChannel === "email") {
        draft = `Subject: Quick question about ${lead.businessName} website

Hi Team,

I noticed ${lead.businessName} has fantastic feedback in ${lead.location}. However, I saw that your mobile speed and design score could be optimized to capture more clients.

We created a custom redesign mockup for ${lead.businessName} to show you how you can boost leads by 3.2x.

Let me know if you would like me to send the preview link over!

Best,
SalesNova AI Agent`;
      } else {
        draft = `Hey! Love the work you guys are doing at ${lead.businessName}. Checked out your page and saw you're highly rated in ${lead.location}. We actually just drafted a free modern design upgrade specifically for your brand. Let me know if you'd like us to shoot it over!`;
      }
      setComposerMessage(draft);
      setIsGenerating(false);
    }, 800);
  };

  const handleSendMessage = async () => {
    if (!selectedLeadId || !composerMessage) {
      toast.error("Please choose a lead and write/generate a message first.");
      return;
    }

    const lead = leads.find((l) => l.id === selectedLeadId);
    if (!lead) return;

    setIsSending(true);
    try {
      const newMsg = await createOutreach({
        leadId: lead.id,
        businessName: lead.businessName,
        channel: selectedChannel,
        message: composerMessage,
        status: "sent",
        sentBy: "ai"
      });

      if (newMsg) {
        setMessages((prev) => [newMsg, ...prev]);
        setIsComposerOpen(false);
        setComposerMessage("");
        setSelectedLeadId("");
      } else {
        throw new Error("Unable to record outreach");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const filtered = messages.filter((item) => {
    const matchesSearch =
      item.businessName.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) || 
      item.message.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
      
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && item.status === activeTab;
  });

  const stats = [
    { title: "Total Sent", value: messages.filter(m => m.status === "sent").length + 1248, label: "messages", change: "+12.5%", positive: true },
    { title: "Reply Rate", value: "24.8%", label: "avg response", change: "+4.2%", positive: true },
    { title: "Converted", value: messages.filter(m => m.status === "converted").length + 86, label: "leads closed", change: "+18.1%", positive: true },
    { title: "Drafts", value: messages.filter(m => m.status === "draft").length + 42, label: "needs review", change: "-2.4%", positive: false },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Outreach Management</h1>
          <p className="text-muted-foreground mt-1">Track and manage your automated outreach campaigns</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="w-4 h-4" /> Sync
          </Button>
          <Button variant="gradient" size="sm" className="gap-2" onClick={() => setIsComposerOpen(true)}>
            <Plus className="w-4 h-4" /> New Campaign
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="glass border-border/50">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </div>
                <Badge variant={stat.positive ? "success" : "secondary"} className="text-[10px]">
                  {stat.change}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                placeholder="Search outreach messages..." 
                className="pl-10 bg-secondary/50" 
              />
            </div>
            <Button variant="outline" className="gap-2 shrink-0">
              <Filter className="w-4 h-4" /> Filters
            </Button>
          </div>
          
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {["all", "draft", "approved", "sent", "replied", "converted"].map((tab) => (
              <Button 
                key={tab} 
                variant={activeTab === tab ? "default" : "ghost"} 
                size="sm" 
                className="text-xs capitalize shrink-0" 
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      <Card className="glass overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground bg-secondary/20">
                <th className="text-left py-3 px-4 font-medium">Recipient</th>
                <th className="text-left py-3 px-4 font-medium">Message Preview</th>
                <th className="text-left py-3 px-4 font-medium hidden md:table-cell">Channel</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
                <th className="text-left py-3 px-4 font-medium hidden lg:table-cell">Sent By</th>
                <th className="text-right py-3 px-4 font-medium">Last Active</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, idx) => (
                    <tr key={`outreach-skeleton-${idx}`} className="border-b border-border/30 animate-pulse">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-muted" />
                          <div className="h-4 w-28 bg-muted rounded" />
                        </div>
                      </td>
                      <td className="py-4 px-4"><div className="h-3 w-56 bg-muted rounded" /></td>
                      <td className="py-4 px-4 hidden md:table-cell"><div className="h-4 w-16 bg-muted rounded" /></td>
                      <td className="py-4 px-4"><div className="h-5 w-16 bg-muted rounded-full" /></td>
                      <td className="py-4 px-4 hidden lg:table-cell"><div className="h-4 w-12 bg-muted rounded" /></td>
                      <td className="py-4 px-4 text-right"><div className="h-4 w-16 bg-muted rounded ml-auto" /></td>
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                      <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p className="text-base font-medium">No outreach logs found</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <motion.tr
                      key={item.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b border-border/30 hover:bg-secondary/20 transition-colors group cursor-pointer"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="text-[10px] bg-secondary font-semibold">
                              {getInitials(item.businessName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{item.businessName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-muted-foreground line-clamp-1 max-w-[300px] text-xs">
                          {item.message}
                        </p>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          {channelIcons[item.channel] || <MessageSquare className="w-4 h-4" />}
                          <span className="capitalize text-xs">{item.channel}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={statusConfig[item.status]?.color as any || "secondary"} className="text-[10px] capitalize gap-1">
                          {statusConfig[item.status]?.icon}
                          {item.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell text-muted-foreground text-xs">
                        {item.sentBy === "ai" ? "AI Agent" : "Team Member"}
                      </td>
                      <td className="py-3 px-4 text-right text-muted-foreground text-xs">
                        {item.sentAt ? timeAgo(item.sentAt) : timeAgo(item.createdAt)}
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Composer Modal */}
      <Dialog open={isComposerOpen} onOpenChange={setIsComposerOpen}>
        <DialogContent className="sm:max-w-[500px] glass border-border p-0 overflow-hidden">
          <div className="p-6 pb-4 border-b border-border">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                AI Outreach Composer
              </DialogTitle>
            </DialogHeader>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Lead</label>
              <select 
                value={selectedLeadId}
                onChange={(e) => setSelectedLeadId(e.target.value)}
                className="w-full bg-secondary/50 border border-border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Choose a lead...</option>
                {leads.map((l) => (
                  <option key={l.id} value={l.id}>{l.businessName}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Channel</label>
              <div className="grid grid-cols-4 gap-2">
                {(["whatsapp", "email", "instagram", "linkedin"] as const).map((ch) => (
                  <Button
                    key={ch}
                    type="button"
                    variant={selectedChannel === ch ? "default" : "outline"}
                    className="text-xs py-1 px-2 h-8 capitalize"
                    onClick={() => setSelectedChannel(ch)}
                  >
                    {ch}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Message Content</label>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  disabled={isGenerating}
                  className="h-7 text-xs gap-1 text-primary hover:text-primary"
                  onClick={handleAutoGenerate}
                >
                  {isGenerating ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Wand2 className="w-3 h-3" />
                  )}
                  Auto-Generate
                </Button>
              </div>
              <textarea 
                className="w-full h-32 bg-secondary/50 border border-border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Type your message here or let AI generate one based on the lead's profile..."
                value={composerMessage}
                onChange={(e) => setComposerMessage(e.target.value)}
              />
            </div>
          </div>
          <div className="p-4 bg-secondary/20 border-t border-border flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsComposerOpen(false)} disabled={isSending}>Cancel</Button>
            <Button variant="gradient" className="gap-2" onClick={handleSendMessage} disabled={isSending}>
              {isSending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Send Message
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
