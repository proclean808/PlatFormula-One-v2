import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';

/**
 * Header Component
 * 
 * Design: Modern header with logo and theme toggle
 * - Glassmorphic background with backdrop blur
 * - Gradient text for branding
 * - Theme switcher with smooth transitions
 */
export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-purple-200/30 dark:border-purple-800/30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <div className="flex flex-col">
            <span className="gradient-text font-bold text-lg leading-tight">PlatFormula</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">🏆 🏎 B2B SaaS ToolKit & SDK 🏁</span>
          </div>
        </div>

        {/* Theme Toggle */}
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="rounded-lg border-purple-200/30 dark:border-purple-800/30 hover:bg-purple-50 dark:hover:bg-purple-900/30"
        >
          {theme === 'light' ? (
            <Moon className="h-4 w-4 text-purple-600" />
          ) : (
            <Sun className="h-4 w-4 text-pink-400" />
          )}
        </Button>
      </div>
    </header>
  );
}
