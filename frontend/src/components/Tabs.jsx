import React from 'react'
import { cn } from '../utils/ui'

// Lightweight tabs for interactive sections (no extra dependencies)
const Tabs = ({ tabs, active, onChange, className }) => {
  return (
    <div className={cn('inline-flex flex-wrap gap-2 rounded-2xl bg-slate-100/70 dark:bg-slate-800/50 p-2 border border-slate-200/60 dark:border-slate-700/60', className)}>
      {tabs.map((t) => {
        const isActive = t === active
        return (
          <button
            key={t}
            type="button"
            onClick={() => onChange(t)}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-black transition',
              isActive
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-900/40'
            )}
          >
            {t}
          </button>
        )
      })}
    </div>
  )
}

export default Tabs

