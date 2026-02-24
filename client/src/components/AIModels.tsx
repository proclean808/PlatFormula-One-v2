import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Zap } from "lucide-react";

interface AIModel {
  name: string;
  provider: string;
  description: string;
  category: "text" | "multimodal" | "code" | "image" | "audio";
  url: string;
  highlights: string[];
}

const aiModels: AIModel[] = [
  {
    name: "GPT-4",
    provider: "OpenAI",
    description: "Most capable GPT model for complex reasoning, creative writing, and technical tasks",
    category: "multimodal",
    url: "https://platform.openai.com/docs/models/gpt-4",
    highlights: ["128K context", "Vision capable", "Function calling"]
  },
  {
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    description: "Balanced model excelling at analysis, coding, and long-form content with strong safety",
    category: "multimodal",
    url: "https://www.anthropic.com/claude",
    highlights: ["200K context", "Vision", "Artifacts"]
  },
  {
    name: "Gemini 2.0 Flash",
    provider: "Google",
    description: "Ultra-fast multimodal model with native tool use and real-time capabilities",
    category: "multimodal",
    url: "https://ai.google.dev/gemini-api/docs",
    highlights: ["1M context", "Multimodal", "Real-time API"]
  },
  {
    name: "Llama 3.3 70B",
    provider: "Meta",
    description: "Open-source powerhouse matching proprietary models with full commercial license",
    category: "text",
    url: "https://www.llama.com/",
    highlights: ["Open source", "128K context", "Commercial use"]
  },
  {
    name: "o1",
    provider: "OpenAI",
    description: "Reasoning model using chain-of-thought for complex problem-solving and STEM tasks",
    category: "text",
    url: "https://openai.com/o1/",
    highlights: ["Advanced reasoning", "STEM focus", "Chain-of-thought"]
  },
  {
    name: "Cursor AI",
    provider: "Anysphere",
    description: "AI-first code editor with context-aware completions and codebase understanding",
    category: "code",
    url: "https://cursor.sh/",
    highlights: ["IDE integration", "Codebase context", "Multi-file edits"]
  },
  {
    name: "GitHub Copilot",
    provider: "GitHub/OpenAI",
    description: "AI pair programmer providing code suggestions across all major IDEs",
    category: "code",
    url: "https://github.com/features/copilot",
    highlights: ["IDE plugins", "Code completion", "Chat interface"]
  },
  {
    name: "Devin",
    provider: "Cognition AI",
    description: "First autonomous AI software engineer capable of end-to-end development",
    category: "code",
    url: "https://www.cognition-labs.com/devin",
    highlights: ["Autonomous coding", "Full-stack", "Production deployment"]
  },
  {
    name: "DALL-E 3",
    provider: "OpenAI",
    description: "State-of-the-art text-to-image generation with exceptional prompt adherence",
    category: "image",
    url: "https://platform.openai.com/docs/guides/images",
    highlights: ["High fidelity", "Prompt accuracy", "ChatGPT integration"]
  },
  {
    name: "Midjourney v6",
    provider: "Midjourney",
    description: "Leading AI art generator known for stunning aesthetics and artistic control",
    category: "image",
    url: "https://www.midjourney.com/",
    highlights: ["Artistic quality", "Style control", "Community platform"]
  },
  {
    name: "Stable Diffusion XL",
    provider: "Stability AI",
    description: "Open-source image generation with fine-tuning capabilities and commercial freedom",
    category: "image",
    url: "https://stability.ai/stable-diffusion",
    highlights: ["Open source", "Fine-tunable", "Local deployment"]
  },
  {
    name: "Flux",
    provider: "Black Forest Labs",
    description: "Next-gen image model with photorealistic output and precise text rendering",
    category: "image",
    url: "https://blackforestlabs.ai/",
    highlights: ["Photorealism", "Text in images", "Fast generation"]
  },
  {
    name: "ElevenLabs",
    provider: "ElevenLabs",
    description: "Ultra-realistic voice synthesis and cloning with emotional control",
    category: "audio",
    url: "https://elevenlabs.io/",
    highlights: ["Voice cloning", "29 languages", "Emotional range"]
  },
  {
    name: "Whisper",
    provider: "OpenAI",
    description: "Robust speech recognition supporting 99 languages with high accuracy",
    category: "audio",
    url: "https://platform.openai.com/docs/guides/speech-to-text",
    highlights: ["99 languages", "Open source", "Timestamp support"]
  },
  {
    name: "Command R+",
    provider: "Cohere",
    description: "Enterprise RAG specialist with multilingual support and citation tracking",
    category: "text",
    url: "https://cohere.com/command",
    highlights: ["RAG optimized", "Citations", "10 languages"]
  },
  {
    name: "Mistral Large 2",
    provider: "Mistral AI",
    description: "European AI champion with strong multilingual and code capabilities",
    category: "text",
    url: "https://mistral.ai/",
    highlights: ["128K context", "Function calling", "European sovereignty"]
  }
];

