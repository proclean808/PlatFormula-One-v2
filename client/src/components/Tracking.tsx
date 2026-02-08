import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Tracking() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold">Application Tracking</h2>
          <p className="text-muted-foreground">
            Track all your accelerator and investor applications in one place.
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Add Application
        </Button>
      </div>

      <div className="grid gap-4">
        <Card className="border-primary/20 bg-card/50 backdrop-blur">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Y Combinator</CardTitle>
              <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20">In Progress</Badge>
            </div>
            <CardDescription>Application submitted on Jan 15, 2026</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Next step: Interview scheduled for Feb 20, 2026
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-card/50 backdrop-blur">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Techstars</CardTitle>
              <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Submitted</Badge>
            </div>
            <CardDescription>Application submitted on Jan 10, 2026</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Next step: Waiting for response
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-card/50 backdrop-blur">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>500 Global</CardTitle>
              <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Draft</Badge>
            </div>
            <CardDescription>Started on Jan 5, 2026</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Next step: Complete application form
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
