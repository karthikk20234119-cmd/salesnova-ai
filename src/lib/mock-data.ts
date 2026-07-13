import { Lead, PipelineStage, Task, TeamMember, OutreachMessage, Artifact, ChatMessage } from "@/types";

const categories = ["Restaurant", "Salon & Spa", "Dental Clinic", "Gym & Fitness", "Real Estate", "Hotel", "Education", "E-Commerce", "Healthcare", "Law Firm", "Photography Studio", "Interior Design", "Auto Workshop", "Boutique", "Café"];
const locations = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune", "Kolkata", "Ahmedabad", "Jaipur", "Lucknow", "Kochi", "Chandigarh", "Indore", "Coimbatore", "Goa"];
const sources: Lead["source"][] = ["google_maps", "instagram", "facebook", "linkedin", "justdial", "indiamart", "website", "referral"];
const statuses: Lead["status"][] = ["new", "ai_analyzed", "contacted", "follow_up", "interested", "proposal_sent", "meeting_scheduled", "closed", "rejected"];
const tags = ["high-value", "quick-win", "needs-redesign", "active-social", "no-website", "poor-seo", "high-traffic", "premium", "local-chain", "franchise"];

const businessNames = [
  "Spice Garden Restaurant", "Glamour Beauty Lounge", "SmileCare Dental", "FitZone Gym", "Urban Nest Realty",
  "Taj Heritage Hotel", "BrightMinds Academy", "StyleVault Fashion", "MediPlus Clinic", "LegalEase Associates",
  "PixelPerfect Studios", "DreamSpace Interiors", "AutoPro Workshop", "Ethnic Threads Boutique", "BrewHaven Café",
  "Royal Biryani House", "Aura Wellness Spa", "PearlDent Orthodontics", "CrossFit Arena", "SkyView Properties",
  "Sunrise Inn", "CodeNest Institute", "TrendSetters Online", "LifeCare Hospital", "Justice & Co Lawyers",
  "LensCraft Photography", "Elegance Décor Studio", "SpeedWheels Garage", "Silk Route Fashions", "Mocha Point Coffee",
  "Curry Kingdom", "Serenity Spa & Salon", "OralCare Plus", "IronWorks Fitness", "GreenField Realtors",
  "The Grand Plaza", "SkillUp Academy", "CartBazaar Store", "Wellness360 Center", "Advocate Sharma & Sons",
  "SnapShot Studios", "ArtVista Interiors", "TurboFix Motors", "Vogue Closet", "Bean There Café",
  "Naan & Curry Hub", "Bliss Beauty Bar", "DentAlign Studio", "PowerHouse Gym", "PrimeLocation Realty",
  "Comfort Stay Suites", "LearnPro Education", "ShopEasy Online", "HealWell Diagnostics", "LawPoint Associates"
];

function randomDate(daysBack: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * daysBack));
  return d;
}

function randomPhone(): string {
  return `+91${Math.floor(7000000000 + Math.random() * 2999999999)}`;
}

export const mockLeads: Lead[] = businessNames.map((name, i) => ({
  id: `lead-${i + 1}`,
  businessName: name,
  category: categories[i % categories.length],
  phone: randomPhone(),
  whatsapp: randomPhone(),
  email: `info@${name.toLowerCase().replace(/[^a-z]/g, "")}.com`,
  website: `https://${name.toLowerCase().replace(/[^a-z]/g, "")}.com`,
  location: locations[i % locations.length],
  rating: +(3 + Math.random() * 2).toFixed(1),
  reviewsCount: Math.floor(10 + Math.random() * 500),
  description: `${name} is a leading ${categories[i % categories.length].toLowerCase()} business offering premium services and products.`,
  socialLinks: [
    { platform: "instagram", url: `https://instagram.com/${name.toLowerCase().replace(/[^a-z]/g, "")}` },
    { platform: "facebook", url: `https://facebook.com/${name.toLowerCase().replace(/[^a-z]/g, "")}` },
  ],
  source: sources[i % sources.length],
  tags: [tags[i % tags.length], tags[(i + 3) % tags.length]],
  aiScore: Math.floor(40 + Math.random() * 60),
  status: statuses[i % statuses.length],
  assignedTo: `member-${(i % 5) + 1}`,
  createdAt: randomDate(60),
  updatedAt: randomDate(10),
}));

