import { useState } from 'react';
import { LineChart, Calendar, Plus, X, Clock, CheckCircle, AlertCircle, XCircle, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

/**
 * Tracking Tab Component
 * 
 * Design: Application tracking and analytics
 * - Status badges with color coding
 * - Progress tracking with visual indicators
 * - Timeline management
 * - Filter and sort options
 * - Add/remove applications
 */
export default function Tracking() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', status: 'pending', submitted: '', deadline: '' });
  const [filterStatus, setFilterStatus] = useState('all');
  const [localApplications, setLocalApplications] = useState([
    {
      name: 'Y Combinator',
      status: 'interview',
      progress: 75,
      submitted: 'Jan 15, 2025',
      deadline: 'Feb 15, 2025',
      nextStep: 'Partner interview scheduled',
      color: 'from-orange-500 to-orange-600'
    },
    {
      name: 'Techstars',
      status: 'accepted',
      progress: 100,
      submitted: 'Dec 20, 2024',
      deadline: 'Jan 30, 2025',
      nextStep: 'Onboarding begins March 1',
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: '500 Global',
      status: 'pending',
      progress: 40,
      submitted: 'Jan 10, 2025',
      deadline: 'Feb 28, 2025',
      nextStep: 'Awaiting initial review',
      color: 'from-green-500 to-green-600'
    },
    {
      name: 'Alchemist Accelerator',
      status: 'rejected',
      progress: 100,
      submitted: 'Jan 5, 2025',
      deadline: 'Jan 20, 2025',
      nextStep: 'Reapply next batch',
      color: 'from-slate-500 to-slate-600'
    },
    {
      name: 'Berkeley SkyDeck',
      status: 'in-review',
      progress: 60,
      submitted: 'Jan 12, 2025',
      deadline: 'Feb 10, 2025',
      nextStep: 'Application under review',
      color: 'from-purple-500 to-purple-600'
    }
  ]);

  const getStatusConfig = (status: string) => {
    const configs = {
      'pending': { 
        icon: Clock, 
        label: 'Pending', 
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        badgeColor: 'bg-yellow-500'
      },
      'in-review': { 
        icon: AlertCircle, 
        label: 'In Review', 
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        badgeColor: 'bg-blue-500'
      },
      'interview': { 
        icon: Calendar, 
        label: 'Interview', 
        color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
        badgeColor: 'bg-purple-500'
      },
      'accepted': { 
        icon: CheckCircle, 
        label: 'Accepted', 
        color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        badgeColor: 'bg-green-500'
      },
      'rejected': { 
        icon: XCircle, 
        label: 'Rejected', 
        color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        badgeColor: 'bg-red-500'
      }
    };
    return configs[status as keyof typeof configs] || configs['pending'];
  };

  const handleAddApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.submitted) {
      const newApp = {
        name: formData.name,
        status: formData.status,
        progress: 20,
        submitted: formData.submitted,
        deadline: formData.deadline,
        nextStep: 'Application submitted',
        color: 'from-purple-600 to-pink-500'
      };
      setLocalApplications([newApp, ...localApplications]);
      setFormData({ name: '', status: 'pending', submitted: '', deadline: '' });
      setShowForm(false);
    }
  };

  const handleRemoveApplication = (index: number) => {
    setLocalApplications(localApplications.filter((_, i) => i !== index));
  };

  const filteredApplications = filterStatus === 'all' 
    ? localApplications 
    : localApplications.filter(app => app.status === filterStatus);

  const stats = {
    total: localApplications.length,
    pending: localApplications.filter(a => a.status === 'pending' || a.status === 'in-review').length,
    interviews: localApplications.filter(a => a.status === 'interview').length,
    accepted: localApplications.filter(a => a.status === 'accepted').length
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
          Application Tracker
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Track all your accelerator applications in one place with real-time status updates
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass p-6 text-center">
          <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {stats.total}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Total Applications
          </div>
        </div>
        <div className="glass p-6 text-center">
          <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
            {stats.pending}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            In Progress
          </div>
        </div>
        <div className="glass p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
            {stats.interviews}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Interviews
          </div>
        </div>
        <div className="glass p-6 text-center">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
            {stats.accepted}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Accepted
          </div>
        </div>
      </div>

      {/* Filter and Add Button */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('all')}
          >
            All
          </Button>
          <Button
            variant={filterStatus === 'pending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('pending')}
          >
            Pending
          </Button>
          <Button
            variant={filterStatus === 'interview' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('interview')}
          >
            Interview
          </Button>
          <Button
            variant={filterStatus === 'accepted' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('accepted')}
          >
            Accepted
          </Button>
        </div>
        
        <Button
          onClick={() => setShowForm(!showForm)}
          className="gradient-btn"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Application
        </Button>
      </div>

      {/* Add Application Form */}
      {showForm && (
        <div className="glass p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            Add New Application
          </h3>
          <form onSubmit={handleAddApplication} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Accelerator Name *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Y Combinator"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="pending">Pending</option>
                  <option value="in-review">In Review</option>
                  <option value="interview">Interview</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Submitted Date *
                </label>
                <Input
                  type="date"
                  value={formData.submitted}
                  onChange={(e) => setFormData({ ...formData, submitted: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Deadline
                </label>
                <Input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button type="submit" className="gradient-btn">
                Add Application
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <div className="glass p-12 rounded-2xl text-center">
            <Calendar className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              No applications found
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              {filterStatus === 'all' ? 'Add your first application to get started' : `No applications with status "${filterStatus}"`}
            </p>
          </div>
        ) : (
          filteredApplications.map((app, idx) => {
            const statusConfig = getStatusConfig(app.status);
            const StatusIcon = statusConfig.icon;
            
            return (
              <div key={idx} className="glass p-6 rounded-2xl hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {app.name}
                      </h3>
                      <Badge className={statusConfig.color}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusConfig.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {app.nextStep}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveApplication(idx)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600 dark:text-slate-400">Progress</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{app.progress}%</span>
                    </div>
                    <Progress value={app.progress} className="h-2" />
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Submitted: {app.submitted}</span>
                    </div>
                    {app.deadline && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>Deadline: {app.deadline}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* CTA */}
      <div className="glass p-8 rounded-2xl text-center">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
          Need Help with Your Applications?
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Get expert feedback on your applications before submitting
        </p>
        <Button className="gradient-btn">
          Request Application Review
        </Button>
      </div>
    </div>
  );
}
