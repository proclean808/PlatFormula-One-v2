import { Users, MessageSquare, Globe, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Community Tab Component
 * 
 * Design: Founder network and community features
 * - Member profiles
 * - Discussion forums
 * - Networking opportunities
 */
export default function Community() {
  const members = [
    {
      name: 'Sarah Chen',
      role: 'AI/ML Founder',
      company: 'DataFlow AI',
      avatar: '👩‍💼',
      expertise: ['Machine Learning', 'Data Science', 'Cloud']
    },
    {
      name: 'Marcus Johnson',
      role: 'SaaS Entrepreneur',
      company: 'CloudScale',
      avatar: '👨‍💼',
      expertise: ['SaaS', 'Product', 'Growth']
    },
    {
      name: 'Priya Patel',
      role: 'FinTech Founder',
      company: 'PayFlow',
      avatar: '👩‍💻',
      expertise: ['FinTech', 'Blockchain', 'Security']
    },
    {
      name: 'Alex Rodriguez',
      role: 'EdTech Innovator',
      company: 'LearnHub',
      avatar: '👨‍🎓',
      expertise: ['EdTech', 'Mobile', 'Community']
    }
  ];

  const discussions = [
    {
      title: 'Best practices for pitching to VCs',
      author: 'Sarah Chen',
      replies: 24,
      views: 342
    },
    {
      title: 'How to validate product-market fit',
      author: 'Marcus Johnson',
      replies: 18,
      views: 256
    },
    {
      title: 'Fundraising timeline and strategy',
      author: 'Priya Patel',
      replies: 31,
      views: 445
    },
    {
      title: 'Building a strong founding team',
      author: 'Alex Rodriguez',
      replies: 15,
      views: 198
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
          Founder Community
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Connect with founders, share experiences, and build relationships with the global startup community
        </p>
      </div>

      {/* Community Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            icon: Users,
            title: '2,500+',
            description: 'Active Members',
            color: 'from-purple-600 to-pink-500'
          },
          {
            icon: MessageSquare,
            title: '1,200+',
            description: 'Discussions',
            color: 'from-pink-500 to-orange-500'
          },
          {
            icon: Globe,
            title: '45+',
            description: 'Countries',
            color: 'from-cyan-500 to-blue-500'
          },
          {
            icon: Zap,
            title: '500+',
            description: 'Mentors',
            color: 'from-purple-600 to-cyan-500'
          }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="glass p-6 text-center hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="gradient-text text-2xl font-bold mb-1">
                {stat.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {stat.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Featured Members */}
      <div className="glass p-8 rounded-2xl">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          Featured Members
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {members.map((member, idx) => (
            <div
              key={idx}
              className="p-4 bg-white/50 dark:bg-slate-700/30 rounded-lg hover:shadow-md transition-all cursor-pointer"
            >
              <div className="text-4xl mb-3">{member.avatar}</div>
              <h4 className="font-semibold text-slate-900 dark:text-white">
                {member.name}
              </h4>
              <p className="text-sm text-purple-600 dark:text-pink-400 font-medium">
                {member.role}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                {member.company}
              </p>
              <div className="flex flex-wrap gap-1">
                {member.expertise.slice(0, 2).map((skill, skillIdx) => (
                  <span
                    key={skillIdx}
                    className="text-xs px-2 py-1 bg-gradient-to-r from-purple-600/20 to-pink-500/20 text-purple-700 dark:text-pink-300 rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Discussion Forum */}
      <div className="glass p-8 rounded-2xl">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          Latest Discussions
        </h3>
        <div className="space-y-4">
          {discussions.map((discussion, idx) => (
            <div
              key={idx}
              className="p-4 bg-white/50 dark:bg-slate-700/30 rounded-lg hover:bg-white/80 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 dark:text-white hover:text-purple-600 dark:hover:text-pink-400 transition">
                    {discussion.title}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    by {discussion.author}
                  </p>
                </div>
                <div className="text-right text-xs text-slate-600 dark:text-slate-400">
                  <p>{discussion.replies} replies</p>
                  <p>{discussion.views} views</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="glass p-8 rounded-2xl text-center">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
          Join the Community
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Connect with founders, share your journey, and grow together
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Button className="gradient-btn">
            Join Community
          </Button>
          <Button variant="outline">
            Browse Discussions
          </Button>
        </div>
      </div>
    </div>
  );
}
