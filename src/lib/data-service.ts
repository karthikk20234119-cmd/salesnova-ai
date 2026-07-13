/**
 * SalesNova AI — Data Service Layer
 * 
 * Provides a unified API for all CRUD operations.
 * Uses Supabase when connected, falls back to mock data gracefully.
 * All components consume data through this service.
 */

import { createClient as createSupabaseClient } from "@/lib/supabase/client";
const createClient = () => createSupabaseClient() as any;
import {
  mockLeads, mockTeam, mockPipeline, mockTasks,
  mockOutreach, mockArtifacts, mockChatMessages,
  chartData, activityFeed,
} from "@/lib/mock-data";
import type { Lead, Deal, Task, OutreachMessage, TeamMember, PipelineStage } from "@/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

let _supabaseAvailable: boolean | null = null;

async function isSupabaseAvailable(): Promise<boolean> {
  if (_supabaseAvailable !== null) return _supabaseAvailable;
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key || url.includes("your-project")) {
      _supabaseAvailable = false;
      return false;
    }
    const supabase = createClient();
    const { error } = await supabase.from("leads").select("id").limit(1);
    _supabaseAvailable = !error;
    return !error;
  } catch {
    _supabaseAvailable = false;
    return false;
  }
}

function mapDbLeadToLead(row: Record<string, unknown>): Lead {
  return {
    id: row.id as string,
    businessName: row.business_name as string,
    category: row.category as string,
    phone: row.phone as string,
    whatsapp: row.whatsapp as string,
    email: row.email as string,
    website: row.website as string,
    location: row.location as string,
    rating: row.rating as number,
    reviewsCount: row.reviews_count as number,
    description: row.description as string,
    socialLinks: (row.social_links as { platform: string; url: string }[]) || [],
    source: row.source as Lead["source"],
    tags: (row.tags as string[]) || [],
    aiScore: row.ai_score as number,
    status: row.status as Lead["status"],
    assignedTo: (row.assigned_to as string) || "",
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

function mapDbTaskToTask(row: Record<string, unknown>): Task {
  return {
    id: row.id as string,
    title: row.title as string,
    description: row.description as string,
    type: row.type as Task["type"],
    status: row.status as Task["status"],
    priority: row.priority as Task["priority"],
    assignedTo: (row.assigned_to as string) || "",
    leadId: row.lead_id as string | undefined,
    dueDate: new Date(row.due_date as string),
    createdAt: new Date(row.created_at as string),
  };
}

function mapDbOutreachToOutreach(row: Record<string, unknown>): OutreachMessage {
  return {
    id: row.id as string,
    leadId: row.lead_id as string,
    businessName: row.business_name as string,
    channel: row.channel as OutreachMessage["channel"],
    message: row.message as string,
    status: row.status as OutreachMessage["status"],
    sentBy: (row.sent_by as string) || "",
    sentAt: row.sent_at ? new Date(row.sent_at as string) : undefined,
    createdAt: new Date(row.created_at as string),
  };
}

// ---------------------------------------------------------------------------
// LEADS
// ---------------------------------------------------------------------------

export async function getLeads(): Promise<Lead[]> {
  if (await isSupabaseAvailable()) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) return data.map(mapDbLeadToLead);
  }
  return mockLeads;
}

export async function getLeadById(id: string): Promise<Lead | null> {
  if (await isSupabaseAvailable()) {
    const supabase = createClient();
    const { data, error } = await supabase.from("leads").select("*").eq("id", id).single();
    if (!error && data) return mapDbLeadToLead(data);
  }
  return mockLeads.find((l) => l.id === id) || null;
}

export async function createLead(lead: Partial<Lead>): Promise<Lead | null> {
  if (await isSupabaseAvailable()) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("leads")
      .insert({
        business_name: lead.businessName || "",
        category: lead.category || "",
        phone: lead.phone || "",
        whatsapp: lead.whatsapp || "",
        email: lead.email || "",
        website: lead.website || "",
        location: lead.location || "",
        rating: lead.rating || 0,
        reviews_count: lead.reviewsCount || 0,
        description: lead.description || "",
        social_links: lead.socialLinks || [],
        source: lead.source || "website",
        tags: lead.tags || [],
        ai_score: lead.aiScore || 0,
        status: lead.status || "new",
      })
      .select()
      .single();
    if (!error && data) return mapDbLeadToLead(data);
  }
  // Mock fallback - create locally
  const newLead: Lead = {
    id: `lead-${Date.now()}`,
    businessName: lead.businessName || "",
    category: lead.category || "",
    phone: lead.phone || "",
    whatsapp: lead.whatsapp || "",
    email: lead.email || "",
    website: lead.website || "",
    location: lead.location || "",
    rating: lead.rating || 0,
    reviewsCount: lead.reviewsCount || 0,
    description: lead.description || "",
    socialLinks: lead.socialLinks || [],
    source: lead.source || "website",
    tags: lead.tags || [],
    aiScore: lead.aiScore || Math.floor(40 + Math.random() * 60),
    status: lead.status || "new",
    assignedTo: lead.assignedTo || "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  return newLead;
}

