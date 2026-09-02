import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, FileText, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const ACCELERATORS = [
  "Y Combinator",
  "Techstars",
  "500 Global",
  "Alchemist Accelerator",
  "Berkeley SkyDeck",
  "Other"
];

const APPLICATION_SECTIONS = [
  { id: "problem", label: "Problem Statement", prompt: "What problem are you solving?" },
  { id: "solution", label: "Your Solution", prompt: "How does your product solve this problem?" },
  { id: "market", label: "Market Size", prompt: "Describe your target market and its size" },
  { id: "traction", label: "Traction", prompt: "What progress have you made so far?" },
  { id: "team", label: "Team", prompt: "Who are the founders and what's your background?" },
  { id: "vision", label: "Vision", prompt: "What's your long-term vision for the company?" },
];

export default function ApplicationAssistant() {
  const [selectedAccelerator, setSelectedAccelerator] = useState("");
  const [currentSection, setCurrentSection] = useState(APPLICATION_SECTIONS[0]);
  const [userInput, setUserInput] = useState("");
  const [refinedOutput, setRefinedOutput] = useState("");

  const [isRefining, setIsRefining] = useState(false);

  const handleRefine = () => {
    if (!userInput.trim()) {
      toast.error("Please enter some text to refine");
      return;
    }
    if (!selectedAccelerator) {
      toast.error("Please select an accelerator");
      return;
    }

    setIsRefining(true);
    
    // Simulate AI refinement (will be replaced with actual API call)
    setTimeout(() => {
      const refined = `[AI-Refined for ${selectedAccelerator}]\n\n${userInput}\n\n[This is a placeholder. The actual AI refinement will be implemented with backend integration.]`;
      setRefinedOutput(refined);
      setIsRefining(false);
      toast.success("Application text refined!");
    }, 1500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(refinedOutput);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold">Application Assistant</h2>
        </div>
        <p className="text-muted-foreground">
          AI-powered help to craft compelling accelerator applications. Get feedback, refine your answers, and increase your chances of acceptance.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Section */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Your Draft</CardTitle>
            <CardDescription>Enter your initial response and we'll help you refine it</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Target Accelerator</Label>
              <Select value={selectedAccelerator} onValueChange={setSelectedAccelerator}>
                <SelectTrigger>
                  <SelectValue placeholder="Select accelerator" />
                </SelectTrigger>
                <SelectContent>
                  {ACCELERATORS.map((acc) => (
                    <SelectItem key={acc} value={acc}>
                      {acc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Application Section</Label>
              <Select 
                value={currentSection.id} 
                onValueChange={(id) => {
                  const section = APPLICATION_SECTIONS.find(s => s.id === id);
                  if (section) setCurrentSection(section);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {APPLICATION_SECTIONS.map((section) => (
                    <SelectItem key={section.id} value={section.id}>
                      {section.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{currentSection.prompt}</Label>
              <Textarea
                placeholder="Enter your draft response here..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="min-h-[300px] resize-none"
              />
              <p className="text-xs text-muted-foreground">
                {userInput.length} characters
              </p>
            </div>

            <Button 
              onClick={handleRefine} 
              disabled={isRefining}
              className="w-full"
            >
              {isRefining ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Refining...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Refine with AI
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Refined Version</CardTitle>
            <CardDescription>AI-enhanced response optimized for accelerator applications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {refinedOutput ? (
              <>
                <div className="rounded-lg bg-muted p-4 min-h-[300px] whitespace-pre-wrap">
                  {refinedOutput}
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCopy} variant="outline" className="flex-1">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Copy to Clipboard
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center min-h-[300px] text-muted-foreground">
                <div className="text-center space-y-2">
                  <Sparkles className="h-12 w-12 mx-auto opacity-50" />
                  <p>Your refined response will appear here</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tips Section */}
      <Card className="border-primary/20 bg-card/50">
        <CardHeader>
          <CardTitle>Application Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>✓ <strong>Be specific:</strong> Use concrete numbers, metrics, and examples</p>
          <p>✓ <strong>Show traction:</strong> Highlight real progress, not just plans</p>
          <p>✓ <strong>Know your market:</strong> Demonstrate deep understanding of your customers</p>
          <p>✓ <strong>Be concise:</strong> Accelerators review hundreds of applications—make every word count</p>
          <p>✓ <strong>Show passion:</strong> Let your commitment and vision shine through</p>
        </CardContent>
      </Card>
    </div>
  );
}
