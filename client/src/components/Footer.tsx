import { useState } from 'react';
import { Github, Linkedin, Twitter, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase-client';
import { toast } from 'sonner';

/**
 * Footer Component
 * 
 * Design: Glassmorphic footer with newsletter signup and social links
 * - Newsletter signup form with Supabase integration
 * - Gradient divider at top
 * - Centered content with social icons
 * - Responsive layout
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleNewsletterSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ 
          email: email.toLowerCase().trim(),
          source: 'footer',
          status: 'active'
        }]);

      if (error) {
        if (error.code === '23505') {
          // Duplicate email
          toast.info('You\'re already subscribed!');
          setSubmitStatus('success');
        } else {
          throw error;
        }
      } else {
        toast.success('Successfully subscribed! 🎉');
        setSubmitStatus('success');
        setEmail('');
      }
    } catch (error) {
      console.error('Newsletter signup error:', error);
      toast.error('Failed to subscribe. Please try again.');
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      // Reset status after 3 seconds
      setTimeout(() => setSubmitStatus('idle'), 3000);
    }
  };

  return (
    <footer className="border-t border-purple-200/30 dark:border-purple-800/30 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md mt-16">
      <div className="container mx-auto px-4 py-12">
        {/* Newsletter Signup Section */}
        <div className="mb-12 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Mail className="w-5 h-5 text-purple-600 dark:text-pink-400" />
              <h3 className="gradient-text font-bold text-xl">Stay in the Loop</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              Get exclusive accelerator updates, application deadlines, and founder resources delivered to your inbox
            </p>
            <form onSubmit={handleNewsletterSignup} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="founder@startup.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="flex-1 bg-white dark:bg-slate-800 border-purple-200 dark:border-purple-800 focus:border-purple-500 dark:focus:border-pink-500"
                required
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-semibold px-6 transition-all duration-300 disabled:opacity-50"
              >
                {isSubmitting ? (
                  'Subscribing...'
                ) : submitStatus === 'success' ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Subscribed!
                  </>
                ) : submitStatus === 'error' ? (
                  <>
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Try Again
                  </>
                ) : (
                  'Subscribe'
                )}
              </Button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="gradient-text font-bold text-lg mb-2">PlatFormula.ONE</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Empowering founders with AI-driven tools and community support
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><a href="#" className="hover:text-purple-600 dark:hover:text-pink-400 transition">Dashboard</a></li>
              <li><a href="#" className="hover:text-purple-600 dark:hover:text-pink-400 transition">Resources</a></li>
              <li><a href="#" className="hover:text-purple-600 dark:hover:text-pink-400 transition">Pitch Studio</a></li>
              <li><a href="#" className="hover:text-purple-600 dark:hover:text-pink-400 transition">Community</a></li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Connect</h4>
            <div className="flex gap-4">
              <a href="https://x.com/JonathanBe33296" target="_blank" rel="noopener noreferrer" className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-pink-400 transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com/in/jonathan-behrendt" target="_blank" rel="noopener noreferrer" className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-pink-400 transition">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://github.com/proclean808/PlatFormula-One" target="_blank" rel="noopener noreferrer" className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-pink-400 transition">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-purple-200/30 dark:border-purple-800/30 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {currentYear} PlatFormula.ONE. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0 text-sm text-slate-500 dark:text-slate-400">
            <a href="#" className="hover:text-purple-600 dark:hover:text-pink-400 transition">Privacy</a>
            <a href="#" className="hover:text-purple-600 dark:hover:text-pink-400 transition">Terms</a>
            <a href="#" className="hover:text-purple-600 dark:hover:text-pink-400 transition">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