export async function updateLead(id: string, updates: Partial<Lead>): Promise<boolean> {
  if (await isSupabaseAvailable()) {
    const supabase = createClient();
    const { error } = await supabase
      .from("leads")
      .update({
        ...(updates.businessName !== undefined && { business_name: updates.businessName }),
        ...(updates.category !== undefined && { category: updates.category }),
        ...(updates.status !== undefined && { status: updates.status }),
        ...(updates.aiScore !== undefined && { ai_score: updates.aiScore }),
        ...(updates.phone !== undefined && { phone: updates.phone }),
        ...(updates.email !== undefined && { email: updates.email }),
        ...(updates.location !== undefined && { location: updates.location }),
        ...(updates.tags !== undefined && { tags: updates.tags }),
      })
      .eq("id", id);
    return !error;
  }
  return true; // Mock always succeeds
}

export async function deleteLead(id: string): Promise<boolean> {
  if (await isSupabaseAvailable()) {
    const supabase = createClient();
    const { error } = await supabase.from("leads").delete().eq("id", id);
    return !error;
  }
  return true;
}

// ---------------------------------------------------------------------------
// TASKS
// ---------------------------------------------------------------------------

export async function getTasks(): Promise<Task[]> {
  if (await isSupabaseAvailable()) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("due_date", { ascending: true });
    if (!error && data) return data.map(mapDbTaskToTask);
  }
  return mockTasks;
}

export async function createTask(task: Partial<Task>): Promise<Task | null> {
  if (await isSupabaseAvailable()) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("tasks")
      .insert({
        title: task.title || "",
        description: task.description || "",
        type: task.type || "outreach",
        status: task.status || "todo",
        priority: task.priority || "medium",
        due_date: (task.dueDate || new Date()).toISOString(),
      })
      .select()
      .single();
    if (!error && data) return mapDbTaskToTask(data);
  }
  return {
    id: `task-${Date.now()}`,
    title: task.title || "",
    description: task.description || "",
    type: task.type || "outreach",
    status: task.status || "todo",
    priority: task.priority || "medium",
    assignedTo: task.assignedTo || "",
    dueDate: task.dueDate || new Date(),
    createdAt: new Date(),
  };
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<boolean> {
  if (await isSupabaseAvailable()) {
    const supabase = createClient();
    const { error } = await supabase
      .from("tasks")
      .update({
        ...(updates.title !== undefined && { title: updates.title }),
        ...(updates.status !== undefined && { status: updates.status }),
        ...(updates.priority !== undefined && { priority: updates.priority }),
        ...(updates.description !== undefined && { description: updates.description }),
      })
      .eq("id", id);
    return !error;
  }
  return true;
}

export async function deleteTask(id: string): Promise<boolean> {
  if (await isSupabaseAvailable()) {
    const supabase = createClient();
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    return !error;
  }
  return true;
}

// ---------------------------------------------------------------------------
// OUTREACH
// ---------------------------------------------------------------------------

export async function getOutreach(): Promise<OutreachMessage[]> {
  if (await isSupabaseAvailable()) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("outreach_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) return data.map(mapDbOutreachToOutreach);
  }
  return mockOutreach;
}

export async function createOutreach(msg: Partial<OutreachMessage>): Promise<OutreachMessage | null> {
  if (await isSupabaseAvailable()) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("outreach_messages")
      .insert({
        ...(msg.leadId && { lead_id: msg.leadId }),
        business_name: msg.businessName || "",
        channel: msg.channel || "whatsapp",
        message: msg.message || "",
        status: msg.status || "draft",
      })
      .select()
      .single();
    if (!error && data) return mapDbOutreachToOutreach(data);
  }
  return {
    id: `outreach-${Date.now()}`,
    leadId: msg.leadId || "",
    businessName: msg.businessName || "",
    channel: msg.channel || "whatsapp",
    message: msg.message || "",
    status: msg.status || "draft",
    sentBy: msg.sentBy || "",
    createdAt: new Date(),
  };
}

export async function updateOutreach(id: string, updates: Partial<OutreachMessage>): Promise<boolean> {
  if (await isSupabaseAvailable()) {
    const supabase = createClient();
    const { error } = await supabase
      .from("outreach_messages")
      .update({
        ...(updates.status !== undefined && { status: updates.status }),
        ...(updates.message !== undefined && { message: updates.message }),
        ...(updates.status === "sent" && { sent_at: new Date().toISOString() }),
      })
      .eq("id", id);
    return !error;
  }
  return true;
}

export async function deleteOutreach(id: string): Promise<boolean> {
  if (await isSupabaseAvailable()) {
    const supabase = createClient();
    const { error } = await supabase.from("outreach_messages").delete().eq("id", id);
    return !error;
  }
  return true;
}

