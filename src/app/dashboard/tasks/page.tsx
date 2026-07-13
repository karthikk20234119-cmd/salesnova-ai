"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  CheckSquare, Circle, Clock, AlertTriangle, Plus, Search,
  Filter, Calendar, Flag, Trash2, CheckCircle2,
  Loader2, AlertCircle, FileText, Check, Bell, MoreHorizontal
} from "lucide-react";
import { toast } from "sonner";
import { getTasks, updateTask, deleteTask, getTeamMembers, createTask } from "@/lib/data-service";
import { getInitials, timeAgo } from "@/lib/utils";
import { useDebounce } from "@/lib/hooks/use-debounce";
import type { Task } from "@/types";

const priorityConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  urgent: { color: "destructive", icon: <AlertTriangle className="w-3 h-3" />, label: "Urgent" },
  high: { color: "warning", icon: <Flag className="w-3 h-3" />, label: "High" },
  medium: { color: "info", icon: <Flag className="w-3 h-3" />, label: "Medium" },
  low: { color: "secondary", icon: <Flag className="w-3 h-3" />, label: "Low" },
};

const statusConfig: Record<string, { icon: React.ReactNode; label: string }> = {
  todo: { icon: <Circle className="w-4 h-4 text-muted-foreground" />, label: "To Do" },
  in_progress: { icon: <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />, label: "In Progress" },
  done: { icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />, label: "Done" },
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Create Task dialog state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    priority: "medium" as Task["priority"],
    type: "outreach" as Task["type"],
    dueDate: "",
    assignedTo: "",
  });

  const team = getTeamMembers();

  function getTeamMemberName(id: string): string {
    return team.find((m) => m.id === id)?.name || "Unassigned";
  }

  function isOverdue(task: Task): boolean {
    return task.status !== "done" && new Date(task.dueDate) < new Date();
  }

  // Load tasks on mount
  useEffect(() => {
    async function loadTasks() {
      setIsLoading(true);
      setError("");
      try {
        const fetchedTasks = await getTasks();
        setTasks(fetchedTasks);
      } catch (err: any) {
        console.error("Failed to fetch tasks", err);
        setError("Unable to load tasks. Please refresh the page.");
      } finally {
        setIsLoading(false);
      }
    }
    loadTasks();
  }, []);

  const toggleStatus = async (taskId: string, currentStatus: Task["status"]) => {
    const nextStatusMap: Record<Task["status"], Task["status"]> = {
      todo: "in_progress",
      in_progress: "done",
      done: "todo",
    };
    const nextStatus = nextStatusMap[currentStatus];

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: nextStatus } : t))
    );

    try {
      const ok = await updateTask(taskId, { status: nextStatus });
      if (!ok) {
        throw new Error("Failed to persist status update");
      }
    } catch (err) {
      console.error(err);
      // Revert status on failure
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: currentStatus } : t))
      );
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      const ok = await deleteTask(id);
      if (ok) {
        setTasks((prev) => prev.filter((t) => t.id !== id));
      }
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValues.title) {
      toast.error("Task title is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: Partial<Task> = {
        title: formValues.title,
        description: formValues.description,
        priority: formValues.priority,
        type: formValues.type,
        dueDate: formValues.dueDate ? new Date(formValues.dueDate) : new Date(Date.now() + 86400000), // Default 1 day
        assignedTo: formValues.assignedTo || "member-1",
        status: "todo",
      };

      const result = await createTask(payload);
      if (result) {
        setTasks((prev) => [result, ...prev]);
        setIsCreateOpen(false);
        // Reset form
        setFormValues({
          title: "",
          description: "",
          priority: "medium",
          type: "outreach",
          dueDate: "",
          assignedTo: "",
        });
        toast.success("Task created successfully");
      } else {
        throw new Error("Failed to create task log");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save task. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const filtered = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
      
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "overdue") return matchesSearch && isOverdue(task);
    return matchesSearch && task.status === activeTab;
  });

  const stats = [
    { title: "Total Tasks", value: tasks.length, icon: CheckSquare, color: "text-purple-400", bg: "bg-purple-500/10" },
    { title: "In Progress", value: tasks.filter((t) => t.status === "in_progress").length, icon: Loader2, color: "text-blue-400", bg: "bg-blue-500/10" },
    { title: "Overdue", value: tasks.filter((t) => isOverdue(t)).length, icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10" },
    { title: "Completed", value: tasks.filter((t) => t.status === "done").length, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Task Management</h1>
          <p className="text-muted-foreground mt-1">
            {isLoading ? "Loading..." : `${tasks.length} tasks · ${tasks.filter((t) => t.status === "done").length} completed`}
          </p>
        </div>
        <Button variant="gradient" size="sm" className="gap-2 self-start" onClick={() => setIsCreateOpen(true)}>
          <Plus className="w-4 h-4" /> New Task
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.title} className="glass">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${s.bg}`}>
                <s.icon className={`w-5 h-5 ${s.color} ${s.icon === Loader2 && tasks.filter((t) => t.status === "in_progress").length > 0 ? "animate-spin" : ""}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="glass">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="pl-10 bg-secondary/50"
              />
            </div>
            <Button variant="outline" className="gap-2 shrink-0">
              <Filter className="w-4 h-4" /> Filters
            </Button>
          </div>
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {["all", "todo", "in_progress", "done", "overdue"].map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "ghost"}
                size="sm"
                className="text-xs capitalize shrink-0"
                onClick={() => setActiveTab(tab)}
              >
                {tab === "in_progress" ? "In Progress" : tab}
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

      {/* Task List */}
      <Card className="glass overflow-hidden">
        <div className="divide-y divide-border/50">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <div key={`task-skeleton-${idx}`} className="flex items-center gap-4 p-4 animate-pulse">
                  <div className="w-4 h-4 bg-muted rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="flex gap-2">
                      <div className="h-4 w-40 bg-muted rounded" />
                      <div className="h-4 w-12 bg-muted rounded-full" />
                    </div>
                    <div className="h-3 w-64 bg-muted rounded" />
                  </div>
                  <div className="h-7 w-20 bg-muted rounded-full shrink-0 hidden sm:flex" />
                  <div className="h-4 w-16 bg-muted rounded shrink-0 hidden md:flex" />
                  <div className="h-7 w-7 bg-muted rounded shrink-0" />
                </div>
              ))
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                <CheckSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="text-base font-medium">No tasks found</p>
                <p className="text-xs text-muted-foreground mt-1">Great job! All your follow-ups are up to date.</p>
              </div>
            ) : (
              filtered.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-4 p-4 hover:bg-secondary/20 transition-colors group"
                >
                  {/* Status toggle */}
                  <button
                    onClick={() => toggleStatus(task.id, task.status)}
                    className="shrink-0 hover:scale-110 transition-transform focus:outline-none"
                  >
                    {statusConfig[task.status]?.icon}
                  </button>

                  {/* Task info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`text-sm font-medium ${task.status === "done" ? "line-through text-muted-foreground" : ""}`}>
                        {task.title}
                      </p>
                      <Badge
                        variant={priorityConfig[task.priority]?.color as any}
                        className="text-[10px] gap-1"
                      >
                        {priorityConfig[task.priority]?.icon}
                        {priorityConfig[task.priority]?.label}
                      </Badge>
                      <Badge variant="secondary" className="text-[10px] capitalize">
                        {task.type.replace("_", " ")}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{task.description}</p>
                  </div>

                  {/* Assignee */}
                  <div className="hidden sm:flex items-center gap-2 shrink-0">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="text-[9px] bg-secondary font-semibold">
                        {getInitials(getTeamMemberName(task.assignedTo))}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground hidden lg:inline">
                      {getTeamMemberName(task.assignedTo)}
                    </span>
                  </div>

                  {/* Due date */}
                  <div className={`hidden md:flex items-center gap-1.5 text-xs shrink-0 ${
                    isOverdue(task) ? "text-red-400" : "text-muted-foreground"
                  }`}>
                    <Calendar className="w-3 h-3" />
                    {isOverdue(task) ? "Overdue" : timeAgo(task.dueDate).replace(" ago", "")}
                  </div>

                  {/* Actions */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/10 shrink-0"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </Card>

      {/* Create Task Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[500px] glass border-border p-0 overflow-hidden">
          <div className="p-6 pb-4 border-b border-border bg-card/50">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Schedule New Task
              </DialogTitle>
            </DialogHeader>
          </div>
          <form onSubmit={handleCreateTask} className="p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Task Title *</label>
              <Input
                required
                placeholder="e.g. Schedule redesign review call"
                value={formValues.title}
                onChange={(e) => setFormValues({ ...formValues, title: e.target.value })}
                className="bg-secondary/50 border border-border"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Description / Context</label>
              <textarea
                placeholder="Details of what needs to be done..."
                value={formValues.description}
                onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
                className="w-full h-20 bg-secondary/50 border border-border rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Priority</label>
                <select
                  value={formValues.priority}
                  onChange={(e) => setFormValues({ ...formValues, priority: e.target.value as any })}
                  className="w-full h-[40px] bg-secondary/50 border border-border rounded-md px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Task Category</label>
                <select
                  value={formValues.type}
                  onChange={(e) => setFormValues({ ...formValues, type: e.target.value as any })}
                  className="w-full h-[40px] bg-secondary/50 border border-border rounded-md px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="outreach">Outreach Campaign</option>
                  <option value="lead_scraping">Lead Scraping</option>
                  <option value="meeting">Discovery Meeting</option>
                  <option value="follow_up">Follow Up</option>
                  <option value="proposal">Draft Proposal</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground" /> Due Date
                </label>
                <Input
                  type="date"
                  value={formValues.dueDate}
                  onChange={(e) => setFormValues({ ...formValues, dueDate: e.target.value })}
                  className="bg-secondary/50 border border-border text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Assignee</label>
                <select
                  value={formValues.assignedTo}
                  onChange={(e) => setFormValues({ ...formValues, assignedTo: e.target.value })}
                  className="w-full h-[40px] bg-secondary/50 border border-border rounded-md px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">Assign to...</option>
                  {team.map((member) => (
                    <option key={member.id} value={member.id}>{member.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-4 -mx-6 -mb-6 bg-secondary/20 border-t border-border flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" variant="gradient" disabled={isSubmitting} className="gap-2">
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                Save Task
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
