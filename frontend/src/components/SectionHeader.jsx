import React from 'react'

// Consistent section header used across the dashboard
const SectionHeader = ({ title, subtitle, action }) => {
  return (
    <div className="flex items-end justify-between gap-4 flex-wrap">
      <div>
        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">{title}</h2>
        {subtitle ? <p className="mt-2 text-slate-500 dark:text-slate-300 max-w-2xl">{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}

export default SectionHeader

