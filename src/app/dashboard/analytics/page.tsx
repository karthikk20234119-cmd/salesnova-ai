"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Send, MessageSquare, Target, DollarSign, TrendingUp, TrendingDown,
  BarChart3, Users, ArrowUpRight,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
} from "recharts";
import { chartData, mockTeam } from "@/lib/mock-data";
import { getInitials } from "@/lib/utils";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const kpis = [
  { title: "Total Outreach", value: "1,248", change: "+12.5%", up: true, icon: Send, color: "text-purple-400", bg: "bg-purple-500/10" },
  { title: "Reply Rate", value: "24.8%", change: "+4.2%", up: true, icon: MessageSquare, color: "text-cyan-400", bg: "bg-cyan-500/10" },
  { title: "Conversions", value: "86", change: "+18.1%", up: true, icon: Target, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { title: "Revenue", value: "₹18.6L", change: "+22.4%", up: true, icon: DollarSign, color: "text-amber-400", bg: "bg-amber-500/10" },
];

const responseRateTrend = [
  { week: "W1", rate: 18 }, { week: "W2", rate: 21 }, { week: "W3", rate: 19 },
  { week: "W4", rate: 24 }, { week: "W5", rate: 26 }, { week: "W6", rate: 23 },
  { week: "W7", rate: 28 }, { week: "W8", rate: 25 },
];

const channelBreakdown = [
  { name: "WhatsApp", value: 45, fill: "#22c55e" },
  { name: "Email", value: 30, fill: "#3b82f6" },
  { name: "Instagram", value: 18, fill: "#ec4899" },
  { name: "LinkedIn", value: 7, fill: "#6366f1" },
];

const tooltipStyle = {
  background: "hsl(222, 47%, 8%)",
  border: "1px solid hsl(222, 20%, 18%)",
  borderRadius: "8px",
  fontSize: "12px",
};

export default function AnalyticsPage() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-1">Performance metrics and insights</p>
        </div>
        <Badge variant="secondary" className="text-xs gap-1 self-start">
          <BarChart3 className="w-3 h-3" /> Last 30 days
        </Badge>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="glass glass-hover group cursor-pointer">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${kpi.bg}`}>
                  <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${kpi.up ? "text-emerald-400" : "text-red-400"}`}>
                  {kpi.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {kpi.change}
                </div>
              </div>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{kpi.title}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div variants={item} className="lg:col-span-2">
          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">Outreach Performance</CardTitle>
              <Badge variant="secondary" className="text-xs">6 months</Badge>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData.outreachTrend}>
                  <defs>
                    <linearGradient id="analyticsGradSent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="analyticsGradReplied" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(172, 66%, 50%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(172, 66%, 50%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 20%, 18%)" />
                  <XAxis dataKey="month" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                  <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="sent" stroke="hsl(262, 83%, 58%)" fill="url(#analyticsGradSent)" strokeWidth={2} />
                  <Area type="monotone" dataKey="replied" stroke="hsl(172, 66%, 50%)" fill="url(#analyticsGradReplied)" strokeWidth={2} />
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
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Channel Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={channelBreakdown} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={4} stroke="none">
                    {channelBreakdown.map((entry, index) => (<Cell key={index} fill={entry.fill} />))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {channelBreakdown.map((c) => (
                  <div key={c.name} className="flex items-center gap-2 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.fill }} />
                    <span className="text-muted-foreground">{c.name}</span>
                    <span className="ml-auto font-medium">{c.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div variants={item}>
          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">Weekly Activity</CardTitle>
              <Badge variant="secondary" className="text-xs">This week</Badge>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData.weeklyActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 20%, 18%)" />
                  <XAxis dataKey="day" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                  <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="outreach" fill="hsl(262, 83%, 58%)" radius={[4, 4, 0, 0]} barSize={16} />
                  <Bar dataKey="tasks" fill="hsl(172, 66%, 50%)" radius={[4, 4, 0, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-6 mt-2 justify-center">
                <div className="flex items-center gap-2 text-xs"><div className="w-3 h-1 rounded bg-nova-purple" />Outreach</div>
                <div className="flex items-center gap-2 text-xs"><div className="w-3 h-1 rounded bg-nova-teal" />Tasks</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">Response Rate Trend</CardTitle>
              <Badge variant="success" className="text-xs gap-1"><ArrowUpRight className="w-3 h-3" />+4.2%</Badge>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={responseRateTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 20%, 18%)" />
                  <XAxis dataKey="week" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                  <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} unit="%" />
                  <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [`${value}%`, "Response Rate"]} />
                  <Line type="monotone" dataKey="rate" stroke="hsl(172, 66%, 50%)" strokeWidth={2.5} dot={{ fill: "hsl(172, 66%, 50%)", r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Conversion Funnel + Team Leaderboard */}
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div variants={item} className="lg:col-span-2">
          <Card className="glass">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Conversion Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData.pipelineFunnel} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 20%, 18%)" horizontal={false} />
                  <XAxis type="number" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                  <YAxis type="category" dataKey="stage" stroke="hsl(215, 20%, 55%)" fontSize={11} width={75} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={20}>
                    {chartData.pipelineFunnel.map((entry, index) => (<Cell key={index} fill={entry.fill} />))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="glass h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">Top Performers</CardTitle>
              <Badge variant="secondary" className="text-xs"><Users className="w-3 h-3 mr-1" />{mockTeam.length}</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTeam
                  .sort((a, b) => b.conversionRate - a.conversionRate)
                  .map((member, i) => (
                    <div key={member.id} className="flex items-center gap-3">
                      <span className={`text-xs font-bold w-5 text-center ${i === 0 ? "text-amber-400" : i === 1 ? "text-gray-400" : i === 2 ? "text-amber-600" : "text-muted-foreground"}`}>
                        #{i + 1}
                      </span>
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-[10px] gradient-primary text-white">{getInitials(member.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{member.name}</p>
                        <p className="text-[11px] text-muted-foreground capitalize">{member.role.replace("_", " ")}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-emerald-400">{member.conversionRate}%</p>
                        <p className="text-[10px] text-muted-foreground">{member.outreachSent} sent</p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
