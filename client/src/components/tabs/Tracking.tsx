import { LineChart, PieChart, TrendingUp, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Tracking Tab Component
 * 
 * Design: Application tracking and analytics
 * - Progress tracking
 * - Timeline management
 * - Status updates
 */
export default function Tracking() {
  const applications = [
    {
      name: 'Y Combinator',
      status: 'In Review',
      progress: 65,
      submitted: 'Jan 15, 2025',
      color: 'from-purple-600 to-pink-500'
    },
    {
      name: 'Techstars',
      status: 'Accepted',
      progress: 100,
      submitted: 'Dec 20, 2024',
      color: 'from-green-500 to-emerald-500'
    },
    {
      name: 'Plug and Play',
      status: 'Pending',
      progress: 30,
      submitted: 'Jan 10, 2025',
      color: 'from-orange-500 to-yellow-500'
    },
    {
      name: 'Anterra Capital',
      status: 'Interview',
      progress: 80,
      submitted: 'Jan 5, 2025',
      color: 'from-cyan-500 to-blue-500'
    }
  ];

  const timeline = [
    { date: 'Jan 15', event: 'Submitted to Y Combinator' },
    { date: 'Jan 10', event: 'Applied to Plug and Play' },
    { date: 'Jan 5', event: 'Interview scheduled with Anterra' },
    { date: 'Dec 20', event: 'Accepted to Techstars' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
          Application Tracker
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Monitor your accelerator applications and track your progress
        </p>
      </div>

      {/* Applications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {applications.map((app, idx) => (
          <div key={idx} className="glass p-6 rounded-2xl">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {app.name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Submitted: {app.submitted}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${app.color}`}>
                {app.status}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  Progress
                </span>
                <span className="text-xs font-semibold text-slate-900 dark:text-white">
                  {app.progress}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${app.color} transition-all duration-500`}
                  style={{ width: `${app.progress}%` }}
                ></div>
              </div>
            </div>

            <Button variant="outline" size="sm" className="w-full">
              View Details
            </Button>
          </div>
        ))}
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stats */}
        <div className="glass p-8 rounded-2xl">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Application Stats
          </h3>
          <div className="space-y-4">
            {[
              { label: 'Total Applications', value: '4' },
              { label: 'Accepted', value: '1' },
              { label: 'In Review', value: '2' },
              { label: 'Pending', value: '1' }
            ].map((stat, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-white/50 dark:bg-slate-700/30 rounded-lg">
                <span className="text-slate-600 dark:text-slate-400">{stat.label}</span>
                <span className="font-bold text-slate-900 dark:text-white">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="glass p-8 rounded-2xl">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-pink-600" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            {timeline.map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 mt-1.5"></div>
                  {idx < timeline.length - 1 && (
                    <div className="w-0.5 h-12 bg-gradient-to-b from-purple-600 to-transparent mt-1"></div>
                  )}
                </div>
                <div className="pb-4">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {item.date}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {item.event}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="glass p-8 rounded-2xl text-center">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
          Track More Applications
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Add new applications and stay organized
        </p>
        <Button className="gradient-btn">
          Add New Application
        </Button>
      </div>
    </div>
  );
}