export const mockTeam: TeamMember[] = [
  { id: "member-1", name: "Arjun Mehta", email: "arjun@salesnova.ai", role: "admin", status: "active", leadsAssigned: 45, tasksCompleted: 128, outreachSent: 312, conversionRate: 18.5 },
  { id: "member-2", name: "Priya Sharma", email: "priya@salesnova.ai", role: "sales_manager", status: "active", leadsAssigned: 38, tasksCompleted: 95, outreachSent: 245, conversionRate: 22.3 },
  { id: "member-3", name: "Rahul Verma", email: "rahul@salesnova.ai", role: "outreach_agent", status: "away", leadsAssigned: 52, tasksCompleted: 67, outreachSent: 189, conversionRate: 15.7 },
  { id: "member-4", name: "Sneha Patel", email: "sneha@salesnova.ai", role: "designer", status: "active", leadsAssigned: 15, tasksCompleted: 43, outreachSent: 78, conversionRate: 28.1 },
  { id: "member-5", name: "Vikram Singh", email: "vikram@salesnova.ai", role: "developer", status: "offline", leadsAssigned: 8, tasksCompleted: 156, outreachSent: 22, conversionRate: 31.2 },
];

export const mockPipeline: PipelineStage[] = [
  { id: "stage-1", name: "New Lead", color: "#6366f1", deals: mockLeads.filter(l => l.status === "new").slice(0, 6).map((l, i) => ({ id: `deal-1-${i}`, leadId: l.id, businessName: l.businessName, value: Math.floor(15000 + Math.random() * 85000), stage: "new", assignedTo: l.assignedTo, lastActivity: "Added from Google Maps", createdAt: l.createdAt })) },
  { id: "stage-2", name: "AI Analyzed", color: "#8b5cf6", deals: mockLeads.filter(l => l.status === "ai_analyzed").slice(0, 5).map((l, i) => ({ id: `deal-2-${i}`, leadId: l.id, businessName: l.businessName, value: Math.floor(20000 + Math.random() * 80000), stage: "ai_analyzed", assignedTo: l.assignedTo, lastActivity: "AI audit completed", createdAt: l.createdAt, aiInsight: "Website needs modernization" })) },
  { id: "stage-3", name: "Contacted", color: "#06b6d4", deals: mockLeads.filter(l => l.status === "contacted").slice(0, 4).map((l, i) => ({ id: `deal-3-${i}`, leadId: l.id, businessName: l.businessName, value: Math.floor(25000 + Math.random() * 75000), stage: "contacted", assignedTo: l.assignedTo, lastActivity: "WhatsApp message sent", createdAt: l.createdAt })) },
  { id: "stage-4", name: "Follow-Up", color: "#f59e0b", deals: mockLeads.filter(l => l.status === "follow_up").slice(0, 4).map((l, i) => ({ id: `deal-4-${i}`, leadId: l.id, businessName: l.businessName, value: Math.floor(30000 + Math.random() * 70000), stage: "follow_up", assignedTo: l.assignedTo, lastActivity: "Follow-up scheduled", createdAt: l.createdAt })) },
  { id: "stage-5", name: "Interested", color: "#10b981", deals: mockLeads.filter(l => l.status === "interested").slice(0, 3).map((l, i) => ({ id: `deal-5-${i}`, leadId: l.id, businessName: l.businessName, value: Math.floor(40000 + Math.random() * 60000), stage: "interested", assignedTo: l.assignedTo, lastActivity: "Showed interest in redesign", createdAt: l.createdAt })) },
  { id: "stage-6", name: "Proposal Sent", color: "#3b82f6", deals: mockLeads.filter(l => l.status === "proposal_sent").slice(0, 3).map((l, i) => ({ id: `deal-6-${i}`, leadId: l.id, businessName: l.businessName, value: Math.floor(50000 + Math.random() * 50000), stage: "proposal_sent", assignedTo: l.assignedTo, lastActivity: "Proposal delivered", createdAt: l.createdAt })) },
  { id: "stage-7", name: "Meeting", color: "#8b5cf6", deals: mockLeads.filter(l => l.status === "meeting_scheduled").slice(0, 2).map((l, i) => ({ id: `deal-7-${i}`, leadId: l.id, businessName: l.businessName, value: Math.floor(60000 + Math.random() * 40000), stage: "meeting_scheduled", assignedTo: l.assignedTo, lastActivity: "Meeting on Thursday", createdAt: l.createdAt })) },
  { id: "stage-8", name: "Closed Won", color: "#22c55e", deals: mockLeads.filter(l => l.status === "closed").slice(0, 3).map((l, i) => ({ id: `deal-8-${i}`, leadId: l.id, businessName: l.businessName, value: Math.floor(50000 + Math.random() * 100000), stage: "closed", assignedTo: l.assignedTo, lastActivity: "Deal closed!", createdAt: l.createdAt })) },
  { id: "stage-9", name: "Rejected", color: "#ef4444", deals: mockLeads.filter(l => l.status === "rejected").slice(0, 2).map((l, i) => ({ id: `deal-9-${i}`, leadId: l.id, businessName: l.businessName, value: 0, stage: "rejected", assignedTo: l.assignedTo, lastActivity: "Not interested", createdAt: l.createdAt })) },
];

