import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../utils/ui'

// Primary/secondary gradient buttons used across pages (fast, reusable)
const GradientButton = ({ as: Comp = 'button', className, variant = 'primary', children, ...props }) => {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-black tracking-tight transition focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900'

  const styles =
    variant === 'primary'
      ? 'text-white shadow-sm hover:shadow-md'
      : 'bg-white/70 dark:bg-slate-900/40 text-slate-900 dark:text-white border border-slate-200/70 dark:border-slate-700/60 hover:bg-white/90'

  const background =
    variant === 'primary'
      ? { background: 'linear-gradient(90deg, #2563EB 0%, #7C3AED 55%, #F59E0B 115%)' }
      : undefined

  return (
    <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} className="inline-block">
      <Comp className={cn(base, styles, className)} style={background} {...props}>
        {children}
      </Comp>
    </motion.div>
  )
}

export default GradientButton

