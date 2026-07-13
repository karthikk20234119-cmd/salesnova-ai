"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Users, UserPlus, Award, TrendingUp, Send, Target,
  CheckSquare, Mail, MoreHorizontal,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { mockTeam } from "@/lib/mock-data";
import { getInitials } from "@/lib/utils";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const statusColors: Record<string, string> = {
  active: "bg-emerald-500",
  away: "bg-amber-500",
  offline: "bg-gray-500",
};

const roleColors: Record<string, string> = {
  admin: "text-purple-400",
  sales_manager: "text-cyan-400",
  outreach_agent: "text-emerald-400",
  designer: "text-pink-400",
  developer: "text-blue-400",
};

const teamChartData = mockTeam.map((m) => ({
  name: m.name.split(" ")[0],
  outreach: m.outreachSent,
  tasks: m.tasksCompleted,
  conversion: m.conversionRate,
}));

const tooltipStyle = {
  background: "hsl(222, 47%, 8%)",
  border: "1px solid hsl(222, 20%, 18%)",
  borderRadius: "8px",
  fontSize: "12px",
};

export default function TeamPage() {
  const activeCount = mockTeam.filter((m) => m.status === "active").length;
  const totalOutreach = mockTeam.reduce((s, m) => s + m.outreachSent, 0);
  const totalTasks = mockTeam.reduce((s, m) => s + m.tasksCompleted, 0);
  const avgConversion = (mockTeam.reduce((s, m) => s + m.conversionRate, 0) / mockTeam.length).toFixed(1);

  const stats = [
    { title: "Team Members", value: mockTeam.length, icon: Users, color: "text-purple-400", bg: "bg-purple-500/10" },
    { title: "Active Now", value: activeCount, icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { title: "Tasks Done", value: totalTasks, icon: CheckSquare, color: "text-cyan-400", bg: "bg-cyan-500/10" },
    { title: "Avg Conversion", value: `${avgConversion}%`, icon: Award, color: "text-amber-400", bg: "bg-amber-500/10" },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Team Management</h1>
          <p className="text-muted-foreground mt-1">{mockTeam.length} members · {activeCount} active</p>
        </div>
        <Button variant="gradient" size="sm" className="gap-2 self-start">
          <UserPlus className="w-4 h-4" /> Invite Member
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.title} className="glass">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${s.bg}`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Team Cards */}
      <motion.div variants={item} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockTeam.map((member) => (
          <Card key={member.id} className="glass glass-hover group">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12 border-2 border-primary/20">
                      <AvatarFallback className="gradient-primary text-white text-sm font-bold">{getInitials(member.name)}</AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-card ${statusColors[member.status]}`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{member.name}</p>
                    <p className={`text-xs font-medium capitalize ${roleColors[member.role]}`}>{member.role.replace("_", " ")}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100">
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </Button>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Mail className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground truncate">{member.email}</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground flex items-center gap-1"><Send className="w-3 h-3" /> Outreach</span>
                  <span className="font-semibold">{member.outreachSent}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground flex items-center gap-1"><Users className="w-3 h-3" /> Leads</span>
                  <span className="font-semibold">{member.leadsAssigned}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground flex items-center gap-1"><CheckSquare className="w-3 h-3" /> Tasks</span>
                  <span className="font-semibold">{member.tasksCompleted}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground flex items-center gap-1"><Target className="w-3 h-3" /> Conversion</span>
                  <span className="font-bold text-emerald-400">{member.conversionRate}%</span>
                </div>
                <Progress value={member.conversionRate * 3} className="h-1.5" indicatorClassName="bg-emerald-500" />
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Performance Chart */}
      <motion.div variants={item}>
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">Team Performance Comparison</CardTitle>
            <Badge variant="secondary" className="text-xs">All time</Badge>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={teamChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 20%, 18%)" />
                <XAxis dataKey="name" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="outreach" name="Outreach Sent" fill="hsl(262, 83%, 58%)" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="tasks" name="Tasks Done" fill="hsl(172, 66%, 50%)" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-6 mt-2 justify-center">
              <div className="flex items-center gap-2 text-xs"><div className="w-3 h-1 rounded bg-nova-purple" />Outreach</div>
              <div className="flex items-center gap-2 text-xs"><div className="w-3 h-1 rounded bg-nova-teal" />Tasks</div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