export const mockTasks: Task[] = [
  { id: "task-1", title: "Follow up with Spice Garden", description: "Send redesign proposal", type: "follow_up", status: "todo", priority: "high", assignedTo: "member-1", leadId: "lead-1", dueDate: new Date(Date.now() + 86400000), createdAt: randomDate(5) },
  { id: "task-2", title: "Create website audit for FitZone", description: "Complete website analysis", type: "redesign", status: "in_progress", priority: "medium", assignedTo: "member-4", leadId: "lead-4", dueDate: new Date(Date.now() + 172800000), createdAt: randomDate(3) },
  { id: "task-3", title: "Send proposal to Urban Nest", description: "Prepare pricing proposal", type: "proposal", status: "todo", priority: "urgent", assignedTo: "member-2", leadId: "lead-5", dueDate: new Date(Date.now() + 43200000), createdAt: randomDate(2) },
  { id: "task-4", title: "Schedule meeting with SmileCare", description: "Book demo call", type: "meeting", status: "done", priority: "high", assignedTo: "member-1", leadId: "lead-3", dueDate: randomDate(1), createdAt: randomDate(7) },
  { id: "task-5", title: "Outreach to 10 new restaurants", description: "Batch outreach campaign", type: "outreach", status: "todo", priority: "medium", assignedTo: "member-3", dueDate: new Date(Date.now() + 259200000), createdAt: randomDate(1) },
  { id: "task-6", title: "Onboard Glamour Beauty Lounge", description: "Set up client workspace", type: "onboarding", status: "in_progress", priority: "high", assignedTo: "member-2", leadId: "lead-2", dueDate: new Date(Date.now() + 86400000), createdAt: randomDate(4) },
  { id: "task-7", title: "Create pitch deck for hotels", description: "Niche-specific pitch deck", type: "proposal", status: "todo", priority: "low", assignedTo: "member-4", dueDate: new Date(Date.now() + 604800000), createdAt: randomDate(6) },
  { id: "task-8", title: "Follow up with Taj Heritage", description: "Check on proposal status", type: "follow_up", status: "todo", priority: "high", assignedTo: "member-3", leadId: "lead-6", dueDate: new Date(Date.now() + 86400000), createdAt: randomDate(2) },
];

