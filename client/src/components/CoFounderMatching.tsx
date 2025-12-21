import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Users, MapPin, Briefcase, MessageSquare, Star } from 'lucide-react'

export function CoFounderMatching() {
  const [activeTab, setActiveTab] = useState('matches')

  const profiles = [
    {
      name: "Sarah Chen",
      role: "Technical Co-Founder",
      experience: "Ex-Google, 8 years Full Stack",
      location: "San Francisco, CA",
      interests: ["AI/ML", "B2B SaaS", "Fintech"],
      bio: "Building scalable systems. Looking for a business-minded co-founder to disrupt the legal tech space.",
      match: "95%"
    },
    {
      name: "Michael Ross",
      role: "Product Co-Founder",
      experience: "2x Founder, 1 Exit",
      location: "New York, NY",
      interests: ["Consumer", "Social", "EdTech"],
      bio: "Product visionary with a knack for growth. Seeking a technical partner to build the next big social platform.",
      match: "88%"
    },
    {
      name: "Elena Rodriguez",
      role: "Growth Co-Founder",
      experience: "Head of Growth at Series B",
      location: "Remote / Austin",
      interests: ["E-commerce", "Marketplaces", "Sustainability"],
      bio: "I know how to scale. Looking for a technical genius to build the product while I handle the business.",
      match: "92%"
    }
  ]

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Co-Founder Matching</h2>
          <p className="text-muted-foreground">Find your perfect partner to build the future.</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Users className="mr-2 h-4 w-4" /> Update Profile
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {profiles.map((profile, index) => (
          <Card key={index} className="hover:shadow-lg transition-all border-emerald-100 dark:border-emerald-900/50">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12 border-2 border-emerald-100">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`} />
                    <AvatarFallback>{profile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{profile.name}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Briefcase className="mr-1 h-3 w-3" /> {profile.role}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300">
                  {profile.match} Match
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p className="flex items-center mb-2">
                  <MapPin className="mr-2 h-4 w-4" /> {profile.location}
                </p>
                <p className="italic">"{profile.bio}"</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {interest}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline">
                <MessageSquare className="mr-2 h-4 w-4" /> Connect
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
