"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Search, Filter, Download, Plus, Star, MapPin, Globe, MessageSquare,
  Sparkles, Loader2, AlertCircle, Phone, Mail, Building, Trash2,
  Instagram, Facebook, Linkedin, ArrowUpDown, Eye
} from "lucide-react";
import { toast } from "sonner";
import { getLeads, deleteLead, createLead } from "@/lib/data-service";
import { getInitials, generateWhatsAppLink } from "@/lib/utils";
import { useDebounce } from "@/lib/hooks/use-debounce";
import type { Lead } from "@/types";

const sourceIcons: Record<string, React.ReactNode> = {
  google_maps: <MapPin className="w-3 h-3" />,
  instagram: <Instagram className="w-3 h-3" />,
  facebook: <Facebook className="w-3 h-3" />,
  linkedin: <Linkedin className="w-3 h-3" />,
  website: <Globe className="w-3 h-3" />,
  justdial: <Star className="w-3 h-3" />,
  indiamart: <Globe className="w-3 h-3" />,
  referral: <MessageSquare className="w-3 h-3" />
};

const statusColors: Record<string, string> = {
  new: "info",
  ai_analyzed: "purple",
  contacted: "secondary",
  follow_up: "warning",
  interested: "success",
  proposal_sent: "info",
  meeting_scheduled: "purple",
  closed: "success",
  rejected: "destructive"
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [activeTab, setActiveTab] = useState("all");
  const [sortField, setSortField] = useState<keyof Lead>("aiScore");
  const [sortAsc, setSortAsc] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, activeTab, sortField, sortAsc]);

  // Lead composer state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Lead Detail state
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [formValues, setFormValues] = useState({
    businessName: "",
    category: "",
    phone: "",
    whatsapp: "",
    email: "",
    website: "",
    location: "",
    description: "",
    rating: "4.0",
    reviewsCount: "25",
    source: "website" as Lead["source"],
  });

  // Fetch leads on mount
  useEffect(() => {
    async function loadLeads() {
      setIsLoading(true);
      setError("");
      try {
        const fetchedLeads = await getLeads();
        setLeads(fetchedLeads);
      } catch (err: any) {
        console.error("Failed to load leads", err);
        setError("Could not retrieve leads. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
    loadLeads();
  }, []);

  const handleSort = (field: keyof Lead) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const sortedLeads = [...leads].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    if (valA === undefined) return 1;
    if (valB === undefined) return -1;

    if (typeof valA === "string" && typeof valB === "string") {
      return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    
    return sortAsc 
      ? (valA > valB ? 1 : -1)
      : (valA < valB ? 1 : -1);
  });

  const filtered = sortedLeads.filter((lead) => {
    const matchesSearch =
      lead.businessName.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      lead.category.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      lead.location.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
      
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && lead.status === activeTab;
  });
  
  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginatedLeads = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this lead?")) {
      const ok = await deleteLead(id);
      if (ok) {
        setLeads((prev) => prev.filter((l) => l.id !== id));
      }
    }
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValues.businessName || !formValues.category) {
      toast.error("Business Name and Category are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: Partial<Lead> = {
        businessName: formValues.businessName,
        category: formValues.category,
        phone: formValues.phone,
        whatsapp: formValues.whatsapp || formValues.phone,
        email: formValues.email,
        website: formValues.website,
        location: formValues.location,
        description: formValues.description,
        rating: parseFloat(formValues.rating) || 4.0,
        reviewsCount: parseInt(formValues.reviewsCount) || 10,
        source: formValues.source,
        status: "new",
        aiScore: Math.floor(65 + Math.random() * 30), // Smart fallback score
      };

      const result = await createLead(payload);
      if (result) {
        setLeads((prev) => [result, ...prev]);
        setIsCreateOpen(false);
        // Reset form
        setFormValues({
          businessName: "",
          category: "",
          phone: "",
          whatsapp: "",
          email: "",
          website: "",
          location: "",
          description: "",
          rating: "4.5",
          reviewsCount: "32",
          source: "website",
        });
        toast.success("Lead created successfully");
      } else {
        throw new Error("Unable to save lead record");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save lead. Please check process logs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportCSV = () => {
    if (leads.length === 0) {
      toast.error("No leads available to export.");
      return;
    }
    const headers = ["Business Name", "Category", "Phone", "Email", "Website", "Location", "Rating", "Source", "Status", "AI Score"];
    const rows = leads.map(l => [
      `"${l.businessName.replace(/"/g, '""')}"`,
      `"${l.category.replace(/"/g, '""')}"`,
      `"${(l.phone || "").replace(/"/g, '""')}"`,
      `"${(l.email || "").replace(/"/g, '""')}"`,
      `"${(l.website || "").replace(/"/g, '""')}"`,
      `"${(l.location || "").replace(/"/g, '""')}"`,
      l.rating,
      l.source,
      l.status,
      l.aiScore
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `salesnova_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Lead Management</h1>
          <p className="text-muted-foreground mt-1">
            {isLoading ? "Loading leads..." : `${leads.length} total leads found`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={handleExportCSV}>
            <Download className="w-4 h-4" /> Export
          </Button>
          <Button variant="gradient" size="sm" className="gap-2" onClick={() => setIsCreateOpen(true)}>
            <Plus className="w-4 h-4" /> New Lead
          </Button>
        </div>
      </div>

      <Card className="glass">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search leads..."
                className="pl-10 bg-secondary/50"
              />
            </div>
            <Button variant="outline" className="gap-2 shrink-0">
              <Filter className="w-4 h-4" /> Filters
            </Button>
          </div>
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {["all", "new", "ai_analyzed", "contacted", "interested", "closed"].map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "ghost"}
                size="sm"
                className="text-xs capitalize shrink-0"
                onClick={() => setActiveTab(tab)}
              >
                {tab.replace("_", " ")}
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

      <Card className="glass">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground bg-secondary/20 select-none">
                  <th className="text-left py-3 px-4 font-medium cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort("businessName")}>
                    <div className="flex items-center gap-1">Business {sortField === "businessName" && <ArrowUpDown className="w-3.5 h-3.5" />}</div>
                  </th>
                  <th className="text-left py-3 px-4 font-medium hidden md:table-cell cursor-pointer hover:text-foreground" onClick={() => handleSort("category")}>
                    <div className="flex items-center gap-1">Category {sortField === "category" && <ArrowUpDown className="w-3.5 h-3.5" />}</div>
                  </th>
                  <th className="text-left py-3 px-4 font-medium hidden lg:table-cell">Location</th>
                  <th className="text-left py-3 px-4 font-medium hidden xl:table-cell cursor-pointer hover:text-foreground" onClick={() => handleSort("rating")}>
                    <div className="flex items-center gap-1">Rating {sortField === "rating" && <ArrowUpDown className="w-3.5 h-3.5" />}</div>
                  </th>
                  <th className="text-left py-3 px-4 font-medium cursor-pointer hover:text-foreground" onClick={() => handleSort("aiScore")}>
                    <div className="flex items-center gap-1">AI Score {sortField === "aiScore" && <ArrowUpDown className="w-3.5 h-3.5" />}</div>
                  </th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium hidden sm:table-cell">Source</th>
                  <th className="text-right py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, idx) => (
                      <tr key={`skeleton-${idx}`} className="border-b border-border/30 animate-pulse">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-muted shrink-0" />
                            <div className="space-y-2">
                              <div className="h-4 w-32 bg-muted rounded" />
                              <div className="h-3 w-20 bg-muted rounded" />
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 hidden md:table-cell"><div className="h-5 w-16 bg-muted rounded-full" /></td>
                        <td className="py-4 px-4 hidden lg:table-cell"><div className="h-4 w-24 bg-muted rounded" /></td>
                        <td className="py-4 px-4 hidden xl:table-cell"><div className="h-4 w-12 bg-muted rounded" /></td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-16 bg-muted rounded-full" />
                            <div className="h-3 w-6 bg-muted rounded" />
                          </div>
                        </td>
                        <td className="py-4 px-4"><div className="h-5 w-20 bg-muted rounded-full" /></td>
                        <td className="py-4 px-4 hidden sm:table-cell"><div className="h-4 w-16 bg-muted rounded" /></td>
                        <td className="py-4 px-4 text-right"><div className="h-8 w-24 bg-muted rounded-lg ml-auto" /></td>
                      </tr>
                    ))
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-muted-foreground">
                        <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p className="text-base font-medium">No leads found</p>
                        <p className="text-xs text-muted-foreground mt-1">Try resetting filters or typing a different search query.</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedLeads.map((lead) => (
                      <motion.tr
                        key={lead.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="border-b border-border/30 hover:bg-secondary/20 transition-colors group"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback className="text-[10px] bg-secondary font-semibold">
                                {getInitials(lead.businessName)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{lead.businessName}</p>
                              <span className="text-xs text-muted-foreground">{lead.phone || "No phone"}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 hidden md:table-cell">
                          <Badge variant="secondary" className="text-xs">{lead.category}</Badge>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground hidden lg:table-cell">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {lead.location || "N/A"}
                          </div>
                        </td>
                        <td className="py-3 px-4 hidden xl:table-cell">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            <span>{lead.rating}</span>
                            <span className="text-xs text-muted-foreground">({lead.reviewsCount})</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Progress
                              value={lead.aiScore}
                              className="w-16 h-1.5"
                              indicatorClassName={
                                lead.aiScore > 70 ? "bg-emerald-500" : lead.aiScore > 50 ? "bg-amber-500" : "bg-red-500"
                              }
                            />
                            <span className={`text-xs font-bold ${
                              lead.aiScore > 70 ? "text-emerald-400" : lead.aiScore > 50 ? "text-amber-400" : "text-red-400"
                            }`}>{lead.aiScore}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={statusColors[lead.status] as any || "secondary"} className="text-xs capitalize">
                            {lead.status.replace("_", " ")}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 hidden sm:table-cell">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            {sourceIcons[lead.source] || <Globe className="w-3 h-3" />}
                            <span className="text-xs capitalize">{lead.source.replace("_", " ")}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 opacity-0 group-hover:opacity-100"
                              onClick={() => { setSelectedLead(lead); setIsDetailOpen(true); }}
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100">
                              <Sparkles className="w-3.5 h-3.5" />
                            </Button>
                            {lead.whatsapp && (
                              <a
                                href={generateWhatsAppLink(lead.whatsapp, `Hi! I noticed ${lead.businessName} on Google Maps...`)}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 text-emerald-400">
                                  <MessageSquare className="w-3.5 h-3.5" />
                                </Button>
                              </a>
                            )}
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100" onClick={() => handleDelete(lead.id)}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          {!isLoading && filtered.length > 0 && (
            <div className="flex items-center justify-between p-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Showing {Math.min((currentPage - 1) * rowsPerPage + 1, filtered.length)} to {Math.min(currentPage * rowsPerPage, filtered.length)} of {filtered.length} leads
              </p>
              <div className="flex gap-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} 
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} 
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Lead Modal Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[550px] glass border-border p-0 overflow-hidden">
          <div className="p-6 pb-4 border-b border-border bg-card/50">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Building className="w-5 h-5 text-primary" />
                Add New Lead Record
              </DialogTitle>
            </DialogHeader>
          </div>
          <form onSubmit={handleCreateLead} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Business Name *</label>
                <Input
                  required
                  placeholder="e.g. SalesNova Inc"
                  value={formValues.businessName}
                  onChange={(e) => setFormValues({ ...formValues, businessName: e.target.value })}
                  className="bg-secondary/50 border border-border"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Category *</label>
                <Input
                  required
                  placeholder="e.g. Digital Marketing"
                  value={formValues.category}
                  onChange={(e) => setFormValues({ ...formValues, category: e.target.value })}
                  className="bg-secondary/50 border border-border"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-muted-foreground" /> Contact Phone
                </label>
                <Input
                  placeholder="e.g. +919876543210"
                  value={formValues.phone}
                  onChange={(e) => setFormValues({ ...formValues, phone: e.target.value })}
                  className="bg-secondary/50 border border-border"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-muted-foreground" /> Email Address
                </label>
                <Input
                  type="email"
                  placeholder="e.g. info@business.com"
                  value={formValues.email}
                  onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
                  className="bg-secondary/50 border border-border"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-muted-foreground" /> Website URL
                </label>
                <Input
                  placeholder="e.g. https://domain.com"
                  value={formValues.website}
                  onChange={(e) => setFormValues({ ...formValues, website: e.target.value })}
                  className="bg-secondary/50 border border-border"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground" /> Business Location
                </label>
                <Input
                  placeholder="e.g. Bangalore, IN"
                  value={formValues.location}
                  onChange={(e) => setFormValues({ ...formValues, location: e.target.value })}
                  className="bg-secondary/50 border border-border"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Rating</label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formValues.rating}
                  onChange={(e) => setFormValues({ ...formValues, rating: e.target.value })}
                  className="bg-secondary/50 border border-border"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Review Count</label>
                <Input
                  type="number"
                  min="0"
                  value={formValues.reviewsCount}
                  onChange={(e) => setFormValues({ ...formValues, reviewsCount: e.target.value })}
                  className="bg-secondary/50 border border-border"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Lead Source</label>
                <select
                  value={formValues.source}
                  onChange={(e) => setFormValues({ ...formValues, source: e.target.value as any })}
                  className="w-full h-[40px] bg-secondary/50 border border-border rounded-md px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="website">Website</option>
                  <option value="google_maps">Google Maps</option>
                  <option value="instagram">Instagram</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="facebook">Facebook</option>
                  <option value="justdial">Justdial</option>
                  <option value="referral">Referral</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Internal Notes / Description</label>
              <textarea
                placeholder="Type lead description or additional context here..."
                value={formValues.description}
                onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
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
                Save Lead
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {/* Lead Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[600px] glass border-border p-0 overflow-hidden">
          {selectedLead && (
            <>
              <div className="p-6 pb-4 border-b border-border bg-card/50 flex justify-between items-start">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3 text-xl">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {getInitials(selectedLead.businessName)}
                      </AvatarFallback>
                    </Avatar>
                    {selectedLead.businessName}
                  </DialogTitle>
                </DialogHeader>
                <Badge variant={statusColors[selectedLead.status] as any || "secondary"} className="capitalize">
                  {selectedLead.status.replace("_", " ")}
                </Badge>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Category</p>
                    <p className="font-medium">{selectedLead.category}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="font-medium flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                      {selectedLead.location || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                      {selectedLead.email || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-medium flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                      {selectedLead.phone || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Website</p>
                    <p className="font-medium flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                      {selectedLead.website || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">AI Score</p>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={selectedLead.aiScore}
                        className="w-24 h-2"
                        indicatorClassName={
                          selectedLead.aiScore > 70 ? "bg-emerald-500" : selectedLead.aiScore > 50 ? "bg-amber-500" : "bg-red-500"
                        }
                      />
                      <span className="font-bold">{selectedLead.aiScore}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-border">
                  <p className="text-sm font-semibold">Notes & Description</p>
                  <p className="text-sm text-muted-foreground bg-secondary/30 p-3 rounded-md min-h-[80px]">
                    {selectedLead.description || "No notes available for this lead."}
                  </p>
                </div>
              </div>
              <div className="p-4 bg-secondary/20 border-t border-border flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDetailOpen(false)}>Close</Button>
                {selectedLead.whatsapp && (
                  <Button variant="gradient" className="gap-2" asChild>
                    <a href={generateWhatsAppLink(selectedLead.whatsapp, `Hi! I noticed ${selectedLead.businessName}...`)} target="_blank" rel="noopener noreferrer">
                      <MessageSquare className="w-4 h-4" /> Message
                    </a>
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