const getCategoryColor = (category: AIModel["category"]) => {
  switch (category) {
    case "multimodal": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    case "text": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "code": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "image": return "bg-pink-500/10 text-pink-400 border-pink-500/20";
    case "audio": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
  }
};

const getCategoryName = (category: AIModel["category"]) => {
  switch (category) {
    case "multimodal": return "Multimodal";
    case "text": return "Text & Reasoning";
    case "code": return "Code & Development";
    case "image": return "Image Generation";
    case "audio": return "Audio & Speech";
  }
};

export default function AIModels() {
  return (
    <div className="space-y-8">
      {/* Racing Theme Header Image */}
      <div className="flex justify-center mb-6">
        <img 
          src="/trophy-flags-48.jpeg" 
          alt="Championship Trophy with Flags" 
          className="w-full max-w-2xl h-56 object-contain opacity-90 hover:opacity-100 transition-opacity"
        />
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Zap className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold">Top 16 SOTA AI Models</h2>
        </div>
        <p className="text-muted-foreground text-lg">
          The most powerful state-of-the-art AI models for building next-generation applications.
          From multimodal reasoning to autonomous coding and photorealistic generation.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {aiModels.map((model) => (
          <Card key={model.name} className="border-primary/20 bg-card/50 backdrop-blur hover:border-primary/40 transition-all min-h-[280px] flex flex-col">
            <CardHeader className="flex-grow">
              <div className="flex items-start justify-between gap-2 mb-2">
                <CardTitle className="text-xl">{model.name}</CardTitle>
                <Badge variant="outline" className={getCategoryColor(model.category)}>
                  {getCategoryName(model.category)}
                </Badge>
              </div>
              <CardDescription className="text-xs text-muted-foreground/80 mb-2">
                {model.provider}
              </CardDescription>
              <CardDescription className="text-sm leading-relaxed">
                {model.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {model.highlights.map((highlight) => (
                  <Badge key={highlight} variant="secondary" className="text-xs">
                    {highlight}
                  </Badge>
                ))}
              </div>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => window.open(model.url, '_blank')}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Explore {model.name}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 backdrop-blur">
        <CardHeader>
          <CardTitle>Building with AI Models</CardTitle>
          <CardDescription>
            Best practices for integrating SOTA models into your startup
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">🎯 Choose the Right Model</h4>
              <p className="text-sm text-muted-foreground">
                Match model capabilities to your use case. Multimodal for complex reasoning, specialized models for specific tasks.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">💰 Optimize Costs</h4>
              <p className="text-sm text-muted-foreground">
                Use smaller models for simple tasks, cache responses, and consider open-source alternatives for high-volume workloads.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">🔒 Handle Data Safely</h4>
              <p className="text-sm text-muted-foreground">
                Review each provider's data retention policies. Use enterprise tiers for sensitive data or deploy open models locally.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">⚡ Build for Scale</h4>
              <p className="text-sm text-muted-foreground">
                Implement rate limiting, fallback models, and monitoring from day one. Test with production-like loads early.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
