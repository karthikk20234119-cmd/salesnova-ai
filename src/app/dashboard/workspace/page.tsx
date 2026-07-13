"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sparkles, Send, MessageSquare, FileText, ClipboardCheck, History,
  Copy, Download, ExternalLink, Bot, ChevronRight, PanelLeftClose,
  Wand2, RefreshCw, Palette, CheckCircle2, Laptop
} from "lucide-react";
import { getArtifacts, getChatMessages } from "@/lib/data-service";
import { getInitials } from "@/lib/utils";

const artifactTypes = [
  { id: "message", label: "Message", icon: MessageSquare, color: "text-cyan-400" },
  { id: "audit", label: "Audit", icon: ClipboardCheck, color: "text-amber-400" },
  { id: "proposal", label: "Proposal", icon: FileText, color: "text-emerald-400" },
  { id: "redesign", label: "Redesign", icon: Palette, color: "text-pink-400" },
];

export default function WorkspacePage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [artifacts, setArtifacts] = useState<any[]>([]);
  const [activeArtifact, setActiveArtifact] = useState<any>(null);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPanel, setShowPanel] = useState(true);
  const [toastMessage, setToastMessage] = useState("");

  // Load logs & artifacts from data-service
  useEffect(() => {
    const fetchedArtifacts = getArtifacts();
    const fetchedMessages = getChatMessages();
    setArtifacts(fetchedArtifacts);
    setMessages(fetchedMessages);
    if (fetchedArtifacts.length > 0) {
      setActiveArtifact(fetchedArtifacts[0]);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2500);
  };

  const handleSend = () => {
    if (!input.trim() || !activeArtifact) return;

    const userMsg = input.trim();
    setMessages((prev) => [
      ...prev,
      { id: `msg-${Date.now()}`, role: "user", content: userMsg, timestamp: new Date() }
    ]);
    setInput("");
    setIsGenerating(true);

    // AI Dynamic Agent Simulation Logic
    setTimeout(() => {
      let aiResponse = "";
      let updatedArtifact = { ...activeArtifact };
      
      const query = userMsg.toLowerCase();

      if (query.includes("redesign") || query.includes("website") || query.includes("landing")) {
        updatedArtifact = {
          ...updatedArtifact,
          version: activeArtifact.version + 1,
          title: "Website Redesign Pitch Mockup",
          type: "redesign",
          content: `🎨 SALESNOVA AI WEBPAGE REDESIGN PROPOSAL

1. Current Site Issues Identified:
   - High loading latency on mobile (>4.8 seconds)
   - Layout is not responsive; CTA elements are cut off on iOS devices
   - Google Maps reviews integration is absent, missing key social proof

2. Proposed Upgrades (Interactive Glassmorphic Framework):
   - Fully optimized next-gen Vite skeleton structure (reduces load time to 0.9s)
   - Sticky float WhatsApp direct click-to-chat CTA widget
   - Custom dynamic testimonial grid pulling real-time reviews count

3. Predicted Conversion Lift:
   - estimated +28% increase in direct reservation submissions.`
        };
        aiResponse = "I have drafted a comprehensive Website Redesign Pitch Mockup tailored for their mobile performance gaps. The changes have been pushed to version " + updatedArtifact.version + " in the preview pane!";
      } else if (query.includes("audit") || query.includes("seo") || query.includes("maps")) {
        updatedArtifact = {
          ...updatedArtifact,
          version: activeArtifact.version + 1,
          title: "Lead Digital Footprint Audit",
          type: "audit",
          content: `📊 DUAL SEO & DIGITAL AUDIT REPORT

- Google Maps Rating: 4.8 / 5.0 (High authority)
- Review Count: 142 total reviews
- Mobile Friendly: NO (Failed Google Web Vitals check)
- Meta Tags Structure: Missing descriptive OpenGraph parameters
- Security SSL: Active (Valid Let's Encrypt)
- Recommendation: Introduce optimized SEO structural JSON-LD schemas.`
        };
        aiResponse = "Great request. I compiled a full Digital Footprint Audit highlighting their missing mobile optimization tags. Check out the updated Audit tab!";
      } else if (query.includes("whatsapp") || query.includes("copy") || query.includes("text")) {
        updatedArtifact = {
          ...updatedArtifact,
          version: activeArtifact.version + 1,
          title: "WhatsApp Campaign Copywriter",
          type: "message",
          content: `💬 HIGH-CONVERTING WHATSAPP TEMPLATE

"Hey! Love the reviews on *${activeArtifact.title.split(" - ")[0]}* in your local area. 🌟 

I noticed your website is missing a mobile-friendly contact link, which could be costing you around 25% of maps traffic bookings.

We created a quick redesign concept to show you how to capture those leads. Want to see a 10-second video preview?"`
        };
        aiResponse = "Dynamic copy is ready! I generated a high-converting WhatsApp message customized to their location. Check out the Message tab.";
      } else {
        // Generic follow up
        updatedArtifact = {
          ...updatedArtifact,
          version: activeArtifact.version + 1,
          content: activeArtifact.content + "\n\n[AI Edit: Optimized flow based on latest guidelines]"
        };
        aiResponse = "I have successfully optimized the active artifact structure to ensure clear headings and strong calls-to-action.";
      }

      // Update states
      setArtifacts((prev) =>
        prev.map((a) => (a.id === updatedArtifact.id ? updatedArtifact : a))
      );
      setActiveArtifact(updatedArtifact);
      setMessages((prev) => [
        ...prev,
        { id: `msg-${Date.now()}`, role: "assistant", content: aiResponse, timestamp: new Date(), artifactId: updatedArtifact.id }
      ]);
      setIsGenerating(false);
      showToast("Artifact updated successfully!");
    }, 1200);
  };

  const handleCopyArtifactContent = () => {
    if (!activeArtifact) return;
    navigator.clipboard.writeText(activeArtifact.content);
    showToast("Content copied to clipboard!");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[calc(100vh-7rem)] flex flex-col relative">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary animate-pulse" /> AI Workspace
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Create and edit AI-generated campaign artifacts with live preview</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowPanel(!showPanel)}>
          <PanelLeftClose className="w-4 h-4" /> {showPanel ? "Hide" : "Show"} Assistant
        </Button>
      </div>

      {toastMessage && (
        <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-md shadow-lg flex items-center gap-1.5 z-50">
          <CheckCircle2 className="w-3.5 h-3.5" />
          {toastMessage}
        </div>
      )}

      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 shrink-0">
        {artifactTypes.map((type) => {
          const matched = artifacts.find((a) => a.type === type.id) || activeArtifact;
          const isSelected = activeArtifact?.type === type.id;
          return (
            <Button
              key={type.id}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              className="gap-2 shrink-0"
              onClick={() => {
                const found = artifacts.find((a) => a.type === type.id);
                if (found) setActiveArtifact(found);
              }}
            >
              <type.icon className={`w-4 h-4 ${isSelected ? "" : type.color}`} />
              {type.label}
            </Button>
          );
        })}
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        <AnimatePresence>
          {showPanel && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "40%", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="flex flex-col min-w-[340px] rounded-xl border border-border bg-card/50 overflow-hidden h-full"
            >
              <div className="flex items-center justify-between p-4 border-b border-border bg-secondary/10 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Nova AI Assistant</p>
                    <p className="text-[11px] text-muted-foreground">Contextual Co-Pilot</p>
                  </div>
                </div>
                <Badge variant="success" className="text-[10px]">Active</Badge>
              </div>
              
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                      <Avatar className="h-7 w-7 shrink-0">
                        <AvatarFallback className={`text-[10px] font-bold ${
                          msg.role === "assistant" ? "gradient-primary text-white" : "bg-secondary"
                        }`}>
                          {msg.role === "assistant" ? "AI" : "AM"}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`max-w-[85%] p-3 rounded-xl text-sm leading-relaxed ${
                        msg.role === "user" 
                          ? "bg-primary text-primary-foreground rounded-tr-sm" 
                          : "bg-secondary/60 rounded-tl-sm border border-border/30"
                      }`}>
                        {msg.content}
                        {msg.artifactId && (
                          <div 
                            className="mt-2 p-2 rounded-lg bg-background/50 border border-border/50 flex items-center gap-2 cursor-pointer hover:bg-background transition-colors"
                            onClick={() => {
                              const match = artifacts.find(a => a.id === msg.artifactId);
                              if (match) setActiveArtifact(match);
                            }}
                          >
                            <Sparkles className="w-3.5 h-3.5 text-primary" />
                            <span className="text-[10px] font-medium text-muted-foreground">Click to inspect changes</span>
                            <ChevronRight className="w-3 h-3 ml-auto text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isGenerating && (
                    <div className="flex gap-3">
                      <Avatar className="h-7 w-7"><AvatarFallback className="text-[10px] gradient-primary text-white font-bold">AI</AvatarFallback></Avatar>
                      <div className="p-3 rounded-xl bg-secondary rounded-tl-sm">
                        <div className="flex gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" />
                          <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                          <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              <div className="p-4 border-t border-border bg-secondary/10 shrink-0">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Ask AI e.g. generate whatsapp message..."
                    className="flex-1 bg-secondary/50"
                  />
                  <Button variant="gradient" size="icon" onClick={handleSend} disabled={isGenerating}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button variant="ghost" size="sm" className="text-xs gap-1 h-7 text-muted-foreground hover:text-foreground" onClick={() => setInput("Optimize and improve the active copy content")}>
                    <Wand2 className="w-3 h-3 text-primary" /> Improve Copy
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs gap-1 h-7 text-muted-foreground hover:text-foreground" onClick={() => setInput("Create a mobile digital footprint audit")}>
                    <RefreshCw className="w-3 h-3 text-cyan-400" /> Create Audit
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 flex flex-col rounded-xl border border-border bg-card/50 overflow-hidden h-full">
          {activeArtifact ? (
            <>
              <div className="flex items-center justify-between p-4 border-b border-border bg-secondary/10 shrink-0">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                  <h3 className="text-sm font-semibold">{activeArtifact.title}</h3>
                  <Badge variant="purple" className="text-[10px]">v{activeArtifact.version}</Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopyArtifactContent} title="Copy Content">
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" title="Download Artifact">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <ScrollArea className="flex-1 p-6">
                <div className="max-w-3xl mx-auto space-y-6">
                  <div className="p-6 rounded-xl bg-secondary/30 border border-border/50 relative overflow-hidden backdrop-blur-md shadow-inner">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant={
                        activeArtifact.type === "message" ? "info" : activeArtifact.type === "audit" ? "warning" : "success"
                      } className="gap-1 capitalize">
                        {activeArtifact.type === "message" && <MessageSquare className="w-3 h-3" />}
                        {activeArtifact.type === "audit" && <ClipboardCheck className="w-3 h-3" />}
                        {activeArtifact.type === "proposal" && <FileText className="w-3 h-3" />}
                        {activeArtifact.type === "redesign" && <Palette className="w-3 h-3" />}
                        {activeArtifact.type}
                      </Badge>
                    </div>
                    <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed text-sm font-mono text-foreground/90">
                      {activeArtifact.content}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {activeArtifact.type === "message" && (
                      <Button variant="gradient" className="gap-2 shrink-0">
                        <ExternalLink className="w-4 h-4" /> Launch Outreach
                      </Button>
                    )}
                    <Button variant="outline" className="gap-2" onClick={handleCopyArtifactContent}>
                      <Copy className="w-4 h-4" /> Copy Text
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </>
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center text-muted-foreground p-12">
              <Bot className="w-12 h-12 mb-3 opacity-25 animate-bounce" />
              <p className="text-sm font-medium">Select an artifact tab to inspect preview</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
