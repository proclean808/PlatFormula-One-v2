import { Github, Linkedin, Twitter } from 'lucide-react';

/**
 * Footer Component
 * 
 * Design: Glassmorphic footer with social links
 * - Gradient divider at top
 * - Centered content with social icons
 * - Responsive layout
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-purple-200/30 dark:border-purple-800/30 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md mt-16">
      <div className="container mx-auto px-4 py-12">
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
              <a href="#" className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-pink-400 transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com/in/jonathan-behrendt" target="_blank" rel="noopener noreferrer" className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-pink-400 transition">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-pink-400 transition">
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
