import { BookOpen, Database, FileText, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Resources Tab Component
 * 
 * Design: Accelerator database and learning resources
 * - Resource cards with categories
 * - Search and filter functionality
 * - Glassmorphic layout
 */
export default function Resources() {
  const resources = [
    {
      category: 'Accelerator Programs',
      icon: Database,
      items: [
        { name: 'Y Combinator', description: 'Leading startup accelerator' },
        { name: 'Techstars', description: 'Global startup accelerator' },
        { name: 'Plug and Play', description: 'Innovation platform' },
        { name: 'Anterra Capital', description: 'Early-stage VC' }
      ]
    },
    {
      category: 'Learning Resources',
      icon: BookOpen,
      items: [
        { name: 'Startup Fundamentals', description: 'Essential startup knowledge' },
        { name: 'Pitch Deck Guide', description: 'How to create winning pitches' },
        { name: 'Financial Planning', description: 'Startup finance basics' },
        { name: 'Growth Strategies', description: 'Scaling your startup' }
      ]
    },
    {
      category: 'Templates & Tools',
      icon: FileText,
      items: [
        { name: 'Business Plan Template', description: 'Ready-to-use template' },
        { name: 'Financial Model', description: 'Excel financial projections' },
        { name: 'Pitch Deck Template', description: 'Professional slides' },
        { name: 'Legal Documents', description: 'Essential contracts' }
      ]
    },
    {
      category: 'External Links',
      icon: LinkIcon,
      items: [
        { name: 'Crunchbase', description: 'Startup database' },
        { name: 'AngelList', description: 'Investor network' },
        { name: 'Product Hunt', description: 'Launch your product' },
        { name: 'Indie Hackers', description: 'Founder community' }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
          Accelerator Database & Resources
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Access curated accelerator programs, learning materials, and tools to accelerate your startup journey
        </p>
      </div>

      {/* Resource Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {resources.map((category, idx) => {
          const Icon = category.icon;
          return (
            <div key={idx} className="glass p-8 rounded-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {category.category}
                </h3>
              </div>

              <div className="space-y-4">
                {category.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className="p-4 bg-white/50 dark:bg-slate-700/30 rounded-lg hover:bg-white/80 dark:hover:bg-slate-700/50 transition-colors cursor-pointer group"
                  >
                    <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-pink-400 transition">
                      {item.name}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Section */}
      <div className="glass p-8 rounded-2xl text-center">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
          Need More Resources?
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Join our community to access exclusive resources and connect with other founders
        </p>
        <Button className="gradient-btn">
          Explore More Resources
        </Button>
      </div>
    </div>
  );
}
