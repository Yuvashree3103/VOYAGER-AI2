import React, { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react'

const tnLocations = [
  {
    id: 1,
    name: 'Kanyakumari Sunrise',
    description: 'The southernmost tip of India, where three seas meet — famous for its breathtaking sunrise and multi-coloured ocean view.',
    location: 'Kanyakumari, Tamil Nadu',
    image: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Kanyakumari_sunrise.jpg',
    color: 'from-orange-900/70 via-orange-800/40 to-transparent',
  },
  {
    id: 2,
    name: 'Meenakshi Amman Temple',
    description: 'A marvel of Dravidian architecture with 14 ornate gopurams towering over Madurai — the living heart of Tamil culture.',
    location: 'Madurai, Tamil Nadu',
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Meenakshi_Amman_Temple_gopuram.jpg',
    color: 'from-yellow-900/70 via-yellow-800/40 to-transparent',
  },
  {
    id: 3,
    name: 'Ooty Hills',
    description: 'The Queen of Hill Stations nestled in the Nilgiris — rolling tea estates, eucalyptus groves, and misty mornings await.',
    location: 'Ooty, Tamil Nadu',
    image: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Ooty_lake.jpg',
    color: 'from-green-900/70 via-green-800/40 to-transparent',
  },
  {
    id: 4,
    name: 'Brihadeeswarar Temple',
    description: 'A UNESCO World Heritage Site standing 66 metres tall — the crown jewel of Chola dynasty craftsmanship and devotion.',
    location: 'Thanjavur, Tamil Nadu',
    image: 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Brihadeeswarar_Temple%2C_Thanjavur%2C_Tamil_Nadu%2C_India.jpg',
    color: 'from-stone-900/70 via-stone-800/40 to-transparent',
  },
  {
    id: 5,
    name: 'Mahabalipuram Shore Temple',
    description: 'Ancient rock-cut temples kissed by the Bay of Bengal. A UNESCO site that whispers stories of the mighty Pallava kings.',
    location: 'Mahabalipuram, Tamil Nadu',
    image: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Shore_Temple%2C_Mahabalipuram.jpg',
    color: 'from-blue-900/70 via-blue-800/40 to-transparent',
  },
  {
    id: 6,
    name: 'Pamban Bridge',
    description: 'India\'s first sea bridge, spanning the Palk Strait — an engineering wonder framing the sacred island of Rameswaram.',
    location: 'Rameswaram, Tamil Nadu',
    image: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Pamban_Bridge.jpg',
    color: 'from-sky-900/70 via-sky-800/40 to-transparent',
  },
  {
    id: 7,
    name: 'Kodaikanal Lake',
    description: 'A serene star-shaped lake in the heart of the Princess of Hill Stations — perfect for boating, cycling, and mist-walks.',
    location: 'Kodaikanal, Tamil Nadu',
    image: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Kodaikanal_Lake.jpg',
    color: 'from-teal-900/70 via-teal-800/40 to-transparent',
  },
  {
    id: 8,
    name: 'Yercaud Hills',
    description: 'The hidden gem of Salem district — coffee and orange orchards, gentle treks, and colonial-era heritage sites.',
    location: 'Yercaud, Tamil Nadu',
    image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1200&auto=format&fit=crop',
    color: 'from-emerald-900/70 via-emerald-800/40 to-transparent',
  },
  {
    id: 9,
    name: 'Courtallam Waterfalls',
    description: 'The Spa of South India — five main falls cascade through medicinal herb-scented forests in the Pothigai Hills.',
    location: 'Courtallam, Tamil Nadu',
    image: 'https://upload.wikimedia.org/wikipedia/commons/2/26/Courtallam_Falls.jpg',
    color: 'from-cyan-900/70 via-cyan-800/40 to-transparent',
  },
  {
    id: 10,
    name: 'Marina Beach',
    description: 'The world\'s second longest natural urban beach — 13 km of golden sands, kite-flyers, and fresh-catch delicacies.',
    location: 'Chennai, Tamil Nadu',
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Marina_Beach_4.jpg',
    color: 'from-blue-900/70 via-blue-800/40 to-transparent',
  },
  {
    id: 11,
    name: 'Hogenakkal Falls',
    description: 'The Niagara of India — the Kaveri erupts into spectacular falls through ancient carbonatite rocks in lush jungle.',
    location: 'Dharmapuri, Tamil Nadu',
    image: 'https://upload.wikimedia.org/wikipedia/commons/a/a1/Hogenakkal_falls.jpg',
    color: 'from-lime-900/70 via-lime-800/40 to-transparent',
  },
  {
    id: 12,
    name: 'Velankanni Church',
    description: 'The Lourdes of the East — a magnificent basilica that draws millions of pilgrims of all faiths every year.',
    location: 'Velankanni, Tamil Nadu',
    image: 'https://upload.wikimedia.org/wikipedia/commons/6/66/Basilica_of_Our_Lady_of_Good_Health%2C_Velankanni.jpg',
    color: 'from-white/30 via-slate-900/40 to-transparent',
  },
  {
    id: 13,
    name: 'Dhanushkodi Beach',
    description: 'A dramatic, ghost-town peninsula at the edge of India — pristine white-sand shores where the Indian Ocean meets the Bay of Bengal.',
    location: 'Dhanushkodi, Tamil Nadu',
    image: 'https://upload.wikimedia.org/wikipedia/commons/6/62/Dhanushkodi_beach.jpeg',
    color: 'from-amber-900/70 via-amber-800/40 to-transparent',
  },
  {
    id: 14,
    name: 'Chidambaram Nataraja Temple',
    description: 'One of the Pancha Bhuta Stalas — the cosmic dance of Lord Nataraja is embroidered into every inch of this ancient temple.',
    location: 'Chidambaram, Tamil Nadu',
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Chidambaram_temple.jpg',
    color: 'from-rose-900/70 via-rose-800/40 to-transparent',
  },
  {
    id: 15,
    name: 'Nilgiri Mountain Railway',
    description: 'A UNESCO heritage rack railway winding through misty tea estates and mountains — the most scenic train ride in South India.',
    location: 'Ooty–Mettupalayam, Tamil Nadu',
    image: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/The_Nilgiri_Mountain_Railway_train.jpg',
    color: 'from-indigo-900/70 via-indigo-800/40 to-transparent',
  },
]

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)

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
    const t = setInterval(next, 5000)
    return () => clearInterval(t)
  }, [next])

  const slide = tnLocations[current]

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
  }

  return (
    <div className="relative w-full h-[70vh] min-h-[500px] rounded-3xl overflow-hidden shadow-2xl" style={{ marginTop: '0' }}>
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={slide.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt={slide.name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=1200&auto=format&fit=crop' }}
          />
          {/* Gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.color}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 px-4 py-1.5 text-xs font-bold text-white mb-4">
                <MapPin className="h-3.5 w-3.5 text-orange-300" />
                {slide.location}
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-lg">
                {slide.name}
              </h1>
              <p className="mt-3 text-sm md:text-base text-white/80 max-w-2xl leading-relaxed">
                {slide.description}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 backdrop-blur border border-white/20 flex items-center justify-center text-white hover:bg-black/60 transition z-10"
        aria-label="Previous"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 backdrop-blur border border-white/20 flex items-center justify-center text-white hover:bg-black/60 transition z-10"
        aria-label="Next"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-4 right-6 flex gap-1.5 z-10 flex-wrap justify-end max-w-[200px]">
        {tnLocations.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i, i > current ? 1 : -1)}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute top-4 right-4 bg-black/40 backdrop-blur rounded-full px-3 py-1 text-xs font-bold text-white/80 z-10">
        {current + 1} / {tnLocations.length}
      </div>
    </div>
  )
}

export default HeroCarousel
