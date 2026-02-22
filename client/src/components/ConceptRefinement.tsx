import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Palette, Type, Lightbulb, Download, Loader2, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface BrandIdentity {
  names: string[];
  taglines: string[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  positioning: string;
}

export default function ConceptRefinement() {
  const [productDescription, setProductDescription] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [brandIdentity, setBrandIdentity] = useState<BrandIdentity | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedName, setSelectedName] = useState("");
  const [selectedTagline, setSelectedTagline] = useState("");

  const handleGenerate = () => {
    if (!productDescription.trim()) {
      toast.error("Please describe your product");
      return;
    }
    if (!targetAudience.trim()) {
      toast.error("Please describe your target audience");
      return;
    }

    setIsGenerating(true);

    // Simulate AI generation (will be replaced with actual API call)
    setTimeout(() => {
      const mockBrand: BrandIdentity = {
        names: [
          "VelocityAI",
          "NexusFlow",
          "PulseCore",
          "ZenithLabs",
          "QuantumLeap"
        ],
        taglines: [
          "Accelerate Your Vision",
          "Where Innovation Meets Execution",
          "Building Tomorrow, Today",
          "Empowering Founders to Scale",
          "Your Success, Amplified"
        ],
        colors: {
          primary: "#10b981",
          secondary: "#3b82f6",
          accent: "#f59e0b"
        },
        positioning: `A cutting-edge platform designed for ${targetAudience}, solving ${productDescription}. Our unique value proposition combines AI-powered insights with human-centric design to deliver measurable results.`
      };

      setBrandIdentity(mockBrand);
      setSelectedName(mockBrand.names[0]);
      setSelectedTagline(mockBrand.taglines[0]);
      setIsGenerating(false);
      toast.success("Brand identity generated!");
    }, 2000);
  };

  const handleDownloadBrandKit = () => {
    if (!brandIdentity) return;
    
    const brandKit = `
BRAND IDENTITY KIT
==================

Product Name: ${selectedName}
Tagline: ${selectedTagline}

COLOR PALETTE
-------------
Primary: ${brandIdentity.colors.primary}
Secondary: ${brandIdentity.colors.secondary}
Accent: ${brandIdentity.colors.accent}

POSITIONING STATEMENT
--------------------
${brandIdentity.positioning}

TARGET AUDIENCE
--------------
${targetAudience}

PRODUCT DESCRIPTION
------------------
${productDescription}
`;

    const blob = new Blob([brandKit], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedName.replace(/\s+/g, '_')}_Brand_Kit.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Brand kit downloaded!");
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold">Concept Refinement</h2>
        </div>
        <p className="text-muted-foreground">
          AI-powered brand identity creation. Generate names, taglines, color schemes, and positioning statements for your startup.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Section */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Your Concept</CardTitle>
            <CardDescription>Tell us about your product and target audience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Product Description</Label>
              <Textarea
                placeholder="Describe what your product does and the problem it solves..."
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                className="min-h-[120px] resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label>Target Audience</Label>
              <Textarea
                placeholder="Who are your ideal customers? (e.g., B2B SaaS founders, enterprise sales teams...)"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="min-h-[120px] resize-none"
              />
            </div>

            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Brand Identity...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Brand Identity
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Your Brand Identity</CardTitle>
            <CardDescription>AI-generated brand elements ready to use</CardDescription>
          </CardHeader>
          <CardContent>
            {brandIdentity ? (
              <Tabs defaultValue="names" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="names">Names</TabsTrigger>
                  <TabsTrigger value="taglines">Taglines</TabsTrigger>
                  <TabsTrigger value="colors">Colors</TabsTrigger>
                </TabsList>

                <TabsContent value="names" className="space-y-3 mt-4">
                  {brandIdentity.names.map((name, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedName(name)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedName === name 
                          ? 'border-primary bg-primary/10' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{name}</span>
                        {selectedName === name && (
                          <span className="text-xs text-primary">Selected</span>
                        )}
                      </div>
                    </button>
                  ))}
                </TabsContent>

                <TabsContent value="taglines" className="space-y-3 mt-4">
                  {brandIdentity.taglines.map((tagline, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedTagline(tagline)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedTagline === tagline 
                          ? 'border-primary bg-primary/10' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{tagline}</span>
                        {selectedTagline === tagline && (
                          <span className="text-xs text-primary">Selected</span>
                        )}
                      </div>
                    </button>
                  ))}
                </TabsContent>

                <TabsContent value="colors" className="space-y-4 mt-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-16 h-16 rounded-lg border-2 border-border"
                        style={{ backgroundColor: brandIdentity.colors.primary }}
                      />
                      <div>
                        <p className="font-semibold">Primary</p>
                        <p className="text-sm text-muted-foreground">{brandIdentity.colors.primary}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-16 h-16 rounded-lg border-2 border-border"
                        style={{ backgroundColor: brandIdentity.colors.secondary }}
                      />
                      <div>
                        <p className="font-semibold">Secondary</p>
                        <p className="text-sm text-muted-foreground">{brandIdentity.colors.secondary}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-16 h-16 rounded-lg border-2 border-border"
                        style={{ backgroundColor: brandIdentity.colors.accent }}
                      />
                      <div>
                        <p className="font-semibold">Accent</p>
                        <p className="text-sm text-muted-foreground">{brandIdentity.colors.accent}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="flex items-center justify-center min-h-[300px] text-muted-foreground">
                <div className="text-center space-y-2">
                  <Palette className="h-12 w-12 mx-auto opacity-50" />
                  <p>Your brand identity will appear here</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Positioning & Download */}
      {brandIdentity && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Positioning Statement</CardTitle>
              <CardDescription>Your unique value proposition</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{brandIdentity.positioning}</p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Selected Brand</CardTitle>
              <CardDescription>Your chosen identity elements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="text-xl font-bold">{selectedName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tagline</p>
                <p className="text-lg">{selectedTagline}</p>
              </div>
              <Button onClick={handleDownloadBrandKit} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download Brand Kit
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
