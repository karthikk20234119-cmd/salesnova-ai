"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Users, Send, BarChart3, DollarSign, TrendingUp, TrendingDown,
  ArrowRight, Sparkles, Target, Clock, Plus, Eye, Lightbulb, Loader2
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { getLeads, getOutreach, getActivityFeed, getChartData, getPipeline } from "@/lib/data-service";
import { getCurrentUser } from "@/lib/auth";
import { getInitials, timeAgo, formatCurrency } from "@/lib/utils";
import Link from "next/link";
import type { Lead, OutreachMessage } from "@/types";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const activityTypeColors: Record<string, string> = {
  outreach: "bg-cyan-500",
  pipeline: "bg-purple-500",
  ai: "bg-emerald-500",
  artifact: "bg-pink-500",
  lead: "bg-amber-500",
  deal: "bg-blue-500",
  task: "bg-orange-500",
};

export default function DashboardPage() {
  const [userName, setUserName] = useState("User");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [outreach, setOutreach] = useState<OutreachMessage[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [pipelineDealsCount, setPipelineDealsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const staticChartData = getChartData();

  useEffect(() => {
    async function loadDashboardData() {
      setIsLoading(true);
      try {
        const [u, fetchedLeads, fetchedOutreach, fetchedFeed, fetchedPipeline] = await Promise.all([
          getCurrentUser(),
          getLeads(),
          getOutreach(),
          getActivityFeed(),
          getPipeline()
        ]);
        
        if (u) {
          setUserName(u.fullName.split(" ")[0]);
        }
        setLeads(fetchedLeads);
        setOutreach(fetchedOutreach);
        setActivities(fetchedFeed);
        
        const dealsCount = fetchedPipeline.flatMap((s) => s.deals).length;
        setPipelineDealsCount(dealsCount);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const totalLeads = leads.length;
  const outreachSent = outreach.filter(o => o.status === "sent").length + 389;
  const conversions = leads.filter(l => l.status === "closed" || l.status === "interested").length + 42;
  const revenueEstimate = conversions * 29500; // Average deal size estimation in INR

  const kpiCards = [
    { title: "Total Leads", value: totalLeads.toString(), change: "+12.5%", trend: "up" as const, icon: Users, color: "text-purple-400", bg: "bg-purple-500/10" },
    { title: "Outreach Sent", value: outreachSent.toString(), change: "+23.1%", trend: "up" as const, icon: Send, color: "text-cyan-400", bg: "bg-cyan-500/10" },
    { title: "Conversions", value: conversions.toString(), change: "+8.3%", trend: "up" as const, icon: Target, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { title: "Est. Revenue", value: `₹${(revenueEstimate / 100000).toFixed(1)}L`, change: "+18.7%", trend: "up" as const, icon: DollarSign, color: "text-amber-400", bg: "bg-amber-500/10" },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Welcome back, {userName} 👋
            {isLoading && <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />}
          </h1>
          <p className="text-muted-foreground mt-1">Here&apos;s what&apos;s happening with your outreach today.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/workspace"><Button variant="outline" size="sm" className="gap-2"><Sparkles className="w-4 h-4" /> AI Workspace</Button></Link>
          <Link href="/dashboard/outreach"><Button variant="outline" size="sm" className="gap-2"><Send className="w-4 h-4" /> Composer</Button></Link>
          <Link href="/dashboard/leads"><Button variant="gradient" size="sm" className="gap-2"><Plus className="w-4 h-4" /> Add Leads</Button></Link>
        </div>
      </motion.div>

      {/* AI Insights Banner */}
      <motion.div variants={item}>
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="flex gap-4 items-start sm:items-center relative z-10">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center shrink-0">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-primary mb-1">AI Recommendation</h3>
              <p className="text-sm text-muted-foreground">3 leads in &quot;Proposal Sent&quot; stage haven&apos;t replied in 3 days. Recommend generating personalized follow-ups.</p>
            </div>
          </div>
          <Link href="/dashboard/workspace">
            <Button variant="outline" size="sm" className="shrink-0 relative z-10 bg-background/50 backdrop-blur border-primary/20 hover:bg-primary/10">
              Generate Follow-ups
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => (
          <Card key={kpi.title} className="glass glass-hover group cursor-pointer">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${kpi.bg}`}><kpi.icon className={`w-5 h-5 ${kpi.color}`} /></div>
                <div className={`flex items-center gap-1 text-xs font-medium ${kpi.trend === "up" ? "text-emerald-400" : "text-red-400"}`}>
                  {kpi.trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}{kpi.change}
                </div>
              </div>
              <div className="text-2xl font-bold">{isLoading ? "..." : kpi.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{kpi.title}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Charts section */}
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div variants={item} className="lg:col-span-2">
          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">Outreach Performance</CardTitle>
              <Badge variant="secondary" className="text-xs">Last 6 months</Badge>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={staticChartData.outreachTrend}>
                  <defs>
                    <linearGradient id="gradSent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradReplied" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(172, 66%, 50%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(172, 66%, 50%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 20%, 18%)" />
                  <XAxis dataKey="month" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                  <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} />
                  <Tooltip contentStyle={{ background: "hsl(222, 47%, 8%)", border: "1px solid hsl(222, 20%, 18%)", borderRadius: "8px", fontSize: "12px" }} />
                  <Area type="monotone" dataKey="sent" stroke="hsl(262, 83%, 58%)" fill="url(#gradSent)" strokeWidth={2} />
                  <Area type="monotone" dataKey="replied" stroke="hsl(172, 66%, 50%)" fill="url(#gradReplied)" strokeWidth={2} />
                  <Area type="monotone" dataKey="converted" stroke="hsl(142, 71%, 45%)" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-6 mt-2 justify-center">
                <div className="flex items-center gap-2 text-xs"><div className="w-3 h-1 rounded bg-nova-purple" />Sent</div>
                <div className="flex items-center gap-2 text-xs"><div className="w-3 h-1 rounded bg-nova-teal" />Replied</div>
                <div className="flex items-center gap-2 text-xs"><div className="w-3 h-1 rounded border border-emerald-500" style={{ borderStyle: "dashed" }} />Converted</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="glass h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">Weekly Activity</CardTitle>
              <Link href="/dashboard/analytics"><Button variant="ghost" size="sm" className="gap-1 text-xs px-2 h-7"><BarChart3 className="w-3 h-3" /></Button></Link>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={staticChartData.weeklyActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 20%, 18%)" />
                  <XAxis dataKey="day" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                  <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} />
                  <Tooltip contentStyle={{ background: "hsl(222, 47%, 8%)", border: "1px solid hsl(222, 20%, 18%)", borderRadius: "8px", fontSize: "12px" }} />
                  <Bar dataKey="outreach" fill="hsl(262, 83%, 58%)" radius={[4, 4, 0, 0]} barSize={12} />
                  <Bar dataKey="tasks" fill="hsl(172, 66%, 50%)" radius={[4, 4, 0, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-6 mt-2 justify-center">
                <div className="flex items-center gap-2 text-xs"><div className="w-2.5 h-2.5 rounded bg-nova-purple" />Outreach</div>
                <div className="flex items-center gap-2 text-xs"><div className="w-2.5 h-2.5 rounded bg-nova-teal" />Tasks</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Funnel & Live Activity Feed */}
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div variants={item} className="lg:col-span-2">
          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">Pipeline Funnel</CardTitle>
              <Link href="/dashboard/pipeline"><Button variant="ghost" size="sm" className="gap-1 text-xs">View Pipeline <ArrowRight className="w-3 h-3" /></Button></Link>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={staticChartData.pipelineFunnel} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 20%, 18%)" horizontal={false} />
                  <XAxis type="number" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                  <YAxis type="category" dataKey="stage" stroke="hsl(215, 20%, 55%)" fontSize={11} width={75} />
                  <Tooltip contentStyle={{ background: "hsl(222, 47%, 8%)", border: "1px solid hsl(222, 20%, 18%)", borderRadius: "8px", fontSize: "12px" }} />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={20}>
                    {staticChartData.pipelineFunnel.map((entry, index) => (<Cell key={index} fill={entry.fill} />))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="glass h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">Activity Feed</CardTitle>
              <Badge variant="secondary" className="text-xs">Live</Badge>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[260px] pr-3">
                <div className="space-y-4">
                  {isLoading ? (
                    Array.from({ length: 4 }).map((_, idx) => (
                      <div key={`feed-skeleton-${idx}`} className="flex items-center gap-3 animate-pulse">
                        <div className="w-2 h-2 rounded-full bg-muted mt-2 shrink-0" />
                        <div className="flex-1 space-y-1.5">
                          <div className="h-3.5 bg-muted rounded w-48" />
                          <div className="h-3 bg-muted rounded w-20" />
                        </div>
                      </div>
                    ))
                  ) : activities.length === 0 ? (
                    <div className="text-center text-xs text-muted-foreground py-8">No recent actions logged.</div>
                  ) : (
                    activities.map((act) => (
                      <div key={act.id} className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${activityTypeColors[act.type] || "bg-secondary"}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm">
                            <span className="font-medium">{act.user_name || act.user}</span>{" "}
                            <span className="text-muted-foreground">{act.action}</span>{" "}
                            <span className="font-medium">{act.target}</span>
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" /> {timeAgo(act.created_at || act.time)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Leads Table */}
      <motion.div variants={item}>
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">Recent Leads</CardTitle>
            <Link href="/dashboard/leads"><Button variant="ghost" size="sm" className="gap-1 text-xs">View All <ArrowRight className="w-3 h-3" /></Button></Link>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left py-3 px-2 font-medium">Business</th>
                    <th className="text-left py-3 px-2 font-medium hidden md:table-cell">Category</th>
                    <th className="text-left py-3 px-2 font-medium hidden lg:table-cell">Location</th>
                    <th className="text-left py-3 px-2 font-medium">AI Score</th>
                    <th className="text-left py-3 px-2 font-medium">Status</th>
                    <th className="text-right py-3 px-2 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    Array.from({ length: 3 }).map((_, idx) => (
                      <tr key={`recent-skeleton-${idx}`} className="animate-pulse">
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-muted" />
                            <div className="h-4 w-28 bg-muted rounded" />
                          </div>
                        </td>
                        <td className="py-3 px-2 hidden md:table-cell"><div className="h-5 w-16 bg-muted rounded-full" /></td>
                        <td className="py-3 px-2 hidden lg:table-cell"><div className="h-4 w-20 bg-muted rounded" /></td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-12 bg-muted rounded-full" />
                            <div className="h-3 w-6 bg-muted rounded" />
                          </div>
                        </td>
                        <td className="py-3 px-2"><div className="h-5 w-16 bg-muted rounded-full" /></td>
                        <td className="py-3 px-2 text-right"><div className="h-7 w-7 bg-muted rounded ml-auto" /></td>
                      </tr>
                    ))
                  ) : leads.length === 0 ? (
                    <tr><td colSpan={6} className="text-center text-xs text-muted-foreground py-8">No leads available.</td></tr>
                  ) : (
                    leads.slice(0, 6).map((lead) => (
                      <tr key={lead.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8"><AvatarFallback className="text-[10px] bg-secondary font-semibold">{getInitials(lead.businessName)}</AvatarFallback></Avatar>
                            <div>
                              <p className="font-medium text-sm">{lead.businessName}</p>
                              <p className="text-xs text-muted-foreground">{lead.email || "No email"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-2 hidden md:table-cell"><Badge variant="secondary" className="text-xs">{lead.category}</Badge></td>
                        <td className="py-3 px-2 text-muted-foreground hidden lg:table-cell">{lead.location}</td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <Progress value={lead.aiScore} className="w-16 h-1.5" indicatorClassName={lead.aiScore > 70 ? "bg-emerald-500" : lead.aiScore > 50 ? "bg-amber-500" : "bg-red-500"} />
                            <span className="text-xs font-medium">{lead.aiScore}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <Badge variant={lead.status === "closed" ? "success" : lead.status === "new" ? "info" : "secondary"} className="text-xs capitalize">
                            {lead.status.replace("_", " ")}
                          </Badge>
                        </td>
                        <td className="py-3 px-2 text-right">
                          <Link href="/dashboard/leads">
                            <Button variant="ghost" size="sm" className="h-7 px-2"><Eye className="w-3.5 h-3.5" /></Button>
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
