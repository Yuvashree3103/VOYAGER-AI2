import React from 'react'
import { motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../services/theme.jsx'

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="p-2.5 rounded-2xl bg-white/70 dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-700/60 hover:bg-white/90 dark:hover:bg-slate-900/55 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 text-amber-400" />
      ) : (
        <Moon className="h-5 w-5 text-slate-800" />
      )}
    </motion.button>
  )
}

export default ThemeToggle
