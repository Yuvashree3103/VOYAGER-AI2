import React, { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, MapPin, ArrowRight, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

// Local images provided by user (first 5 slides)
import kanyakumariImg from '../assets/images/kanyakumari.jpg'
import meenakshiImg from '../assets/images/meenakshi.png'
import ootyImg from '../assets/images/ooty.png'
import brihadeeswarar from '../assets/images/brihadeeswarar.png'
import mahabalipuramImg from '../assets/images/mahabalipuram.png'
import kodaikanal from '../assets/images/kodaikanal.png'
import rameswaramImg from '../assets/images/rameswaram.png'
import yercaudImg from '../assets/images/yercaud.png'
import hogenakkalImg from '../assets/images/hogenakkal.png'
import courtallamImg from '../assets/images/courtallam.png'
import dhanushkodiImg from '../assets/images/dhanushkodi.png'
import velankanniImg from '../assets/images/velankanni.png'
import marinaImg from '../assets/images/marina.png'
import kanchipuramImg from '../assets/images/kanchipuram.png'
import chidambaramImg from '../assets/images/chidambaram.png'

const tnLocations = [
  {
    id: 1,
    name: 'Kanyakumari Sunrise',
    district: 'Kanyakumari',
    description: "India's southernmost tip where three oceans meet — Bay of Bengal, Arabian Sea, and Indian Ocean. Watch the sun rise and set over the meeting point of three seas.",
    famous: 'Famous for the spectacular tri-ocean sunrise, Vivekananda Rock Memorial, and Thiruvalluvar Statue.',
    image: kanyakumariImg,
    color: 'from-orange-900/80 via-amber-800/40 to-transparent',
    accent: '#f97316',
  },
  {
    id: 2,
    name: 'Meenakshi Amman Temple',
    district: 'Madurai',
    description: 'A masterpiece of Dravidian architecture with 14 towering gopurams adorned with thousands of sculptures. The living cultural heart of Tamil Nadu.',
    famous: 'Famous for the 1500-year-old temple with 33,000 sculptures and the golden lotus tank.',
    image: meenakshiImg,
    color: 'from-yellow-900/80 via-yellow-800/40 to-transparent',
    accent: '#eab308',
  },
  {
    id: 3,
    name: 'Ooty Hills',
    district: 'Nilgiris',
    description: 'The Queen of Hill Stations nestled in the Nilgiri mountains. Famous for rolling tea estates, the UNESCO Nilgiri Mountain Railway toy train, and cool refreshing climate.',
    famous: 'Famous for UNESCO Nilgiri Mountain Railway, Botanical Gardens, and premium Nilgiri tea estates.',
    image: ootyImg,
    color: 'from-green-900/80 via-green-800/40 to-transparent',
    accent: '#22c55e',
  },
  {
    id: 4,
    name: 'Thanjavur Brihadeeswarar Temple',
    district: 'Thanjavur',
    description: 'The Brihadeeswarar Temple, a UNESCO World Heritage Site. Built by Raja Raja Chola I, it stands 66 metres tall — an unmatched feat of Chola engineering from 1010 AD.',
    famous: 'Famous as a UNESCO World Heritage Site, the shadow-less vimana, and Chola-era bronze sculptures.',
    image: brihadeeswarar,
    color: 'from-stone-900/80 via-stone-800/40 to-transparent',
    accent: '#78716c',
  },
  {
    id: 5,
    name: 'Mahabalipuram Shore Temple',
    district: 'Chengalpattu',
    description: 'Rock-cut Pallava temples kissed by the Bay of Bengal waves, a UNESCO World Heritage Site. The 7th century Arjuna\'s Penance is the world\'s largest bas-relief carved on a single boulder.',
    famous: 'Famous for UNESCO World Heritage rock-cut temples, Arjuna\'s Penance, and Five Rathas.',
    image: mahabalipuramImg,
    color: 'from-blue-900/80 via-blue-800/40 to-transparent',
    accent: '#3b82f6',
  },
  {
    id: 6,
    name: 'Kodaikanal Lake',
    district: 'Dindigul',
    description: 'The Princess of Hill Stations — a serene star-shaped lake surrounded by misty Palani Hills. Famous for boating, Coaker\'s Walk views, and world-class handmade chocolates.',
    famous: 'Famous for the star-shaped lake, Coaker\'s Walk, Bear Shola Falls, and local handmade chocolates.',
    image: kodaikanal,
    color: 'from-teal-900/80 via-teal-800/40 to-transparent',
    accent: '#14b8a6',
  },
  {
    id: 7,
    name: 'Rameswaram Pamban Bridge',
    district: 'Ramanathapuram',
    description: 'Sri Ramanathaswamy Temple on Pamban Island — one of India\'s most sacred pilgrimage sites. The iconic Pamban Bridge, India\'s first sea bridge, connects the island to the mainland.',
    famous: 'Famous for the Pamban Railway Bridge, world\'s longest temple corridor, and Dhanushkodi ruins.',
    image: rameswaramImg,
    color: 'from-amber-900/80 via-amber-800/40 to-transparent',
    accent: '#f59e0b',
  },
  {
    id: 8,
    name: 'Yercaud Lake',
    district: 'Salem',
    description: 'The Jewel of the South — a quiet hill station in the Shevaroy Hills with beautiful coffee estates, orange orchards, a scenic lake, and the famous Pagoda Point viewpoint.',
    famous: 'Famous for Pagoda Point sunset views, coffee and orange plantations, and the annual flower show.',
    image: yercaudImg,
    color: 'from-green-900/80 via-green-800/40 to-transparent',
    accent: '#16a34a',
  },
  {
    id: 9,
    name: 'Hogenakkal Falls',
    district: 'Dharmapuri',
    description: 'Called the Niagara of India — the mighty Kaveri river erupts into spectacular falls through ancient carbonatite rocks. Famous for coracle (round boat) rides through misty rapids.',
    famous: 'Famous for coracle boat rides, carbonatite rock formations, and therapeutic fish spa massages.',
    image: hogenakkalImg,
    color: 'from-lime-900/80 via-lime-800/40 to-transparent',
    accent: '#84cc16',
  },
  {
    id: 10,
    name: 'Courtallam Falls',
    district: 'Tenkasi',
    description: 'Dubbed "The Spa of South India" — five spectacular waterfalls cascade through herb-scented forests of the Pothigai Hills. The waters are believed to have medicinal and healing properties.',
    famous: 'Famous as the Spa of South India with 5 different falls and medicinal herb-rich forest waters.',
    image: courtallamImg,
    color: 'from-cyan-900/80 via-cyan-800/40 to-transparent',
    accent: '#06b6d4',
  },
  {
    id: 11,
    name: 'Dhanushkodi Beach',
    district: 'Ramanathapuram',
    description: 'A ghost town at the tip of Pamban Island — where the Bay of Bengal and Indian Ocean meet. The ruins of the 1964-cyclone-destroyed town create an eerie, hauntingly beautiful landscape.',
    famous: 'Famous for the ghost town ruins, the point where two seas meet, and its untouched pristine beach.',
    image: dhanushkodiImg,
    color: 'from-blue-900/80 via-indigo-800/40 to-transparent',
    accent: '#6366f1',
  },
  {
    id: 12,
    name: 'Velankanni Church',
    district: 'Nagapattinam',
    description: 'The Basilica of Our Lady of Good Health — the Lourdes of the East. A magnificent seaside basilica that draws millions of pilgrims annually regardless of religious background.',
    famous: 'Famous as the Lourdes of the East, drawing devotees of all faiths for miraculous healings.',
    image: velankanniImg,
    color: 'from-slate-700/80 via-slate-600/40 to-transparent',
    accent: '#64748b',
  },
  {
    id: 13,
    name: 'Marina Beach Chennai',
    district: 'Chennai',
    description: "World's second longest natural urban beach — 13 km of golden sands. Home to kite flyers, fishermen, fresh beach food stalls, and iconic monuments along the promenade.",
    famous: 'Famous as the world\'s 2nd longest beach with the iconic lighthouse and Anna memorial.',
    image: marinaImg,
    color: 'from-blue-900/80 via-blue-800/40 to-transparent',
    accent: '#2563eb',
  },
  {
    id: 14,
    name: 'Kanchipuram Temples',
    district: 'Kanchipuram',
    description: 'The City of Thousand Temples — one of the seven sacred cities (Sapta Puri) in Hinduism. Home to the Kailasanathar Temple, one of the oldest temples in South India (700 AD).',
    famous: 'Famous for GI-tagged Kanchipuram silk sarees and 108 ancient Pallava-era temples.',
    image: kanchipuramImg,
    color: 'from-violet-900/80 via-purple-800/40 to-transparent',
    accent: '#7c3aed',
  },
  {
    id: 15,
    name: 'Chidambaram Natarajar Temple',
    district: 'Cuddalore',
    description: 'One of the Pancha Bhuta Stalas representing Akasha (sky/space). The cosmic dance of Lord Nataraja is enshrined here — a center of Tamil Shaivism for over 2,000 years.',
    famous: 'Famous for the cosmic dance of Nataraja, Akasha Lingam, and the Adi Annamalai Festival.',
    image: chidambaramImg,
    color: 'from-rose-900/80 via-rose-800/40 to-transparent',
    accent: '#e11d48',
  },
]

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const [paused, setPaused] = useState(false)

  const goTo = useCallback((idx, dir = 1) => {
    setDirection(dir)
    setCurrent(idx)
  }, [])

  const next = useCallback(() => {
    goTo((current + 1) % tnLocations.length, 1)
  }, [current, goTo])

  const prev = useCallback(() => {
    goTo((current - 1 + tnLocations.length) % tnLocations.length, -1)
  }, [current, goTo])

  useEffect(() => {
    if (paused) return
    const t = setInterval(next, 6000)
    return () => clearInterval(t)
  }, [next, paused])

  const slide = tnLocations[current]

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0, scale: 1.05 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir) => ({ x: dir > 0 ? '-60%' : '60%', opacity: 0, scale: 0.95 }),
  }

  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden shadow-2xl"
      style={{ height: 'min(78vh, 640px)' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={slide.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-0"
        >
          {/* Background image */}
          <img
            src={slide.image}
            alt={slide.name}
            className="w-full h-full object-cover"
            loading={slide.id === 1 ? 'eager' : 'lazy'}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&auto=format&fit=crop&q=80'
            }}
          />
          {/* Colour gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.color}`} />
          {/* Dark bottom gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.55 }}
            >
              {/* Location tag */}
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 px-4 py-1.5 text-xs font-bold text-white mb-4">
                <MapPin className="h-3.5 w-3.5 text-orange-300" />
                {slide.district} District, Tamil Nadu
              </div>

              {/* Place name */}
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight drop-shadow-lg max-w-3xl">
                {slide.name}
              </h1>

              {/* Description */}
              <p className="mt-3 text-sm md:text-base text-white/85 max-w-2xl leading-relaxed line-clamp-2">
                {slide.description}
              </p>

              {/* Why famous */}
              <div className="mt-3 flex items-start gap-2">
                <Star className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                <p className="text-xs text-white/70 leading-relaxed">{slide.famous}</p>
              </div>

              {/* CTA Buttons */}
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to={`/plan?district=${encodeURIComponent(slide.district)}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-slate-900 font-black text-sm hover:bg-orange-50 hover:shadow-xl transition-all"
                >
                  Plan Your Trip <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/advisor"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/15 border border-white/30 text-white font-black text-sm hover:bg-white/25 backdrop-blur transition-all"
                >
                  Ask AI Advisor
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 backdrop-blur border border-white/20 flex items-center justify-center text-white hover:bg-black/60 transition z-10 hover:scale-110"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 backdrop-blur border border-white/20 flex items-center justify-center text-white hover:bg-black/60 transition z-10 hover:scale-110"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Slide counter */}
      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur rounded-full px-3 py-1 text-xs font-bold text-white/90 z-10">
        {current + 1} / {tnLocations.length}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-10">
        <motion.div
          key={current}
          className="h-full bg-white"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: paused ? 0 : 6, ease: 'linear' }}
        />
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {tnLocations.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i, i > current ? 1 : -1)}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Place thumbnail strip (bottom right) */}
      <div className="absolute top-4 left-4 flex gap-2 z-10">
        <div className="bg-black/40 backdrop-blur rounded-2xl px-3 py-1.5 text-xs font-bold text-white/90 border border-white/20">
          🗺️ Tamil Nadu — 15 Must-Visit Places
        </div>
      </div>
    </div>
  )
}

export default HeroCarousel
