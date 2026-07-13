export type LeadSource = "google_maps" | "instagram" | "facebook" | "linkedin" | "justdial" | "indiamart" | "website" | "referral";
export type LeadStatus = "new" | "ai_analyzed" | "contacted" | "follow_up" | "interested" | "proposal_sent" | "meeting_scheduled" | "closed" | "rejected";
export type Priority = "low" | "medium" | "high" | "urgent";

export interface Lead {
  id: string;
  businessName: string;
  category: string;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  location: string;
  rating: number;
  reviewsCount: number;
  description: string;
  socialLinks: { platform: string; url: string }[];
  source: LeadSource;
  tags: string[];
  aiScore: number;
  status: LeadStatus;
  assignedTo: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PipelineStage {
  id: string;
  name: string;
  color: string;
  deals: Deal[];
}

export interface Deal {
  id: string;
  leadId: string;
  businessName: string;
  value: number;
  stage: string;
  assignedTo: string;
  lastActivity: string;
  createdAt: Date;
  aiInsight?: string;
}

export type ArtifactType = "message" | "redesign" | "audit" | "proposal" | "landing_page" | "pitch_deck";

export interface Artifact {
  id: string;
  leadId: string;
  type: ArtifactType;
  title: string;
  content: string;
  version: number;
  createdBy: string;
  updatedAt: Date;
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  artifactId?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: "outreach" | "follow_up" | "redesign" | "proposal" | "meeting" | "onboarding" | "lead_scraping";
  status: "todo" | "in_progress" | "done";
  priority: Priority;
  assignedTo: string;
  leadId?: string;
  dueDate: Date;
  createdAt: Date;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "admin" | "sales_manager" | "outreach_agent" | "designer" | "developer";
  avatar?: string;
  status: "active" | "away" | "offline";
  leadsAssigned: number;
  tasksCompleted: number;
  outreachSent: number;
  conversionRate: number;
}

export interface OutreachMessage {
  id: string;
  leadId: string;
  businessName: string;
  channel: "whatsapp" | "email" | "instagram" | "linkedin";
  message: string;
  status: "draft" | "approved" | "sent" | "replied" | "converted";
  sentBy: string;
  sentAt?: Date;
  createdAt: Date;
}

export interface AnalyticsData {
  outreachSent: number;
  replies: number;
  conversions: number;
  responseRate: number;
  revenue: number;
  activeLeads: number;
  tasksCompleted: number;
  teamMembers: number;
}
