import React, { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import carouselImages from '../data/carouselImages.json'
import LazyImage from './LazyImage'
import { travelAPI } from '../services/api'

// 30-image rotating hero carousel (Tamil Nadu destinations)
const TNCarouselHero = ({ intervalMs = 4500 }) => {
  const localImages = useMemo(() => carouselImages.slice(0, 30), [])
  const [images, setImages] = useState(localImages)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await travelAPI.getCarouselImages()
        if (cancelled) return
        if (Array.isArray(data) && data.length) {
          setImages(data.slice(0, 30))
        }
      } catch {
        if (!cancelled) setImages(localImages)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [localImages])

  useEffect(() => {
    if (!images.length) return
    setIndex((i) => i % images.length)
  }, [images.length])

  useEffect(() => {
    if (!images.length) return
    const t = setInterval(() => setIndex((i) => (i + 1) % images.length), intervalMs)
    return () => clearInterval(t)
  }, [images.length, intervalMs])

  const current = images[index]

  return (
    <div className="relative w-full overflow-hidden rounded-[28px] border border-white/10 shadow-xl bg-slate-900">
      <div className="absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_30%_10%,rgba(37,99,235,0.45),transparent_45%),radial-gradient(circle_at_80%_40%,rgba(124,58,237,0.35),transparent_40%),radial-gradient(circle_at_35%_90%,rgba(245,158,11,0.22),transparent_45%)]" />

      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={current?.id || index}
            initial={{ opacity: 0, scale: 1.01 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.65 }}
            className="absolute inset-0"
          >
            <LazyImage src={current?.url} alt={current?.label} fallbackLabel={current?.label} className="h-full w-full" imgClassName="opacity-95" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative p-6 md:p-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-4 py-2 text-xs font-bold text-white border border-white/15">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          {current?.label || 'Tamil Nadu'}
        </div>

        <div className="mt-6 flex items-end justify-between gap-6 flex-wrap">
          <div className="max-w-2xl">
            <div className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
              Travel Smarter with Voyager AI
            </div>
            <div className="mt-4 text-white/80 text-base md:text-lg leading-relaxed">
              Your intelligent travel companion for exploring Tamil Nadu — from Chennai beaches to Ooty hills, Madurai temples to Kanyakumari sunrise.
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-5">
        <div className="flex items-center gap-2">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-2.5 rounded-full transition-all ${i === index ? 'w-9 bg-white' : 'w-2.5 bg-white/40 hover:bg-white/60'}`}
              aria-label={`Go to ${img.label}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default TNCarouselHero