export const mockOutreach: OutreachMessage[] = mockLeads.slice(0, 20).map((lead, i) => ({
  id: `outreach-${i + 1}`,
  leadId: lead.id,
  businessName: lead.businessName,
  channel: (["whatsapp", "email", "instagram", "whatsapp"] as const)[i % 4],
  message: `Hi! I noticed ${lead.businessName} has great reviews. I'd love to show you how a modern website redesign could help attract even more customers. Would you be open to a quick chat?`,
  status: (["draft", "approved", "sent", "replied", "converted"] as const)[i % 5],
  sentBy: `member-${(i % 5) + 1}`,
  sentAt: i % 5 >= 2 ? randomDate(5) : undefined,
  createdAt: randomDate(10),
}));

export const mockArtifacts: Artifact[] = [
  { id: "artifact-1", leadId: "lead-1", type: "message", title: "WhatsApp Outreach — Spice Garden", content: "Hi! I came across Spice Garden Restaurant while researching top-rated dining spots in Mumbai. Your 4.5★ rating with 320+ reviews is impressive!\n\nI noticed your website could benefit from a modern refresh — faster loading, mobile-friendly design, and online reservation integration could really boost your bookings.\n\nWould you be open to a quick 10-minute chat about how we've helped similar restaurants increase their online orders by 40%?\n\nBest regards,\nArjun from SalesNova", version: 1, createdBy: "member-1", updatedAt: new Date(), createdAt: randomDate(3) },
  { id: "artifact-2", leadId: "lead-4", type: "audit", title: "Website Audit — FitZone Gym", content: "# FitZone Gym — Website Audit Report\n\n## Overall Score: 42/100\n\n### Issues Found:\n- ❌ Not mobile responsive\n- ❌ Page load time: 8.2s (should be <3s)\n- ❌ No online booking system\n- ❌ Missing WhatsApp integration\n- ⚠️ Poor SEO meta tags\n- ⚠️ No Google Reviews widget\n\n### Recommendations:\n1. Modern responsive redesign\n2. Add class booking system\n3. Integrate WhatsApp chat\n4. Optimize images and speed\n5. Add testimonial section", version: 2, createdBy: "member-4", updatedAt: new Date(), createdAt: randomDate(5) },
  { id: "artifact-3", leadId: "lead-5", type: "proposal", title: "Proposal — Urban Nest Realty", content: "# Website Redesign Proposal\n## Urban Nest Realty\n\n### Package: Premium Redesign\n**Investment: ₹85,000**\n\n### Deliverables:\n- Modern responsive website\n- Property listing system\n- Lead capture forms\n- WhatsApp integration\n- SEO optimization\n- Google Maps integration\n- Virtual tour support\n\n### Timeline: 3 weeks\n\n### ROI Projection:\n- 3x more online inquiries\n- 45% better mobile engagement\n- Higher Google ranking", version: 1, createdBy: "member-2", updatedAt: new Date(), createdAt: randomDate(2) },
];

export const mockChatMessages: ChatMessage[] = [
  { id: "msg-1", role: "user", content: "Generate a WhatsApp outreach message for Spice Garden Restaurant. They have great reviews but an outdated website.", timestamp: new Date(Date.now() - 300000) },
  { id: "msg-2", role: "assistant", content: "I've analyzed Spice Garden Restaurant and created a personalized outreach message. Here's what I found:\n\n• 4.5★ rating with 320+ reviews — strong social proof\n• Website loads in 8+ seconds — needs optimization\n• No mobile responsiveness — losing mobile customers\n• Missing online ordering — major revenue opportunity\n\nI've generated a warm, consultative WhatsApp message that highlights their strengths while subtly pointing out improvement areas. Check the artifact preview →", timestamp: new Date(Date.now() - 240000), artifactId: "artifact-1" },
  { id: "msg-3", role: "user", content: "Make it shorter and more casual", timestamp: new Date(Date.now() - 180000) },
  { id: "msg-4", role: "assistant", content: "Done! I've shortened the message and made it more conversational while keeping the key value proposition. The updated version is now in the artifact.", timestamp: new Date(Date.now() - 120000), artifactId: "artifact-1" },
];

