export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          role: "admin" | "sales_manager" | "outreach_agent" | "designer" | "developer";
          avatar_url: string | null;
          status: "active" | "away" | "offline";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          role?: "admin" | "sales_manager" | "outreach_agent" | "designer" | "developer";
          avatar_url?: string | null;
          status?: "active" | "away" | "offline";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          role?: "admin" | "sales_manager" | "outreach_agent" | "designer" | "developer";
          avatar_url?: string | null;
          status?: "active" | "away" | "offline";
          updated_at?: string;
        };
      };
      leads: {
        Row: {
          id: string;
          business_name: string;
          category: string;
          phone: string;
          whatsapp: string;
          email: string;
          website: string;
          location: string;
          rating: number;
          reviews_count: number;
          description: string;
          social_links: Json;
          source: string;
          tags: string[];
          ai_score: number;
          status: string;
          assigned_to: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          business_name: string;
          category: string;
          phone?: string;
          whatsapp?: string;
          email?: string;
          website?: string;
          location?: string;
          rating?: number;
          reviews_count?: number;
          description?: string;
          social_links?: Json;
          source?: string;
          tags?: string[];
          ai_score?: number;
          status?: string;
          assigned_to?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          business_name?: string;
          category?: string;
          phone?: string;
          whatsapp?: string;
          email?: string;
          website?: string;
          location?: string;
          rating?: number;
          reviews_count?: number;
          description?: string;
          social_links?: Json;
          source?: string;
          tags?: string[];
          ai_score?: number;
          status?: string;
          assigned_to?: string | null;
          updated_at?: string;
        };
      };
      deals: {
        Row: {
          id: string;
          lead_id: string;
          business_name: string;
          value: number;
          stage: string;
          assigned_to: string | null;
          last_activity: string;
          ai_insight: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          lead_id: string;
          business_name: string;
          value?: number;
          stage?: string;
          assigned_to?: string | null;
          last_activity?: string;
          ai_insight?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          lead_id?: string;
          business_name?: string;
          value?: number;
          stage?: string;
          assigned_to?: string | null;
          last_activity?: string;
          ai_insight?: string | null;
          updated_at?: string;
        };
      };
      pipeline_stages: {
        Row: {
          id: string;
          name: string;
          color: string;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          color: string;
          position: number;
          created_at?: string;
        };
        Update: {
          name?: string;
          color?: string;
          position?: number;
        };
      };
      tasks: {
        Row: {
          id: string;
          title: string;
          description: string;
          type: string;
          status: "todo" | "in_progress" | "done";
          priority: "low" | "medium" | "high" | "urgent";
          assigned_to: string | null;
          lead_id: string | null;
          due_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string;
          type?: string;
          status?: "todo" | "in_progress" | "done";
          priority?: "low" | "medium" | "high" | "urgent";
          assigned_to?: string | null;
          lead_id?: string | null;
          due_date: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string;
          type?: string;
          status?: "todo" | "in_progress" | "done";
          priority?: "low" | "medium" | "high" | "urgent";
          assigned_to?: string | null;
          lead_id?: string | null;
          due_date?: string;
          updated_at?: string;
        };
      };
      outreach_messages: {
        Row: {
          id: string;
          lead_id: string;
          business_name: string;
          channel: "whatsapp" | "email" | "instagram" | "linkedin";
          message: string;
          status: "draft" | "approved" | "sent" | "replied" | "converted";
          sent_by: string | null;
          sent_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          lead_id: string;
          business_name: string;
          channel?: "whatsapp" | "email" | "instagram" | "linkedin";
          message: string;
          status?: "draft" | "approved" | "sent" | "replied" | "converted";
          sent_by?: string | null;
          sent_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          lead_id?: string;
          business_name?: string;
          channel?: "whatsapp" | "email" | "instagram" | "linkedin";
          message?: string;
          status?: "draft" | "approved" | "sent" | "replied" | "converted";
          sent_by?: string | null;
          sent_at?: string | null;
          updated_at?: string;
        };
      };
      artifacts: {
        Row: {
          id: string;
          lead_id: string;
          type: string;
          title: string;
          content: string;
          version: number;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          lead_id: string;
          type: string;
          title: string;
          content: string;
          version?: number;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          lead_id?: string;
          type?: string;
          title?: string;
          content?: string;
          version?: number;
          created_by?: string | null;
          updated_at?: string;
        };
      };
      activity_feed: {
        Row: {
          id: string;
          user_name: string;
          action: string;
          target: string;
          type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_name: string;
          action: string;
          target: string;
          type?: string;
          created_at?: string;
        };
        Update: {
          user_name?: string;
          action?: string;
          target?: string;
          type?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