function mapDbDealToDeal(row: Record<string, unknown>): Deal {
  return {
    id: row.id as string,
    leadId: (row.lead_id as string) || "",
    businessName: row.business_name as string,
    value: Number(row.value || 0),
    stage: row.stage as string,
    assignedTo: (row.assigned_to as string) || "",
    aiInsight: (row.ai_insight as string) || "",
    lastActivity: (row.last_activity as string) || "Deal created in pipeline",
    createdAt: new Date(row.created_at as string),
  };
}

// ---------------------------------------------------------------------------
// DEALS
// ---------------------------------------------------------------------------

export async function getPipeline(): Promise<PipelineStage[]> {
  if (await isSupabaseAvailable()) {
    const supabase = createClient();
    const { data: dbDeals, error } = await supabase
      .from("deals")
      .select("*")
      .order("created_at", { ascending: false });
      
    if (!error && dbDeals) {
      const deals: Deal[] = dbDeals.map(mapDbDealToDeal);
      return [
        { id: "stage-1", name: "New Lead", color: "#6366f1", deals: deals.filter((d) => d.stage === "new") },
        { id: "stage-2", name: "AI Analyzed", color: "#8b5cf6", deals: deals.filter((d) => d.stage === "ai_analyzed") },
        { id: "stage-3", name: "Contacted", color: "#06b6d4", deals: deals.filter((d) => d.stage === "contacted") },
        { id: "stage-4", name: "Follow-Up", color: "#f59e0b", deals: deals.filter((d) => d.stage === "follow_up") },
        { id: "stage-5", name: "Interested", color: "#10b981", deals: deals.filter((d) => d.stage === "interested") },
        { id: "stage-6", name: "Proposal Sent", color: "#3b82f6", deals: deals.filter((d) => d.stage === "proposal_sent") },
        { id: "stage-7", name: "Meeting", color: "#8b5cf6", deals: deals.filter((d) => d.stage === "meeting_scheduled") },
        { id: "stage-8", name: "Closed Won", color: "#22c55e", deals: deals.filter((d) => d.stage === "closed") },
        { id: "stage-9", name: "Rejected", color: "#ef4444", deals: deals.filter((d) => d.stage === "rejected") },
      ];
    }
  }
  return mockPipeline;
}

export async function createDeal(deal: Partial<Deal>): Promise<Deal | null> {
  if (await isSupabaseAvailable()) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("deals")
      .insert({
        ...(deal.leadId && { lead_id: deal.leadId }),
        business_name: deal.businessName || "",
        value: deal.value || 0,
        stage: deal.stage || "lead",
        assigned_to: deal.assignedTo || "member-1",
        ai_insight: deal.aiInsight || "",
        last_activity: deal.lastActivity || "Deal created in pipeline",
      })
      .select()
      .single();
    if (!error && data) return mapDbDealToDeal(data);
  }
  return {
    id: `deal-${Date.now()}`,
    leadId: deal.leadId || "",
    businessName: deal.businessName || "",
    value: deal.value || 0,
    stage: deal.stage || "lead",
    assignedTo: deal.assignedTo || "member-1",
    aiInsight: deal.aiInsight || "",
    lastActivity: deal.lastActivity || "Deal created in pipeline",
    createdAt: new Date(),
  };
}

export async function updateDealStage(id: string, stage: string): Promise<boolean> {
  if (await isSupabaseAvailable()) {
    const supabase = createClient();
    const { error } = await supabase.from("deals").update({ stage }).eq("id", id);
    return !error;
  }
  return true;
}

// ---------------------------------------------------------------------------
// ACTIVITY FEED
// ---------------------------------------------------------------------------

export async function logActivity(entry: { userName: string; action: string; target: string; type: string }): Promise<boolean> {
  if (await isSupabaseAvailable()) {
    const supabase = createClient();
    const { error } = await supabase.from("activity_feed").insert({
      user_name: entry.userName,
      action: entry.action,
      target: entry.target,
      type: entry.type,
    });
    return !error;
  }
  return true;
}

// ---------------------------------------------------------------------------
// STATIC DATA (always from mock for charts/team until fully migrated)
// ---------------------------------------------------------------------------

export function getTeamMembers(): TeamMember[] {
  return mockTeam;
}

export function getChartData() {
  return chartData;
}

export async function getActivityFeed() {
  if (await isSupabaseAvailable()) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("activity_feed")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);
    
    if (!error && data) {
      return data.map((row: Record<string, unknown>) => ({
        id: row.id,
        user: row.user_name as string,
        action: row.action as string,
        target: row.target as string,
        type: row.type as "outreach" | "pipeline" | "ai" | "artifact" | "lead" | "deal" | "task",
        time: new Date(row.created_at as string)
      }));
    }
  }
  return activityFeed;
}

export function getArtifacts() {
  return mockArtifacts;
}

export function getChatMessages() {
  return mockChatMessages;
}
