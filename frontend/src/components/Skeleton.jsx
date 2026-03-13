import React from 'react'
import { cn } from '../utils/ui'

// Reusable skeleton block used for perceived performance (avoid blank states)
const Skeleton = ({ className }) => {
  return <div className={cn('animate-pulse rounded-2xl bg-slate-200/70 dark:bg-slate-700/40', className)} />
}

export default Skeleton

