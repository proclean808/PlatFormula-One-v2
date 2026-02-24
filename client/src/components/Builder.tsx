import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Lightbulb, Target, Users } from "lucide-react";

export default function Builder() {
  return (
    <div className="space-y-8">
      {/* Racing Theme Header Image */}
      <div className="flex justify-center mb-6">
        <img 
          src="/15907.jpg" 
          alt="Formula 1 Racing Action" 
          className="w-full max-w-2xl h-48 object-cover rounded-lg opacity-80 hover:opacity-100 transition-opacity"
        />
      </div>
      
      <div className="space-y-4">
        <h2 className="text-3xl font-bold">Application Builder</h2>
        <p className="text-muted-foreground">
          Build winning accelerator applications with our guided process and expert templates.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-primary/20 bg-card/50 backdrop-blur">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
              <Target className="h-6 w-6" />
            </div>
            <CardTitle>Company Overview</CardTitle>
            <CardDescription>Tell us about your startup</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input id="company-name" placeholder="Enter your company name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="one-liner">One-Liner</Label>
              <Input id="one-liner" placeholder="Describe your startup in one sentence" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="problem">Problem Statement</Label>
              <Textarea id="problem" placeholder="What problem are you solving?" rows={4} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-card/50 backdrop-blur">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
              <Lightbulb className="h-6 w-6" />
            </div>
            <CardTitle>Solution & Traction</CardTitle>
            <CardDescription>Showcase your progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="solution">Solution</Label>
              <Textarea id="solution" placeholder="How does your product solve the problem?" rows={4} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="traction">Traction Metrics</Label>
              <Input id="traction" placeholder="Users, revenue, growth rate, etc." />
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-card/50 backdrop-blur">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
              <Users className="h-6 w-6" />
            </div>
            <CardTitle>Team</CardTitle>
            <CardDescription>Introduce your founding team</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="founders">Founders</Label>
              <Textarea id="founders" placeholder="List founders and their backgrounds" rows={4} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expertise">Key Expertise</Label>
              <Input id="expertise" placeholder="Technical, domain, or industry expertise" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-card/50 backdrop-blur">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
              <FileText className="h-6 w-6" />
            </div>
            <CardTitle>Additional Details</CardTitle>
            <CardDescription>Complete your application</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="market">Market Size</Label>
              <Input id="market" placeholder="Total addressable market (TAM)" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ask">Funding Ask</Label>
              <Input id="ask" placeholder="Amount and use of funds" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vision">Long-term Vision</Label>
              <Textarea id="vision" placeholder="Where do you see the company in 5 years?" rows={3} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center gap-4 pt-6">
        <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          Save Draft
        </Button>
        <Button size="lg" variant="outline">
          Preview Application
        </Button>
      </div>
    </div>
  );
}
