import { useState } from 'react';
import { LineChart, PieChart, TrendingUp, Calendar, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Tracking Tab Component
 * 
 * Design: Application tracking and analytics
 * - Progress tracking
 * - Timeline management
 * - Status updates
 * - Add new applications
 */
export default function Tracking() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', status: 'pending', submitted: '' });
  const [localApplications, setLocalApplications] = useState([
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
  ]);

  const handleAddApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.submitted) {
      const newApp = {
        name: formData.name,
        status: formData.status === 'pending' ? 'Pending' : 'Submitted',
        progress: formData.status === 'pending' ? 20 : 50,
        submitted: formData.submitted,
        color: 'from-purple-600 to-pink-500'
      };
      setLocalApplications([newApp, ...localApplications]);
      setFormData({ name: '', status: 'pending', submitted: '' });
      setShowForm(false);
    }
  };

  const handleRemoveApplication = (index: number) => {
    setLocalApplications(localApplications.filter((_, i) => i !== index));
  };


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

      {/* Add Application Form */}
      {showForm && (
        <div className="glass p-6 rounded-2xl border-2 border-purple-500">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
              Add New Application
            </h3>
            <button
              onClick={() => setShowForm(false)}
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleAddApplication} className="space-y-4">
            <input
              type="text"
              placeholder="Accelerator Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-white/80 dark:bg-slate-700/50 border border-purple-200 dark:border-purple-700 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
            <input
              type="date"
              value={formData.submitted}
              onChange={(e) => setFormData({ ...formData, submitted: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-white/80 dark:bg-slate-700/50 border border-purple-200 dark:border-purple-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-white/80 dark:bg-slate-700/50 border border-purple-200 dark:border-purple-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              <option value="pending">Pending</option>
              <option value="submitted">Submitted</option>
            </select>
            <Button type="submit" className="gradient-btn w-full">
              Add Application
            </Button>
          </form>
        </div>
      )}

      {/* Applications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {localApplications.map((app: any, idx: number) => (
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

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                View Details
              </Button>
              <button
                onClick={() => handleRemoveApplication(idx)}
                className="px-3 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
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
              { label: 'Total Applications', value: localApplications.length.toString() },
              { label: 'Accepted', value: localApplications.filter(a => a.status === 'Accepted').length.toString() },
              { label: 'In Review', value: localApplications.filter(a => a.status === 'In Review').length.toString() },
              { label: 'Pending', value: localApplications.filter(a => a.status === 'Pending').length.toString() }
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
        <Button 
          className="gradient-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add New Application'}
        </Button>
      </div>
    </div>
  );
}
