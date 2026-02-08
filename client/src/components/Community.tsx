import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, Users } from "lucide-react";

export default function Community() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold">Founder Community</h2>
        <p className="text-muted-foreground">
          Connect with fellow founders, share experiences, and grow together.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-primary/20 bg-card/50 backdrop-blur">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
              <MessageSquare className="h-6 w-6" />
            </div>
            <CardTitle>Discussion Forums</CardTitle>
            <CardDescription>Join conversations with other founders</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="ghost" className="w-full justify-start text-primary hover:text-primary hover:bg-primary/10">
              Browse Forums →
            </Button>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-card/50 backdrop-blur">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
              <Users className="h-6 w-6" />
            </div>
            <CardTitle>Networking Events</CardTitle>
            <CardDescription>Attend virtual and in-person meetups</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="ghost" className="w-full justify-start text-primary hover:text-primary hover:bg-primary/10">
              View Events →
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Recent Activity</h3>
        <div className="space-y-4">
          <Card className="border-primary/20 bg-card/50 backdrop-blur">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarFallback className="bg-primary/10 text-primary">JD</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-semibold">Jane Doe</div>
                  <div className="text-sm text-muted-foreground">Just got accepted to YC! Happy to answer questions.</div>
                  <div className="text-xs text-muted-foreground mt-2">2 hours ago</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card/50 backdrop-blur">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarFallback className="bg-primary/10 text-primary">MS</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-semibold">Mike Smith</div>
                  <div className="text-sm text-muted-foreground">Looking for a technical co-founder for my B2B SaaS startup.</div>
                  <div className="text-xs text-muted-foreground mt-2">5 hours ago</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
