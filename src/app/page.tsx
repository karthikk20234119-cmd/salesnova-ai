"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Zap, ArrowRight, Sparkles, Users, BarChart3, Send, Shield, Bot,
  CheckCircle2, Star, Globe, Kanban, MessageSquare, Eye,
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const features = [
  { icon: Bot, title: "AI Lead Discovery", desc: "Automatically find and enrich business leads from Google Maps, Instagram, JustDial, and more.", color: "text-purple-400" },
  { icon: Eye, title: "Website Audit Engine", desc: "AI analyzes websites for design quality, SEO, speed, mobile responsiveness, and conversion optimization.", color: "text-cyan-400" },
  { icon: MessageSquare, title: "Smart Personalization", desc: "Generate hyper-personalized outreach messages based on business analysis, reviews, and niche context.", color: "text-pink-400" },
  { icon: Kanban, title: "CRM Pipeline", desc: "Visual Kanban-style pipeline to manage leads from discovery to deal closure with drag-and-drop.", color: "text-amber-400" },
  { icon: Sparkles, title: "Live Artifacts", desc: "Anthropic-inspired live workspaces for AI-generated messages, proposals, audits, and redesigns.", color: "text-emerald-400" },
  { icon: Shield, title: "Human-in-the-Loop", desc: "AI generates, humans review and send. No spam. No auto-messaging. Full control always.", color: "text-blue-400" },
];

const stats = [
  { value: "10K+", label: "Leads Discovered" },
  { value: "95%", label: "Personalization Score" },
  { value: "3.2x", label: "More Conversions" },
  { value: "40%", label: "Time Saved" },
];

const pricing = [
  { name: "Starter", price: "₹2,999", period: "/month", features: ["500 leads/month", "AI message generation", "Basic CRM pipeline", "WhatsApp click-to-chat", "1 team member"], cta: "Start Free Trial", popular: false },
  { name: "Professional", price: "₹7,999", period: "/month", features: ["5,000 leads/month", "Advanced AI agents", "Full CRM + Kanban", "Live Artifacts workspace", "5 team members", "Analytics dashboard", "Priority support"], cta: "Start Free Trial", popular: true },
  { name: "Enterprise", price: "Custom", period: "", features: ["Unlimited leads", "Custom AI workflows", "Multi-team workspace", "API access", "Unlimited members", "Dedicated success manager", "SLA guarantee", "Custom integrations"], cta: "Contact Sales", popular: false },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg gradient-primary">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold gradient-text">SalesNova AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#" className="hover:text-foreground transition-colors">Docs</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="gradient" size="sm" className="gap-2">
                Get Started <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-nova-purple/10 rounded-full blur-3xl animate-glow-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-nova-teal/10 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: "1.5s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-nova-purple/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div {...fadeUp}>
            <Badge variant="outline" className="mb-6 gap-2 px-4 py-1.5 text-sm border-primary/30">
              <Sparkles className="w-4 h-4 text-primary" />
              AI-Powered Sales Operating System
            </Badge>
          </motion.div>

          <motion.h1 {...fadeUp} transition={{ delay: 0.1, duration: 0.6 }} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
            Find Leads. <span className="gradient-text">Analyze.</span><br />
            Personalize. <span className="gradient-text">Convert.</span>
          </motion.h1>

          <motion.p {...fadeUp} transition={{ delay: 0.2, duration: 0.6 }} className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            The enterprise-grade AI platform that discovers business leads, generates personalized outreach, and manages your entire sales pipeline — with humans always in control.
          </motion.p>

          <motion.div {...fadeUp} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button variant="gradient" size="xl" className="gap-2 text-base">
                Launch Dashboard <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Button variant="outline" size="xl" className="gap-2 text-base">
              <Globe className="w-5 h-5" /> Watch Demo
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div {...fadeUp} transition={{ delay: 0.4 }} className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-3xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 gap-2 px-3 py-1 border-primary/30">
              <Star className="w-3 h-3 text-primary" /> Features
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Everything you need to<br /><span className="gradient-text">close more deals</span></h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Powerful AI agents work alongside your team to automate lead discovery, analysis, and outreach personalization.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-6 rounded-2xl border border-border bg-card/50 hover:bg-card hover:border-border/80 transition-all duration-300 hover:shadow-lg"
              >
                <div className={`w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${feature.color}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 bg-secondary/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 gap-2 px-3 py-1 border-primary/30">Pricing</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Simple, transparent <span className="gradient-text">pricing</span></h2>
            <p className="text-muted-foreground text-lg">Start free, scale as you grow. No hidden fees.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricing.map((plan) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`relative p-8 rounded-2xl border transition-all duration-300 hover:shadow-xl ${
                  plan.popular
                    ? "border-primary bg-card glow-purple scale-105"
                    : "border-border bg-card/50 hover:bg-card"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="gradient-primary text-white border-0 px-4">Most Popular</Badge>
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button variant={plan.popular ? "gradient" : "outline"} className="w-full" size="lg">
                  {plan.cta}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to supercharge<br /><span className="gradient-text">your sales pipeline?</span></h2>
          <p className="text-muted-foreground text-lg mb-8">Join hundreds of agencies using SalesNova AI to find, analyze, and convert leads with AI-powered precision.</p>
          <Link href="/dashboard">
            <Button variant="gradient" size="xl" className="gap-2 text-base">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold gradient-text">SalesNova AI</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 SalesNova AI. All rights reserved.</p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
