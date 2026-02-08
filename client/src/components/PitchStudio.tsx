import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Play, Square } from "lucide-react";

export default function PitchStudio() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold">Pitch Studio</h2>
        <p className="text-muted-foreground">
          Practice and perfect your pitch with AI-powered coaching and feedback.
        </p>
      </div>

      <Card className="border-primary/20 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle>Record Your Pitch</CardTitle>
          <CardDescription>Click the microphone to start recording your pitch</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center py-12">
            <Button size="lg" className="h-24 w-24 rounded-full bg-primary hover:bg-primary/90">
              <Mic className="h-12 w-12" />
            </Button>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            Ready to record • 0:00
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-primary/20 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle>Clarity Score</CardTitle>
            <CardDescription>How clear is your message?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">--</div>
            <div className="text-sm text-muted-foreground mt-2">Record a pitch to get feedback</div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle>Confidence</CardTitle>
            <CardDescription>Voice tone analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">--</div>
            <div className="text-sm text-muted-foreground mt-2">Record a pitch to get feedback</div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle>Pacing</CardTitle>
            <CardDescription>Speaking speed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">--</div>
            <div className="text-sm text-muted-foreground mt-2">Record a pitch to get feedback</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
