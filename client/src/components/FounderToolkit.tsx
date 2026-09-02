import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  Terminal,
  Bot,
  Send,
  Sparkles,
  User,
  Loader2,
  ExternalLink,
  DollarSign,
  TrendingUp,
  Scale,
  Code,
  Cpu
} from "lucide-react";

type Role = "assistant" | "user";

type ToolInvocation = {
  name: string;
  argsHash: string;
  latencyMs: number;
  status: "success" | "error" | "running";
};

type ChatMessage = {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
  status?: "sent" | "delivered" | "thinking" | "error";
  toolInvocations?: ToolInvocation[];
};

interface Tool {
  name: string;
  url: string;
  description: string;
  value: string;
  category: "financial" | "sales" | "legal" | "developer" | "ai_infrastructure";
}

function uid() {
  if (typeof globalThis !== "undefined" && "crypto" in globalThis && "randomUUID" in (globalThis.crypto as any)) {
    return (globalThis.crypto as any).randomUUID() as string;
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

async function runAssistantPipeline(text: string, onToolUpdate: (tool: ToolInvocation) => void) {
  onToolUpdate({ name: "mcp-core-router", argsHash: "0x7a9...f1", latencyMs: 0, status: "running" });
  await new Promise((r) => setTimeout(r, 350));
  onToolUpdate({ name: "mcp-core-router", argsHash: "0x7a9...f1", latencyMs: 352, status: "success" });

  onToolUpdate({ name: "membrain-vector-sync", argsHash: "0x4b2...c8", latencyMs: 0, status: "running" });
  await new Promise((r) => setTimeout(r, 420));
  onToolUpdate({ name: "membrain-vector-sync", argsHash: "0x4b2...c8", latencyMs: 421, status: "success" });

  onToolUpdate({ name: "dac-dns-controller", argsHash: "0x11b...4a", latencyMs: 0, status: "running" });
  await new Promise((r) => setTimeout(r, 210));
  onToolUpdate({ name: "dac-dns-controller", argsHash: "0x11b...4a", latencyMs: 213, status: "success" });

  return "Execution complete. Monorepo modules aligned to MemBRAIN context. DAC configurations verified.";
}

export function FounderToolkit() {
  const [activeTab, setActiveTab] = useState("tools");
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: uid(),
      role: "assistant",
      createdAt: Date.now(),
      status: "delivered",
      content:
        "I am JoyceGPT, your Poly-Modal AI Co-Pilot. Detecting PlatFormula.ONE v2. Initialize Chain Trio and bind Claude Cowork MCP plugins to MemBRAIN context."
    }
  ]);

  // Stable auto-scroll: no Radix internal selectors
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const lastUserMessage = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) if (messages[i]?.role === "user") return messages[i];
    return null;
  }, [messages]);

  const handleSendMessage = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    const text = chatInput.trim();
    if (!text) return;

    const assistantMsgId = uid();

    const userMsg: ChatMessage = {
      id: uid(),
      role: "user",
      content: text,
      createdAt: Date.now(),
      status: "sent"
    };

    const thinkingMsg: ChatMessage = {
      id: assistantMsgId,
      role: "assistant",
      content: "Initializing execution sequence...",
      createdAt: Date.now(),
      status: "thinking",
      toolInvocations: []
    };

    // Atomic insert to prevent state ordering issues
    setMessages((prev) => [...prev, userMsg, thinkingMsg]);
    setChatInput("");

    let currentTools: ToolInvocation[] = [];

    const handleToolUpdate = (tool: ToolInvocation) => {
      const index = currentTools.findIndex((t) => t.name === tool.name);
      if (index >= 0) currentTools[index] = tool;
      else currentTools = [...currentTools, tool];

      setMessages((prev) =>
        prev.map((m) => (m.id === assistantMsgId ? { ...m, toolInvocations: [...currentTools] } : m))
      );
    };

    try {
      const response = await runAssistantPipeline(text, handleToolUpdate);
      setMessages((prev) =>
        prev.map((m) => (m.id === assistantMsgId ? { ...m, content: response, status: "delivered" } : m))
      );
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId ? { ...m, content: "Pipeline error. Inspect logs.", status: "error" } : m
        )
      );
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSendMessage();
    }
  };

  const tools: Tool[] = [
    // Financial Infrastructure & Fintech
    { 
      name: "Deel", 
      url: "https://www.deel.com/partners/refer", 
      description: "Global payroll, compliance, and contractor management", 
      value: "$1,500 signup bonus",
      category: "financial" 
    },
    { 
      name: "Mercury", 
      url: "https://mercury.com/referrals", 
      description: "Banking built for startups with powerful financial tools", 
      value: "Up to $1,500 bonus",
      category: "financial" 
    },
    { 
      name: "Rho", 
      url: "https://www.rho.co/partners", 
      description: "Corporate cards, banking, and expense management", 
      value: "$500-$1,000 bonus",
      category: "financial" 
    },
    { 
      name: "Brex", 
      url: "https://www.brex.com/partners", 
      description: "Corporate cards and spend management for startups", 
      value: "High-value rewards",
      category: "financial" 
    },
    { 
      name: "Gusto", 
      url: "https://gusto.com/partners", 
      description: "Payroll, benefits, and HR for growing teams", 
      value: "$200-$500 per signup",
      category: "financial" 
    },
    
    // Sales, CRM & Scaling
    { 
      name: "HubSpot", 
      url: "https://www.hubspot.com/partners/affiliates", 
      description: "All-in-one CRM, marketing, and sales platform", 
      value: "30% recurring commission",
      category: "sales" 
    },
    { 
      name: "Monday.com", 
      url: "https://monday.com/p/partners/", 
      description: "Work OS for teams to run projects and workflows", 
      value: "25-100% first-year revenue",
      category: "sales" 
    },
    { 
      name: "Shopify", 
      url: "https://www.shopify.com/affiliates", 
      description: "E-commerce platform for online stores", 
      value: "Up to $150 per referral",
      category: "sales" 
    },
    { 
      name: "ActiveCampaign", 
      url: "https://www.activecampaign.com/partner", 
      description: "Email marketing automation and CRM", 
      value: "20-30% recurring lifetime",
      category: "sales" 
    },
    { 
      name: "Kinsta", 
      url: "https://kinsta.com/affiliates/", 
      description: "Premium managed WordPress and application hosting", 
      value: "$50-$500 + 10% recurring",
      category: "sales" 
    },
    { 
      name: "Mailmodo", 
      url: "https://mailmodo.com/affiliates", 
      description: "Interactive email marketing with AMP emails for higher engagement", 
      value: "20% recurring (up to $5K)",
      category: "sales" 
    },
    { 
      name: "Semrush", 
      url: "https://semrush.com/affiliate", 
      description: "SEO, content marketing, and competitive research platform", 
      value: "$200 per sale + trial bonuses",
      category: "sales" 
    },
    
    // Legal, Compliance & IP
    { 
      name: "Clerky", 
      url: "https://www.clerky.com/partners", 
      description: "Incorporation and legal paperwork for startups", 
      value: "$50 per signup",
      category: "legal" 
    },
    { 
      name: "Stripe Atlas", 
      url: "https://stripe.com/atlas", 
      description: "Incorporate a US company from anywhere", 
      value: "Referral program available",
      category: "legal" 
    },
    { 
      name: "Ironclad", 
      url: "https://ironcladapp.com/partners/", 
      description: "Digital contracting platform for legal teams", 
      value: "Partner program available",
      category: "legal" 
    },
    { 
      name: "DocuSign", 
      url: "https://www.docusign.com/partners", 
      description: "E-signature and agreement cloud", 
      value: "Partner program available",
      category: "legal" 
    },
    { 
      name: "Gust Launch", 
      url: "https://gust.com/launch", 
      description: "Incorporation, cap table, and investor relations", 
      value: "Referral program available",
      category: "legal" 
    },
    
    // AI Infrastructure Ecosystem (YC W26 + Strategic)
    { 
      name: "Oximy", 
      url: "https://www.ycombinator.com/companies/oximy", 
      description: "(YC W26) The system of record for governance and safety in enterprise AI usage", 
      value: "YC W26",
      category: "ai_infrastructure" 
    },
    { 
      name: "Mendral", 
      url: "https://www.ycombinator.com/companies/mendral", 
      description: "(YC W26) AI DevOps Engineer that autonomously diagnoses and fixes CI/CD failures", 
      value: "YC W26",
      category: "ai_infrastructure" 
    },
    { 
      name: "Canary AI", 
      url: "https://www.ycombinator.com/companies/canary-ai", 
      description: "(YC W26) The first AI QA engineer that understands codebases to catch broken user flows", 
      value: "YC W26",
      category: "ai_infrastructure" 
    },
    { 
      name: "FullSeam", 
      url: "https://www.ycombinator.com/companies/fullseam", 
      description: "(YC W26) AI employee for finance teams; automates AP/AR & reconciliation", 
      value: "YC W26",
      category: "ai_infrastructure" 
    },
    { 
      name: "Cursor", 
      url: "https://cursor.sh/", 
      description: "The premier AI-first code editor and 'vibe coding' standard (Anysphere)", 
      value: "AI code editor",
      category: "ai_infrastructure" 
    },
    { 
      name: "Devin", 
      url: "https://www.cognition-labs.com/", 
      description: "The world's first autonomous AI software engineer (Cognition AI)", 
      value: "AI engineer",
      category: "ai_infrastructure" 
    },
    { 
      name: "Lovable.dev", 
      url: "https://lovable.dev/", 
      description: "Natural language-to-web app generation (full-stack co-engineer)", 
      value: "AI web builder",
      category: "ai_infrastructure" 
    },
    { 
      name: "Jinba", 
      url: "https://www.ycombinator.com/companies/jinba", 
      description: "(YC W26) Enterprise chat-to-workflow automation; 'vibe coding' for non-technical teams", 
      value: "YC W26",
      category: "ai_infrastructure" 
    },
    { 
      name: "Stilta", 
      url: "https://www.ycombinator.com/companies/stilta", 
      description: "(YC W26) Specialized AI for patent practitioners and intellectual property defense", 
      value: "YC W26",
      category: "ai_infrastructure" 
    },
    { 
      name: "Fed10", 
      url: "https://www.ycombinator.com/companies/fed10", 
      description: "(YC W26) AI legislative consultants monitoring bills and policy threats in real-time", 
      value: "YC W26",
      category: "ai_infrastructure" 
    },
    { 
      name: "Fenrock AI", 
      url: "https://www.ycombinator.com/companies/fenrock-ai", 
      description: "(YC W26) AI agents for high-stakes Financial Crime Compliance & anti-money laundering", 
      value: "YC W26",
      category: "ai_infrastructure" 
    },
    { 
      name: "Rhizome AI", 
      url: "https://www.ycombinator.com/companies/rhizome-ai", 
      description: "(YC W26) Regulatory intelligence for healthcare compliance and FDA filings", 
      value: "YC W26",
      category: "ai_infrastructure" 
    },
    { 
      name: "Caretta", 
      url: "https://www.ycombinator.com/companies/caretta", 
      description: "(YC W26) Real-time Sales Intelligence that assists reps during live technical calls", 
      value: "YC W26",
      category: "ai_infrastructure" 
    },
    { 
      name: "BeeSafe AI", 
      url: "https://www.ycombinator.com/companies/beesafe-ai", 
      description: "(YC W26) Real-time scam prevention & fraud channel shutdown for B2B", 
      value: "YC W26",
      category: "ai_infrastructure" 
    },
    { 
      name: "Moda", 
      url: "https://www.ycombinator.com/companies/moda", 
      description: "(YC W26) 'Sentry for AI' that alerts on agent performance & intent drift", 
      value: "YC W26",
      category: "ai_infrastructure" 
    },
    { 
      name: "Traverse", 
      url: "https://www.ycombinator.com/companies/traverse", 
      description: "(YC W26) AI SRE for complex systems that finds & fixes production incidents", 
      value: "YC W26",
      category: "ai_infrastructure" 
    },
    { 
      name: "Didit", 
      url: "https://www.ycombinator.com/companies/didit", 
      description: "(YC W26) Modular identity & verification layer built for the AI era", 
      value: "YC W26",
      category: "ai_infrastructure" 
    },
    
    // Developer & AI Tools
    { 
      name: "Pinecone", 
      url: "https://www.pinecone.io/partners/", 
      description: "Vector database for AI/ML applications and RAG systems", 
      value: "Qualified CPA via PartnerStack",
      category: "developer" 
    },
    { 
      name: "ElevenLabs", 
      url: "https://elevenlabs.io/affiliates", 
      description: "AI voice generation and text-to-speech platform", 
      value: "22% recurring (12 months)",
      category: "developer" 
    },
    { 
      name: "Writesonic", 
      url: "https://writesonic.com/affiliate", 
      description: "AI writing assistant and content generation", 
      value: "30% recurring lifetime",
      category: "developer" 
    },
    { 
      name: "Jasper", 
      url: "https://www.jasper.ai/partners", 
      description: "Enterprise AI copilot for marketing teams", 
      value: "30% recurring (12 months)",
      category: "developer" 
    },
    { 
      name: "Copy.ai", 
      url: "https://www.copy.ai/affiliate", 
      description: "AI-powered copywriting and content automation", 
      value: "30% recurring lifetime",
      category: "developer" 
    },
    { 
      name: "Descript", 
      url: "https://www.descript.com/affiliates", 
      description: "All-in-one audio/video editing with AI transcription", 
      value: "25% recurring (12 months)",
      category: "developer" 
    },
    { 
      name: "Notion", 
      url: "https://www.notion.so/affiliates", 
      description: "All-in-one workspace for notes, docs, and wikis", 
      value: "$10 per signup + 50% recurring",
      category: "developer" 
    },
    { 
      name: "Airtable", 
      url: "https://www.airtable.com/partners", 
      description: "Low-code platform for building collaborative apps", 
      value: "Partner program available",
      category: "developer" 
    },
    { 
      name: "Zapier", 
      url: "https://zapier.com/partners", 
      description: "Automation platform connecting 5,000+ apps", 
      value: "Partner program available",
      category: "developer" 
    },
    { 
      name: "Make (Integromat)", 
      url: "https://www.make.com/en/partners", 
      description: "Visual automation platform for complex workflows", 
      value: "Partner program available",
      category: "developer" 
    },
    { 
      name: "Supabase", 
      url: "https://supabase.com/partners", 
      description: "Open-source Firebase alternative with PostgreSQL", 
      value: "Partner program available",
      category: "developer" 
    },
    { 
      name: "Vercel", 
      url: "https://vercel.com/partners", 
      description: "Frontend cloud platform for developers", 
      value: "Partner program available",
      category: "developer" 
    },
    { 
      name: "Railway", 
      url: "https://railway.app/partners", 
      description: "Infrastructure platform for instant deployments", 
      value: "Partner program available",
      category: "developer" 
    },
    { 
      name: "Render", 
      url: "https://render.com/partners", 
      description: "Unified cloud to build and run apps and sites", 
      value: "Partner program available",
      category: "developer" 
    },
    { 
      name: "Postman", 
      url: "https://www.postman.com/partners/", 
      description: "API platform for building and using APIs", 
      value: "Partner program available",
      category: "developer" 
    },
    { 
      name: "GitHub", 
      url: "https://partner.github.com/", 
      description: "Development platform for version control and collaboration", 
      value: "Partner program available",
      category: "developer" 
    },
    { 
      name: "GitLab", 
      url: "https://about.gitlab.com/partners/", 
      description: "DevOps platform for the entire software lifecycle", 
      value: "Partner program available",
      category: "developer" 
    },
    { 
      name: "Sentry", 
      url: "https://sentry.io/partners/", 
      description: "Application monitoring and error tracking", 
      value: "Partner program available",
      category: "developer" 
    },
    { 
      name: "DataDog", 
      url: "https://www.datadoghq.com/partner/", 
      description: "Monitoring and security platform for cloud applications", 
      value: "Partner program available",
      category: "developer" 
    },
    { 
      name: "Cloudflare", 
      url: "https://www.cloudflare.com/partners/", 
      description: "Web performance and security platform", 
      value: "Partner program available",
      category: "developer" 
    },
    { 
      name: "AWS", 
      url: "https://aws.amazon.com/partners/", 
      description: "Cloud computing services and infrastructure", 
      value: "Partner program available",
      category: "developer" 
    },
    { 
      name: "DigitalOcean", 
      url: "https://www.digitalocean.com/partners", 
      description: "Cloud infrastructure for developers", 
      value: "$25-$100 per signup",
      category: "developer" 
    },
    // --- AI Tools from allaiapps.fun ---
    { name: "Leonardo.ai", url: "https://leonardo.ai", description: "AI image generation platform for creative professionals and game developers", value: "Free tier available", category: "ai_infrastructure" },
    { name: "Microsoft Copilot", url: "https://copilot.microsoft.com", description: "AI assistant integrated across Microsoft 365 apps for productivity", value: "Included with M365", category: "ai_infrastructure" },
    { name: "Play.ht", url: "https://play.ht", description: "AI voice generator with 900+ realistic voices in 142 languages", value: "Free tier available", category: "ai_infrastructure" },
    { name: "CapCut", url: "https://capcut.com", description: "AI-powered video editing platform with auto-captions and effects", value: "Free tier available", category: "ai_infrastructure" },
    { name: "Tabnine", url: "https://tabnine.com", description: "AI code completion assistant supporting 30+ programming languages", value: "Free tier available", category: "developer" },
    { name: "you.com", url: "https://you.com", description: "AI-powered search engine with real-time web access and code generation", value: "Free tier available", category: "ai_infrastructure" },
    { name: "Replit", url: "https://replit.com", description: "AI-powered browser-based IDE for collaborative coding and deployment", value: "Free tier available", category: "developer" },
    { name: "Wordtune", url: "https://wordtune.com", description: "AI writing assistant that rewrites and improves sentences in real-time", value: "Free tier available", category: "sales" },
    { name: "QuillBot", url: "https://quillbot.com", description: "AI paraphrasing and grammar checking tool for writers and students", value: "Free tier available", category: "sales" },
    { name: "NotebookLM", url: "https://notebooklm.google.com", description: "Google's AI research assistant that analyzes your uploaded documents", value: "Free (Google)", category: "ai_infrastructure" },
    { name: "DeepAI", url: "https://deepai.org", description: "AI image generation and text tools with open API access", value: "Free tier available", category: "ai_infrastructure" },
    { name: "Quizizz", url: "https://quizizz.com", description: "AI-powered quiz and learning platform for teams and education", value: "Free tier available", category: "sales" },
    { name: "ChatGPT", url: "https://chatgpt.com", description: "OpenAI's flagship conversational AI assistant for text, code, and images", value: "Free tier available", category: "ai_infrastructure" },
    { name: "Microsoft Designer", url: "https://designer.microsoft.com", description: "AI graphic design tool powered by DALL-E for stunning visuals", value: "Free with Microsoft account", category: "ai_infrastructure" },
    { name: "Pi (Inflection AI)", url: "https://pi.ai", description: "Personal AI assistant focused on emotional intelligence and conversation", value: "Free", category: "ai_infrastructure" },
    { name: "Fliki", url: "https://fliki.ai", description: "AI video creation tool that converts text to video with voiceovers", value: "Free tier available", category: "ai_infrastructure" },
    { name: "DeepSeek", url: "https://deepseek.com", description: "Open-source AI model with strong coding and reasoning capabilities", value: "Free / Open Source", category: "ai_infrastructure" },
    { name: "Resemble.ai", url: "https://resemble.ai", description: "AI voice cloning and synthesis platform for custom voice creation", value: "Free tier available", category: "ai_infrastructure" },
    { name: "Grammarly", url: "https://grammarly.com", description: "AI writing assistant for grammar, clarity, and tone improvements", value: "Free tier available", category: "sales" },
    { name: "Krisp", url: "https://krisp.ai", description: "AI noise cancellation app that removes background noise from calls", value: "Free tier available", category: "sales" },
    { name: "DeepL", url: "https://deepl.com", description: "AI-powered translation tool with superior accuracy in 30+ languages", value: "Free tier available", category: "sales" },
    { name: "Perplexity AI", url: "https://perplexity.ai", description: "AI search engine that provides cited, real-time answers to questions", value: "Free tier available", category: "ai_infrastructure" },
    { name: "Luma AI", url: "https://lumalabs.ai", description: "AI 3D capture and video generation platform for creators", value: "Free tier available", category: "ai_infrastructure" },
    { name: "Remove.bg", url: "https://remove.bg", description: "AI tool that instantly removes image backgrounds in seconds", value: "Free tier available", category: "sales" },
    { name: "Groq", url: "https://groq.com", description: "Ultra-fast AI inference platform with LPU hardware for real-time AI", value: "Free tier available", category: "ai_infrastructure" },
    { name: "Runway", url: "https://runwayml.com", description: "AI video generation and editing platform for creative professionals", value: "Free tier available", category: "ai_infrastructure" },
    { name: "Grok", url: "https://grok.x.ai", description: "xAI's real-time AI assistant with live X/Twitter data access", value: "Free with X Premium", category: "ai_infrastructure" },
    { name: "Pictory", url: "https://pictory.ai", description: "AI video creation from long-form content for social media marketing", value: "Free trial available", category: "sales" },
    { name: "HyperWrite", url: "https://hyperwrite.ai", description: "AI writing assistant with autonomous agent capabilities for tasks", value: "Free tier available", category: "sales" },
    { name: "Tailor Brands", url: "https://tailorbrands.com", description: "AI branding platform for logo design, business formation, and identity", value: "Free logo preview", category: "sales" },
    { name: "CopySmith", url: "https://copysmith.ai", description: "AI copywriting tool for e-commerce product descriptions and ads", value: "Free trial available", category: "sales" },
    { name: "Uizard", url: "https://uizard.io", description: "AI UI design tool that converts sketches and text to wireframes", value: "Free tier available", category: "developer" },
    { name: "Frase", url: "https://frase.io", description: "AI SEO content optimization tool for research and writing", value: "Free trial available", category: "sales" },
    { name: "Midjourney", url: "https://midjourney.com", description: "Leading AI image generation model known for artistic quality", value: "Paid plans from $10/mo", category: "ai_infrastructure" },
    { name: "Lumen5", url: "https://lumen5.com", description: "AI video creation platform that turns blog posts into social videos", value: "Free tier available", category: "sales" },
    { name: "WriteSonic", url: "https://writesonic.com", description: "AI writing platform for blogs, ads, and long-form content at scale", value: "Free tier available", category: "sales" },
    { name: "Type Studio", url: "https://typestudio.co", description: "AI video editor that lets you edit video by editing the transcript", value: "Free tier available", category: "sales" },
    { name: "Notta", url: "https://notta.ai", description: "AI transcription and note-taking with real-time meeting summaries", value: "Free tier available", category: "sales" },
    { name: "Artbreeder", url: "https://artbreeder.com", description: "AI collaborative art platform for blending and evolving images", value: "Free tier available", category: "ai_infrastructure" },
    { name: "Boomy", url: "https://boomy.com", description: "AI music creation platform to instantly generate and release songs", value: "Free tier available", category: "ai_infrastructure" },
    { name: "SciSpace", url: "https://typeset.io", description: "AI research assistant for discovering and analyzing scientific papers", value: "Free tier available", category: "ai_infrastructure" },
    { name: "OpusClip", url: "https://opus.pro", description: "AI tool that auto-generates viral short clips from long-form videos", value: "Free tier available", category: "sales" },
    { name: "Mailbutler AI", url: "https://mailbutler.io", description: "AI email productivity assistant for drafting, scheduling, and follow-ups", value: "Free trial available", category: "sales" },
    { name: "Scalenut", url: "https://scalenut.com", description: "AI content research and writing platform for long-form SEO articles", value: "Free trial available", category: "sales" },
    { name: "Diffblue Cover", url: "https://diffblue.com", description: "AI that automatically generates unit tests for Java codebases", value: "Free trial available", category: "developer" },
    { name: "Parabola.ai", url: "https://parabola.io", description: "No-code AI workflow automation for data transformation and pipelines", value: "Free tier available", category: "developer" },
    { name: "Galileo AI", url: "https://usegalileo.ai", description: "AI that generates high-fidelity UI designs from text prompts", value: "Waitlist", category: "developer" },
    { name: "Durable", url: "https://durable.co", description: "AI website builder for small businesses with built-in CRM and invoicing", value: "Free trial available", category: "sales" },
    { name: "LALAL.ai", url: "https://lalal.ai", description: "AI audio stem splitter for separating vocals and instruments", value: "Free tier available", category: "ai_infrastructure" },
    { name: "Fireflies.ai", url: "https://fireflies.ai", description: "AI meeting assistant that records, transcribes, and analyzes calls", value: "Free tier available", category: "sales" },
    { name: "Brandmark", url: "https://brandmark.io", description: "AI branding tool for logo and brand identity creation", value: "One-time purchase", category: "sales" },
    { name: "SurferSEO", url: "https://surferseo.com", description: "AI SEO optimization platform for content auditing and keyword strategy", value: "Free trial available", category: "sales" },
    { name: "Beatoven.ai", url: "https://beatoven.ai", description: "AI music generator that composes custom royalty-free tracks by mood", value: "Free tier available", category: "ai_infrastructure" },
    { name: "Notion AI", url: "https://notion.so/product/ai", description: "AI writing and summarization features built into Notion workspace", value: "$10/mo add-on", category: "sales" },
    { name: "MarketMuse", url: "https://marketmuse.com", description: "AI content planning and topic authority optimization platform", value: "Free tier available", category: "sales" },
    { name: "Namelix", url: "https://namelix.com", description: "AI business name generator creating brandable short names", value: "Free", category: "sales" },
    { name: "Synthesys", url: "https://synthesys.io", description: "AI voiceover and synthetic video generation with realistic avatars", value: "Free trial available", category: "ai_infrastructure" },
    { name: "PromptHero", url: "https://prompthero.com", description: "Searchable gallery of AI prompts for image generation models", value: "Free", category: "ai_infrastructure" },
    { name: "HubSpot AI", url: "https://hubspot.com/artificial-intelligence", description: "AI-powered CRM with content generation and predictive lead scoring", value: "Free CRM tier", category: "sales" },
    { name: "10Web AI Builder", url: "https://10web.io", description: "WordPress AI builder with automatic content and image generation", value: "Free trial available", category: "developer" },
    { name: "Drift AI", url: "https://drift.com", description: "Conversational marketing AI with chatbots and revenue acceleration", value: "Free trial available", category: "sales" },
    { name: "Hostinger AI", url: "https://hostinger.com/ai-website-builder", description: "AI website builder creating SEO-optimized sites in minutes", value: "From $2.99/mo", category: "developer" },
    { name: "INK Editor", url: "https://inkforall.com", description: "AI writing and SEO assistant for content optimization and ranking", value: "Free tier available", category: "sales" },
    { name: "LogoMakr", url: "https://logomakr.com", description: "AI-assisted logo creation tool with drag-and-drop simplicity", value: "Free tier available", category: "sales" },
    { name: "Jasper Art", url: "https://jasper.ai/art", description: "AI image generation integrated with Jasper's writing platform", value: "Included with Jasper", category: "ai_infrastructure" },
    { name: "Magenta Studio", url: "https://magenta.tensorflow.org/studio", description: "Google's AI music generation tools built on TensorFlow", value: "Free / Open Source", category: "ai_infrastructure" },
    { name: "Adobe Express", url: "https://express.adobe.com", description: "AI-powered design and video tool for quick branded content creation", value: "Free tier available", category: "sales" },
    { name: "Kaiber", url: "https://kaiber.ai", description: "AI video generation platform transforming images and music into video", value: "Free trial available", category: "ai_infrastructure" },
    { name: "Voicemod", url: "https://voicemod.net", description: "Real-time AI voice changer and soundboard for gaming and streaming", value: "Free tier available", category: "ai_infrastructure" },
    { name: "Amper Music", url: "https://ampermusic.com", description: "AI music composition tool for creating custom background tracks", value: "Free tier available", category: "ai_infrastructure" },
    { name: "SciSpace Typeset", url: "https://typeset.io", description: "AI tool for academic writing, citation management, and paper analysis", value: "Free tier available", category: "ai_infrastructure" },
    { name: "CaffeinatedCX", url: "https://caffeinatedcx.com", description: "AI customer support autofill tool for faster ticket resolution", value: "Free trial available", category: "sales" },
    { name: "Prisma", url: "https://prisma-ai.com", description: "AI art filter app transforming photos into artistic styles", value: "Free tier available", category: "ai_infrastructure" },
  ];


  const getCategoryName = (category: string) => {
    switch (category) {
      case "financial": return "Financial Infrastructure";
      case "sales": return "Sales & CRM";
      case "legal": return "Legal & Compliance";
      case "developer": return "Developer Tools";
      case "ai_infrastructure": return "AI Infrastructure Ecosystem";
      default: return category;
    }
  };

  const getCategoryColors = (category: string) => {
    switch (category) {
      case "financial": return { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30", hover: "hover:border-emerald-500/50" };
      case "sales": return { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30", hover: "hover:border-blue-500/50" };
      case "legal": return { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/30", hover: "hover:border-purple-500/50" };
      case "developer": return { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/30", hover: "hover:border-orange-500/50" };
      case "ai_infrastructure": return { bg: "bg-pink-500/10", text: "text-pink-400", border: "border-pink-500/30", hover: "hover:border-pink-500/50" };
      default: return { bg: "bg-gray-500/10", text: "text-gray-400", border: "border-gray-500/30", hover: "hover:border-gray-500/50" };
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "financial": return DollarSign;
      case "sales": return TrendingUp;
      case "legal": return Scale;
      case "developer": return Code;
      case "ai_infrastructure": return Cpu;
      default: return Code;
    }
  };

  const categories = Array.from(new Set(tools.map(t => t.category)));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Founders' ToolKit SDK</h2>
        <p className="text-muted-foreground">Powered by JoyceGPT. Execute faster, decide smarter, grow bigger.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="tools">Partner Tools</TabsTrigger>
          <TabsTrigger value="assistant" className="gap-2">
            <Bot className="h-4 w-4" /> JoyceGPT
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tools" className="space-y-8">
          {categories.map((category) => {
            const categoryTools = tools.filter(t => t.category === category);
            const colors = getCategoryColors(category);
            const Icon = getCategoryIcon(category);

            return (
              <section key={category} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${colors.bg}`}>
                    <Icon className={`h-5 w-5 ${colors.text}`} />
                  </div>
                  <h2 className="text-2xl font-bold">{getCategoryName(category)}</h2>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {categoryTools.map((tool) => (
                    <Card
                      key={tool.name}
                      className={`${colors.border} bg-card/50 backdrop-blur ${colors.hover} transition-colors`}
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          {tool.name}
                          <span className={`text-sm font-normal ${colors.text}`}>
                            {tool.value}
                          </span>
                        </CardTitle>
                        <CardDescription>{tool.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <a
                          href={tool.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <Button
                            variant="ghost"
                            className={`w-full justify-between ${colors.text} hover:${colors.text} ${colors.hover}`}
                          >
                            Learn More
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </a>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            );
          })}

          <Card className="border-orange-500/30 bg-orange-500/5">
            <CardHeader>
              <CardTitle className="text-orange-400">Partner Networks</CardTitle>
              <CardDescription>
                Manage multiple partner programs from a single dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <a
                href="https://www.partnerstack.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button variant="outline" className="w-full justify-between border-orange-500/30 text-orange-400 hover:bg-orange-500/10">
                  PartnerStack
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
              <a
                href="https://firstpromoter.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button variant="outline" className="w-full justify-between border-orange-500/30 text-orange-400 hover:bg-orange-500/10">
                  FirstPromoter
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
              <a
                href="https://impact.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button variant="outline" className="w-full justify-between border-orange-500/30 text-orange-400 hover:bg-orange-500/10">
                  Impact.com
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assistant" className="space-y-4">
          <Card className="border-primary/20 bg-card/50 backdrop-blur flex flex-col h-[600px]">
            <CardHeader className="border-b border-border/40 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">JoyceGPT Operator Console</CardTitle>
                    <CardDescription>PlatFormula.ONE Environment Configuration</CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 animate-pulse">
                  System Ready
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="flex-1 p-0 overflow-hidden relative">
              <ScrollArea className="h-full p-4">
                <div className="space-y-6 pb-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                          msg.role === "assistant" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {msg.role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                      </div>

                      <div
                        className={`rounded-lg px-4 py-3 max-w-[85%] text-sm ${
                          msg.role === "assistant"
                            ? "bg-muted/30 border border-border/50 text-foreground font-mono leading-relaxed"
                            : "bg-primary text-primary-foreground"
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{msg.content}</div>

                        {msg.toolInvocations?.length ? (
                          <div className="mt-4 flex flex-col gap-2 border-t border-border/30 pt-3">
                            <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                              MCP Execution Trace
                            </span>
                            {msg.toolInvocations.map((tool) => (
                              <div
                                key={`${msg.id}-${tool.name}`}
                                className="flex items-center gap-3 text-[11px] font-mono bg-background/60 p-2 rounded-md border border-border/40"
                              >
                                <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="text-foreground font-semibold">{tool.name}</span>
                                <span className="text-muted-foreground/50">{tool.argsHash}</span>
                                <div className="flex-1" />
                                {tool.status === "running" ? (
                                  <div className="flex items-center gap-1.5 text-orange-500">
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                    <span>Executing</span>
                                  </div>
                                ) : tool.status === "success" ? (
                                  <span className="text-emerald-500">{tool.latencyMs}ms</span>
                                ) : (
                                  <span className="text-destructive">{tool.latencyMs}ms</span>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </CardContent>

            <CardFooter className="border-t border-border/40 p-4 bg-muted/10">
              <form onSubmit={handleSendMessage} className="flex w-full gap-3 items-end">
                <Textarea
                  placeholder="Command JoyceGPT… (Enter to send, Shift+Enter for newline)"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  className="flex-1 bg-background/50 font-mono text-sm min-h-[44px] max-h-[140px] resize-none focus-visible:ring-primary/50"
                />
                <Button type="submit" size="icon" disabled={!chatInput.trim()} className="h-11 w-11 shrink-0">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
