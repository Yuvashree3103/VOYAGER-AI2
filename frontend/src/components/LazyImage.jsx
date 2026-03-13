import React, { useMemo, useState } from 'react'
import Skeleton from './Skeleton'
import { cn } from '../utils/ui'

// Image with skeleton + graceful fallback to avoid layout shift and broken images.
const LazyImage = ({ src, alt, className, imgClassName, fallbackLabel }) => {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  const safeAlt = useMemo(() => alt || fallbackLabel || 'VoyagerAI image', [alt, fallbackLabel])

  if (failed || !src) {
    return (
      <div
        className={cn(
          'relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-900',
          className
        )}
      >
        <div className="absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.25),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(124,58,237,0.18),transparent_35%),radial-gradient(circle_at_35%_90%,rgba(245,158,11,0.14),transparent_35%)]" />
        <div className="relative h-full w-full flex items-end p-4">
          <div className="text-sm font-black text-slate-800 dark:text-slate-200">{fallbackLabel || 'Tamil Nadu'}</div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('relative overflow-hidden rounded-2xl', className)}>
      {!loaded && <Skeleton className="absolute inset-0" />}
      <img
        src={src}
        alt={safeAlt}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        className={cn('h-full w-full object-cover', imgClassName, loaded ? 'opacity-100' : 'opacity-0')}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </div>
  )
}

export default LazyImage

