import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Star, MapPin, ArrowRight, Languages } from 'lucide-react'
import LazyImage from './LazyImage'
import GradientButton from './GradientButton'
import { formatINR, cn } from '../utils/ui'

// Card components used by the dashboard grids

export const AgencyCard = ({ agency }) => {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 260, damping: 22 }}>
      <Link
        to={`/agencies/${agency.id}`}
        className="group block overflow-hidden rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/40 shadow-sm hover:shadow-lg transition"
      >
        <LazyImage src={agency.imageUrl} alt={agency.name} fallbackLabel={agency.location} className="h-44 w-full" />
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-black text-slate-900 dark:text-white leading-snug">{agency.name}</div>
              <div className="mt-1 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-300">
                <MapPin className="h-4 w-4" />
                <span>{agency.location}</span>
              </div>
            </div>
            <div className="shrink-0 inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-sm font-black text-slate-800 dark:text-slate-200">
              <Star className="h-4 w-4 text-amber-500" />
              {agency.rating}
            </div>
          </div>

          {agency.tourTypes?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {agency.tourTypes.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-bold text-slate-600 dark:text-slate-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-slate-500 dark:text-slate-300">
              Starting <span className="font-black text-slate-900 dark:text-white">₹{formatINR(agency.startingPrice)}</span>
            </div>
            <div className="inline-flex items-center gap-2 text-sm font-black text-blue-600 dark:text-blue-400">
              View Packages <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export const GuideCard = ({ guide, onBook }) => {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 260, damping: 22 }}>
      <div className="overflow-hidden rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/40 shadow-sm hover:shadow-lg transition">
        <LazyImage src={guide.photoUrl} alt={guide.name} fallbackLabel={guide.cities?.[0]} className="h-44 w-full" />
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="font-black text-slate-900 dark:text-white">{guide.name}</div>
            <div className="shrink-0 inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-sm font-black text-slate-800 dark:text-slate-200">
              <Star className="h-4 w-4 text-amber-500" />
              {guide.rating}
            </div>
          </div>

          <div className="mt-2 text-sm text-slate-500 dark:text-slate-300">{guide.about}</div>

          <div className="mt-4 flex flex-wrap gap-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-bold text-slate-700 dark:text-slate-200">
              <Languages className="h-4 w-4" />
              {guide.languages.join(', ')}
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-bold text-slate-700 dark:text-slate-200">
              <MapPin className="h-4 w-4" />
              {guide.cities.join(', ')}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <div className="text-sm text-slate-500 dark:text-slate-300">
              <span className="font-black text-slate-900 dark:text-white">₹{formatINR(guide.pricePerDay)}</span> / day
            </div>
            <GradientButton variant="primary" className="px-4 py-2 text-sm" onClick={() => onBook?.(guide)} type="button">
              Book Guide
            </GradientButton>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export const PackageCard = ({ pack }) => {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 260, damping: 22 }}>
      <div className="overflow-hidden rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/40 shadow-sm hover:shadow-lg transition">
        <LazyImage src={pack.imageUrl} alt={pack.name} fallbackLabel={pack.citiesCovered?.[0]} className="h-44 w-full" />
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-black text-slate-900 dark:text-white leading-snug">{pack.name}</div>
              <div className="mt-1 text-sm text-slate-500 dark:text-slate-300">
                {pack.durationDays} days • {pack.citiesCovered.join(' → ')}
              </div>
            </div>
            <div className="shrink-0 inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-sm font-black text-slate-800 dark:text-slate-200">
              <Star className="h-4 w-4 text-amber-500" />
              {pack.rating}
            </div>
          </div>
          <div className="mt-3 text-sm text-slate-500 dark:text-slate-300">{pack.summary}</div>
          <div className="mt-5 flex items-center justify-between">
            <div className="text-sm text-slate-500 dark:text-slate-300">
              <span className="font-black text-slate-900 dark:text-white">₹{formatINR(pack.price)}</span>
            </div>
            <GradientButton variant="secondary" className="px-4 py-2 text-sm">
              View Details <ArrowRight className="h-4 w-4" />
            </GradientButton>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 260, damping: 22 }}>
      <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/40 shadow-sm p-5 hover:shadow-lg transition">
        <div className="flex items-start gap-3">
          <div className={cn('w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-sm', 'bg-gradient-to-br from-blue-600 to-violet-600')}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <div className="font-black text-slate-900 dark:text-white">{title}</div>
            <div className="mt-1 text-sm text-slate-500 dark:text-slate-300">{description}</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
