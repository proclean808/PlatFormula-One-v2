import { Users, MessageSquare, Calendar, TrendingUp, MapPin, Briefcase, Award, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

/**
 * Community Tab Component
 * 
 * Design: Founder network and community features
 * - Enhanced member profiles with avatars
 * - Discussion forums with engagement metrics
 * - Networking events calendar
 * - Success stories showcase
 */
export default function Community() {
  const members = [
    {
      name: 'Sarah Chen',
      role: 'AI/ML Founder',
      company: 'DataFlow AI',
      location: 'San Francisco, CA',
      batch: 'YC W23',
      avatar: 'SC',
      color: 'from-purple-500 to-pink-500',
      expertise: ['Machine Learning', 'Data Science', 'Cloud Infrastructure'],
      bio: 'Building the future of data analytics with AI'
    },
    {
      name: 'Marcus Johnson',
      role: 'SaaS Entrepreneur',
      company: 'CloudScale',
      location: 'Austin, TX',
      batch: 'Techstars \'24',
      avatar: 'MJ',
      color: 'from-blue-500 to-cyan-500',
      expertise: ['SaaS', 'Product Management', 'Growth Hacking'],
      bio: 'Scaling B2B SaaS from 0 to $1M ARR'
    },
    {
      name: 'Priya Patel',
      role: 'FinTech Founder',
      company: 'PayFlow',
      location: 'New York, NY',
      batch: '500 Global',
      avatar: 'PP',
      color: 'from-green-500 to-emerald-500',
      expertise: ['FinTech', 'Blockchain', 'Security'],
      bio: 'Revolutionizing cross-border payments'
    },
    {
      name: 'Alex Rodriguez',
      role: 'EdTech Innovator',
      company: 'LearnHub',
      location: 'Boston, MA',
      batch: 'Alchemist',
      avatar: 'AR',
      color: 'from-orange-500 to-yellow-500',
      expertise: ['EdTech', 'Mobile Apps', 'Community Building'],
      bio: 'Making education accessible to everyone'
    },
    {
      name: 'Emily Zhang',
      role: 'HealthTech CEO',
      company: 'MedConnect',
      location: 'Seattle, WA',
      batch: 'Berkeley SkyDeck',
      avatar: 'EZ',
      color: 'from-pink-500 to-rose-500',
      expertise: ['HealthTech', 'Telemedicine', 'Regulatory'],
      bio: 'Connecting patients with specialists instantly'
    },
    {
      name: 'David Kim',
      role: 'Climate Tech Founder',
      company: 'GreenGrid',
      location: 'Los Angeles, CA',
      batch: 'HAX',
      avatar: 'DK',
      color: 'from-teal-500 to-green-500',
      expertise: ['Climate Tech', 'Hardware', 'Energy'],
      bio: 'Building sustainable energy solutions'
    }
  ];

  const discussions = [
    {
      title: 'Best practices for pitching to VCs in 2025',
      author: 'Sarah Chen',
      authorAvatar: 'SC',
      replies: 24,
      views: 342,
      category: 'Fundraising',
      time: '2 hours ago'
    },
    {
      title: 'How to validate product-market fit before building',
      author: 'Marcus Johnson',
      authorAvatar: 'MJ',
      replies: 18,
      views: 256,
      category: 'Product',
      time: '5 hours ago'
    },
    {
      title: 'Fundraising timeline and strategy for B2B SaaS',
      author: 'Priya Patel',
      authorAvatar: 'PP',
      replies: 31,
      views: 489,
      category: 'Fundraising',
      time: '1 day ago'
    },
    {
      title: 'Building a remote-first startup culture',
      author: 'Alex Rodriguez',
      authorAvatar: 'AR',
      replies: 15,
      views: 203,
      category: 'Culture',
      time: '2 days ago'
    }
  ];

  const events = [
    {
      title: 'Virtual Pitch Practice Session',
      date: 'Feb 15, 2025',
      time: '2:00 PM PST',
      attendees: 12,
      type: 'Workshop'
    },
    {
      title: 'Founder Networking Mixer',
      date: 'Feb 20, 2025',
      time: '6:00 PM PST',
      attendees: 45,
      type: 'Networking'
    },
    {
      title: 'Fundraising Masterclass with VCs',
      date: 'Feb 25, 2025',
      time: '3:00 PM PST',
      attendees: 78,
      type: 'Masterclass'
    }
  ];

  const successStories = [
    {
      company: 'DataFlow AI',
      founder: 'Sarah Chen',
      achievement: 'Raised $2M Seed Round',
      description: 'Led by Sequoia Capital after YC Demo Day'
    },
    {
      company: 'CloudScale',
      founder: 'Marcus Johnson',
      achievement: 'Reached $1M ARR',
      description: 'In just 18 months with 500+ customers'
    },
    {
      company: 'PayFlow',
      founder: 'Priya Patel',
      achievement: 'Acquired by Stripe',
      description: 'For undisclosed amount after 2 years'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
          Founder Community
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Connect with fellow founders, share experiences, and grow together
        </p>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass p-6 text-center">
          <Users className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            1,234
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Active Founders
          </div>
        </div>
        <div className="glass p-6 text-center">
          <MessageSquare className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            5,678
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Discussions
          </div>
        </div>
        <div className="glass p-6 text-center">
          <Calendar className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            24
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Events/Month
          </div>
        </div>
        <div className="glass p-6 text-center">
          <TrendingUp className="w-8 h-8 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            $50M+
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Raised by Members
          </div>
        </div>
      </div>

      {/* Featured Members */}
      <div className="glass p-8 rounded-2xl">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          Featured Founders
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member, idx) => (
            <div
              key={idx}
              className="p-6 bg-white/50 dark:bg-slate-700/30 rounded-lg hover:bg-white/80 dark:hover:bg-slate-700/50 transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-4 mb-4">
                <Avatar className={`w-12 h-12 bg-gradient-to-br ${member.color}`}>
                  <AvatarFallback className="text-white font-bold">
                    {member.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-pink-400 transition">
                    {member.name}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {member.role}
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Briefcase className="w-4 h-4" />
                  <span>{member.company}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <MapPin className="w-4 h-4" />
                  <span>{member.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Award className="w-4 h-4" />
                  <span>{member.batch}</span>
                </div>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                {member.bio}
              </p>

              <div className="flex flex-wrap gap-2">
                {member.expertise.map((skill, skillIdx) => (
                  <Badge key={skillIdx} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Discussions */}
      <div className="glass p-8 rounded-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
            Recent Discussions
          </h3>
          <Button className="gradient-btn">
            Start Discussion
          </Button>
        </div>
        <div className="space-y-4">
          {discussions.map((discussion, idx) => (
            <div
              key={idx}
              className="p-4 bg-white/50 dark:bg-slate-700/30 rounded-lg hover:bg-white/80 dark:hover:bg-slate-700/50 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <Avatar className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500">
                    <AvatarFallback className="text-white font-bold text-sm">
                      {discussion.authorAvatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-pink-400 transition mb-1">
                      {discussion.title}
                    </h4>
                    <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                      <span>by {discussion.author}</span>
                      <Badge variant="outline" className="text-xs">
                        {discussion.category}
                      </Badge>
                      <span>{discussion.time}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>{discussion.replies}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{discussion.views}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="glass p-8 rounded-2xl">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          Upcoming Events
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((event, idx) => (
            <div
              key={idx}
              className="p-6 bg-white/50 dark:bg-slate-700/30 rounded-lg hover:bg-white/80 dark:hover:bg-slate-700/50 transition-all cursor-pointer"
            >
              <Badge className="mb-3">{event.type}</Badge>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                {event.title}
              </h4>
              <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{event.attendees} attending</span>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Register
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Success Stories */}
      <div className="glass p-8 rounded-2xl">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          Success Stories
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {successStories.map((story, idx) => (
            <div
              key={idx}
              className="p-6 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg text-white"
            >
              <Award className="w-10 h-10 mb-4 opacity-80" />
              <h4 className="text-xl font-bold mb-2">{story.company}</h4>
              <p className="text-purple-100 text-sm mb-3">by {story.founder}</p>
              <p className="font-semibold mb-2">{story.achievement}</p>
              <p className="text-sm text-purple-100">{story.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="glass p-8 rounded-2xl text-center">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
          Join the Community
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Connect with 1,000+ founders building the future
        </p>
        <Button className="gradient-btn">
          Create Your Profile
        </Button>
      </div>
    </div>
  );
}
