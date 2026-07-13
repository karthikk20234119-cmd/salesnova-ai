"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DollarSign, MoreHorizontal, Plus, MessageSquare, Eye, Sparkles, GripVertical, Filter, Calendar, Target, Loader2, Landmark } from "lucide-react";
import { toast } from "sonner";
import { getPipeline, updateDealStage, logActivity, createDeal, getTeamMembers } from "@/lib/data-service";
import { formatCurrency, getInitials, timeAgo } from "@/lib/utils";
import type { Deal, PipelineStage } from "@/types";

export default function PipelinePage() {
  const [pipeline, setPipeline] = useState<PipelineStage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [draggedDeal, setDraggedDeal] = useState<Deal | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  // Add Deal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState({
    businessName: "",
    value: "",
    stage: "lead",
    assignedTo: "member-1",
    aiInsight: "",
  });

  const team = getTeamMembers();

  // Load pipeline board on mount
  useEffect(() => {
    async function loadPipeline() {
      setIsLoading(true);
      try {
        const fetchedPipeline = await getPipeline();
        setPipeline(fetchedPipeline);
      } catch (err) {
        console.error("Failed to load pipeline stages", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadPipeline();
  }, []);

  const handleDragStart = (deal: Deal) => setDraggedDeal(deal);
  
  const handleDragOver = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    setDragOverStage(stageId);
  };
  
  const handleDrop = async (e: React.DragEvent, targetStageId: string) => {
    e.preventDefault();
    if (!draggedDeal) return;
    
    const sourceStageId = draggedDeal.stage;
    if (sourceStageId === targetStageId) {
      setDraggedDeal(null);
      setDragOverStage(null);
      return;
    }

    // Optimistic state update
    setPipeline((prev) =>
      prev.map((stage) => {
        if (stage.id === targetStageId) {
          return {
            ...stage,
            deals: [...stage.deals.filter((d) => d.id !== draggedDeal.id), { ...draggedDeal, stage: targetStageId }],
          };
        }
        if (stage.id === sourceStageId) {
          return {
            ...stage,
            deals: stage.deals.filter((d) => d.id !== draggedDeal.id),
          };
        }
        return stage;
      })
    );

    try {
      const ok = await updateDealStage(draggedDeal.id, targetStageId);
      if (!ok) {
        throw new Error("Failed to persist stage move");
      }
      
      const targetStageName = pipeline.find((s) => s.id === targetStageId)?.name || "next stage";
      await logActivity({
        userName: "You",
        action: `moved deal "${draggedDeal.businessName}" to`,
        target: targetStageName,
        type: "pipeline",
      });
    } catch (err) {
      console.error(err);
      const revertedPipeline = await getPipeline();
      setPipeline(revertedPipeline);
    } finally {
      setDraggedDeal(null);
      setDragOverStage(null);
    }
  };

  const handleDealStatusChange = async (deal: Deal, isWon: boolean) => {
    const targetStageId = isWon ? "closed" : "lost";

    setSelectedDeal(null);
    setIsLoading(true);

    try {
      const ok = await updateDealStage(deal.id, targetStageId);
      if (ok) {
        const fetchedPipeline = await getPipeline();
        setPipeline(fetchedPipeline);
        
        await logActivity({
          userName: "You",
          action: isWon ? "closed deal won:" : "closed deal lost:",
          target: deal.businessName,
          type: isWon ? "success" : "pipeline",
        });
      }
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValues.businessName) {
      toast.error("Business Name is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: Partial<Deal> = {
        businessName: formValues.businessName,
        value: parseFloat(formValues.value) || 0,
        stage: formValues.stage,
        assignedTo: formValues.assignedTo,
        aiInsight: formValues.aiInsight || "Highly qualified maps scraping ingestion lead",
        lastActivity: "Deal successfully registered in pipeline",
      };

      const newDeal = await createDeal(payload);
      if (newDeal) {
        // Reload pipeline to fetch latest board arrangement
        const updatedPipeline = await getPipeline();
        setPipeline(updatedPipeline);
        setIsCreateOpen(false);
        // Reset form
        setFormValues({
          businessName: "",
          value: "",
          stage: "lead",
          assignedTo: "member-1",
          aiInsight: "",
        });
        
        await logActivity({
          userName: "You",
          action: "created deal",
          target: `${payload.businessName} (${formatCurrency(payload.value || 0)})`,
          type: "deal",
        });
      } else {
        throw new Error("Unable to save deal to Supabase");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to create pipeline deal. Please verify.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalValue = pipeline.flatMap((s) => s.deals).reduce((sum, d) => sum + d.value, 0);
  const totalDeals = pipeline.flatMap((s) => s.deals).length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold">Sales Pipeline</h1>
          <p className="text-muted-foreground mt-1">
            {isLoading ? "Updating board..." : `${totalDeals} deals · ${formatCurrency(totalValue)} total value`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2"><Filter className="w-4 h-4" /> Filter</Button>
          <Button variant="gradient" size="sm" className="gap-2" onClick={() => setIsCreateOpen(true)}><Plus className="w-4 h-4" /> Add Deal</Button>
        </div>
      </div>

      <div className="flex-1 flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 items-start" style={{ minHeight: 0 }}>
        {isLoading && pipeline.length === 0 ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <div key={`column-skeleton-${idx}`} className="flex flex-col min-w-[280px] max-w-[300px] rounded-xl border border-border bg-card/30 p-3 h-96 animate-pulse space-y-4">
              <div className="flex justify-between items-center border-b border-border/50 pb-2">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-4 w-6 bg-muted rounded" />
              </div>
              <div className="space-y-3">
                <div className="h-20 bg-muted rounded-lg" />
                <div className="h-24 bg-muted rounded-lg" />
              </div>
            </div>
          ))
        ) : (
          pipeline.map((stage) => {
            const stageValue = stage.deals.reduce((sum, d) => sum + d.value, 0);
            return (
              <div
                key={stage.id}
                className={`flex flex-col min-w-[280px] max-w-[300px] rounded-xl border transition-all duration-200 h-full ${
                  dragOverStage === stage.id ? "border-primary bg-primary/5 shadow-md scale-[1.01]" : "border-border bg-card/30"
                }`}
                onDragOver={(e) => handleDragOver(e, stage.id)}
                onDragLeave={() => setDragOverStage(null)}
                onDrop={(e) => handleDrop(e, stage.id)}
              >
                <div className="flex flex-col p-3 border-b border-border/50 shrink-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.color }} />
                      <span className="text-sm font-semibold">{stage.name}</span>
                      <Badge variant="secondary" className="text-[10px] px-1.5 h-5">{stage.deals.length}</Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { setFormValues({ ...formValues, stage: stage.id }); setIsCreateOpen(true); }}><Plus className="w-3 h-3" /></Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6"><MoreHorizontal className="w-3 h-3" /></Button>
                    </div>
                  </div>
                  <div className="text-xs font-medium text-muted-foreground">{formatCurrency(stageValue)}</div>
                </div>
                <ScrollArea className="flex-1 p-2">
                  <div className="space-y-2">
                    {stage.deals.map((deal) => (
                      <div
                        key={deal.id}
                        draggable
                        onDragStart={() => handleDragStart(deal)}
                        onDragEnd={() => { setDraggedDeal(null); setDragOverStage(null); }}
                        onClick={() => setSelectedDeal(deal)}
                        className={`group p-3 rounded-lg border border-border/50 bg-card hover:bg-card/80 cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-md hover:border-border ${
                          draggedDeal?.id === deal.id ? "opacity-50 scale-95" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <GripVertical className="w-3.5 h-3.5 text-muted-foreground" />
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100"
                            onClick={(e) => { e.stopPropagation(); }}
                          >
                            <MoreHorizontal className="w-3 h-3" />
                          </Button>
                        </div>
                        <h4 className="text-sm font-medium mb-1 line-clamp-1">{deal.businessName}</h4>
                        {deal.value > 0 && (
                          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-400 mb-2">
                            <DollarSign className="w-3 h-3" />
                            {formatCurrency(deal.value)}
                          </div>
                        )}
                        {deal.aiInsight && (
                          <div className="flex items-start gap-1.5 p-2 rounded-md bg-primary/5 border border-primary/10 mb-2">
                            <Sparkles className="w-3 h-3 text-primary mt-0.5 shrink-0" />
                            <span className="text-[11px] text-primary/80 line-clamp-2">{deal.aiInsight}</span>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground mb-3 truncate">{deal.lastActivity}</p>
                        <div className="flex items-center justify-between">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-[9px] bg-secondary font-semibold">
                              {getInitials(deal.assignedTo === "member-1" ? "Arjun M" : deal.assignedTo === "member-2" ? "Priya S" : "Rahul V")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); }}><MessageSquare className="w-3 h-3" /></Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); setSelectedDeal(deal); }}><Eye className="w-3 h-3" /></Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            );
          })
        )}
      </div>

      {/* Deal Detail Dialog */}
      <Dialog open={!!selectedDeal} onOpenChange={(open) => !open && setSelectedDeal(null)}>
        {selectedDeal && (
          <DialogContent className="sm:max-w-[600px] glass border-border p-0 overflow-hidden">
            <div className="p-6 pb-4 border-b border-border bg-card/50">
              <DialogHeader>
                <DialogTitle className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold">{selectedDeal.businessName}</h2>
                    <p className="text-sm text-muted-foreground mt-1 font-normal flex items-center gap-2">
                      <Target className="w-4 h-4" /> {pipeline.find(s => s.id === selectedDeal.stage)?.name || "Pipeline Stage"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-emerald-400">{formatCurrency(selectedDeal.value)}</p>
                    <p className="text-xs text-muted-foreground">Deal Value</p>
                  </div>
                </DialogTitle>
              </DialogHeader>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Assigned To</p>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6"><AvatarFallback className="text-[10px] bg-secondary font-semibold">{getInitials(team.find(m => m.id === selectedDeal.assignedTo)?.name || "Arjun Mehta")}</AvatarFallback></Avatar>
                    <span className="text-sm font-medium">{team.find(m => m.id === selectedDeal.assignedTo)?.name || "Arjun Mehta"}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Created</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{timeAgo(selectedDeal.createdAt)}</span>
                  </div>
                </div>
              </div>

              {selectedDeal.aiInsight && (
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex gap-3 items-start">
                  <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-primary mb-1">AI Insight</h4>
                    <p className="text-sm text-primary/80">{selectedDeal.aiInsight}</p>
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-semibold mb-3">Recent Activity</h4>
                <div className="pl-4 border-l-2 border-border space-y-4">
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-primary" />
                    <p className="text-sm">{selectedDeal.lastActivity}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Today</p>
                  </div>
                  <div className="relative opacity-60">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-border" />
                    <p className="text-sm">Deal added to pipeline</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{timeAgo(selectedDeal.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-secondary/20 border-t border-border flex justify-between gap-2">
              <Button variant="outline" className="text-destructive hover:bg-destructive/10" onClick={() => handleDealStatusChange(selectedDeal, false)}>Lost Deal</Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setSelectedDeal(null)}>Close</Button>
                <Button variant="gradient" className="gap-2" onClick={() => handleDealStatusChange(selectedDeal, true)}>Won Deal</Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Create Deal Modal Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[500px] glass border-border p-0 overflow-hidden">
          <div className="p-6 pb-4 border-b border-border bg-card/50">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Landmark className="w-5 h-5 text-primary" />
                Register Pipeline Deal
              </DialogTitle>
            </DialogHeader>
          </div>
          <form onSubmit={handleCreateDeal} className="p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Lead / Business Name *</label>
              <Input
                required
                placeholder="e.g. Acme Redesigns"
                value={formValues.businessName}
                onChange={(e) => setFormValues({ ...formValues, businessName: e.target.value })}
                className="bg-secondary/50 border border-border"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Deal Value (₹) *</label>
                <Input
                  type="number"
                  required
                  placeholder="e.g. 45000"
                  value={formValues.value}
                  onChange={(e) => setFormValues({ ...formValues, value: e.target.value })}
                  className="bg-secondary/50 border border-border"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Starting Stage</label>
                <select
                  value={formValues.stage}
                  onChange={(e) => setFormValues({ ...formValues, stage: e.target.value })}
                  className="w-full h-[40px] bg-secondary/50 border border-border rounded-md px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="lead">Lead Ingested</option>
                  <option value="contacted">Contacted</option>
                  <option value="proposal">Proposal Sent</option>
                  <option value="closed">Closed Won</option>
                  <option value="lost">Lost Deal</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Assigned Team Member</label>
              <select
                value={formValues.assignedTo}
                onChange={(e) => setFormValues({ ...formValues, assignedTo: e.target.value })}
                className="w-full h-[40px] bg-secondary/50 border border-border rounded-md px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {team.map((member) => (
                  <option key={member.id} value={member.id}>{member.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">AI Insight / Notes</label>
              <textarea
                placeholder="Details of client discussion, budget fit, redesign mock status..."
                value={formValues.aiInsight}
                onChange={(e) => setFormValues({ ...formValues, aiInsight: e.target.value })}
                className="w-full h-20 bg-secondary/50 border border-border rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>

            <div className="p-4 -mx-6 -mb-6 bg-secondary/20 border-t border-border flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" variant="gradient" disabled={isSubmitting} className="gap-2">
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                Save Deal
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