export const chartData = {
  outreachTrend: [
    { month: "Jan", sent: 120, replied: 34, converted: 8 },
    { month: "Feb", sent: 145, replied: 42, converted: 12 },
    { month: "Mar", sent: 198, replied: 58, converted: 18 },
    { month: "Apr", sent: 234, replied: 71, converted: 22 },
    { month: "May", sent: 312, replied: 95, converted: 31 },
    { month: "Jun", sent: 389, replied: 124, converted: 42 },
  ],
  leadSources: [
    { name: "Google Maps", value: 35, fill: "#8b5cf6" },
    { name: "Instagram", value: 25, fill: "#ec4899" },
    { name: "JustDial", value: 15, fill: "#06b6d4" },
    { name: "Referral", value: 12, fill: "#10b981" },
    { name: "Facebook", value: 8, fill: "#3b82f6" },
    { name: "Other", value: 5, fill: "#6b7280" },
  ],
  pipelineFunnel: [
    { stage: "New", count: 55, fill: "#6366f1" },
    { stage: "Analyzed", count: 42, fill: "#8b5cf6" },
    { stage: "Contacted", count: 31, fill: "#06b6d4" },
    { stage: "Follow-Up", count: 24, fill: "#f59e0b" },
    { stage: "Interested", count: 18, fill: "#10b981" },
    { stage: "Proposal", count: 12, fill: "#3b82f6" },
    { stage: "Meeting", count: 8, fill: "#8b5cf6" },
    { stage: "Closed", count: 5, fill: "#22c55e" },
  ],
  weeklyActivity: [
    { day: "Mon", outreach: 45, tasks: 12 },
    { day: "Tue", outreach: 52, tasks: 18 },
    { day: "Wed", outreach: 38, tasks: 15 },
    { day: "Thu", outreach: 65, tasks: 22 },
    { day: "Fri", outreach: 48, tasks: 14 },
    { day: "Sat", outreach: 22, tasks: 8 },
    { day: "Sun", outreach: 12, tasks: 5 },
  ],
};

export const activityFeed = [
  { id: 1, user: "Arjun Mehta", action: "sent outreach to", target: "Spice Garden Restaurant", time: new Date(Date.now() - 600000), type: "outreach" as const },
  { id: 2, user: "Priya Sharma", action: "moved deal to", target: "Proposal Sent", time: new Date(Date.now() - 1800000), type: "pipeline" as const },
  { id: 3, user: "AI Agent", action: "completed audit for", target: "FitZone Gym", time: new Date(Date.now() - 3600000), type: "ai" as const },
  { id: 4, user: "Sneha Patel", action: "created redesign for", target: "Glamour Beauty Lounge", time: new Date(Date.now() - 7200000), type: "artifact" as const },
  { id: 5, user: "Rahul Verma", action: "added 12 leads from", target: "Google Maps", time: new Date(Date.now() - 10800000), type: "lead" as const },
  { id: 6, user: "Priya Sharma", action: "closed deal with", target: "Urban Nest Realty", time: new Date(Date.now() - 14400000), type: "deal" as const },
  { id: 7, user: "AI Agent", action: "generated proposal for", target: "SmileCare Dental", time: new Date(Date.now() - 21600000), type: "ai" as const },
  { id: 8, user: "Vikram Singh", action: "completed task", target: "Deploy landing page", time: new Date(Date.now() - 28800000), type: "task" as const },
];
