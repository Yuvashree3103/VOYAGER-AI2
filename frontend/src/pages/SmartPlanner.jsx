import React, { useMemo, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import {
  MapPin, Users, Calendar, IndianRupee, Hotel,
  AlertTriangle, Info, ChevronDown, ChevronUp
} from 'lucide-react'
import attractionsByCity from '../data/attractions.json'

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatINR = (n) => Number(n).toLocaleString('en-IN')

const daysInclusive = (startDate, endDate) => {
  if (!startDate || !endDate) return 0
  const s = new Date(startDate), e = new Date(endDate)
  if (isNaN(s) || isNaN(e)) return 0
  const d = Math.ceil((e - s) / 86400000) + 1
  return d > 0 ? d : 0
}

// ── Nearby interest alternatives ─────────────────────────────────────────────
const NEARBY_ALTERNATIVES = {
  Waterfall: {
    Chennai: ['Hogenakkal Falls – 5 hrs', 'Kiliyur Falls (Yercaud) – 4 hrs', 'Papanasam Falls – 6 hrs'],
    Madurai: ['Suruli Falls (Theni) – 2.5 hrs', 'Kumbakarai Falls – 3 hrs', 'Courtallam – 3.5 hrs'],
    Coimbatore: ['Siruvani Falls – 1.5 hrs', 'Kovai Kutralam – 2 hrs', 'Monkey Falls – 1 hr'],
    Salem: ['Kiliyur Falls (Yercaud) – 45 mins', 'Mettur Dam – 1 hr'],
    Trichy: ['Hogenakkal – 3 hrs', 'Mukkombu – 1 hr'],
    Kanchipuram: ['Hogenakkal – 4 hrs'],
    Vellore: ['Mukkurthi – 3 hrs'],
    Thanjavur: ['Papanasam Falls – 2 hrs', 'Hogenakkal – 4 hrs'],
    Rameswaram: ['Courtallam Falls – 4 hrs'],
    default: ['Courtallam Falls – nearby', 'Hogenakkal Falls – nearby']
  },
  Wildlife: {
    Chennai: ['Vedanthangal Bird Sanctuary – 3 hrs', 'Mudumalai Tiger Reserve – 6 hrs'],
    Madurai: ['Anamalai Tiger Reserve – 3 hrs', 'Mudumalai – 4 hrs'],
    Coimbatore: ['Anamalai Tiger Reserve – 1.5 hrs', 'Mudumalai Tiger Reserve – 2 hrs'],
    Kanchipuram: ['Vedanthangal – 2 hrs'],
    Salem: ['Sathyamangalam Tiger Reserve – 2 hrs'],
    Thanjavur: ['Vedanthangal – 2 hrs', 'Point Calimere – 3 hrs'],
    default: ['Mudumalai Tiger Reserve – nearby', 'Anamalai Tiger Reserve – nearby']
  },
  'Hill Station': {
    Chennai: ['Yelagiri – 3 hrs', 'Yercaud – 4 hrs', 'Kodaikanal – 6 hrs'],
    Madurai: ['Kodaikanal – 3 hrs', 'Megamalai – 3 hrs'],
    Coimbatore: ['Ooty – 2 hrs', 'Valparai – 2 hrs', 'Kodaikanal – 4 hrs'],
    Trichy: ['Yercaud – 3 hrs', 'Kodaikanal – 4 hrs'],
    Salem: ['Yercaud – 30 mins', 'Yelagiri – 2 hrs'],
    Thanjavur: ['Yercaud – 3 hrs'],
    Kanchipuram: ['Yelagiri – 2 hrs', 'Yercaud – 3.5 hrs'],
    default: ['Ooty – nearby', 'Kodaikanal – nearby']
  },
  Trekking: {
    Chennai: ['Velliangiri Hills – 6 hrs', 'Yelagiri – 3 hrs', 'Kolli Hills – 4 hrs'],
    Madurai: ['Megamalai – 3 hrs', 'Kodaikanal Forest Trails – 3 hrs'],
    Coimbatore: ['Velliangiri Hills – 1 hr', 'Silent Valley – 2 hrs'],
    Thanjavur: ['Kolli Hills – 3 hrs'],
    default: ['Velliangiri Hills – nearby', 'Kolli Hills – nearby']
  },
  Beach: {
    Salem: ['Marina Beach (Chennai) – 4 hrs', 'VGP Beach (ECR) – 4.5 hrs'],
    Madurai: ['Rameshwaram Beach – 3 hrs', 'Pamban Island – 3 hrs'],
    Coimbatore: ['Pondicherry Beach – 4 hrs'],
    Trichy: ['Velankanni Beach – 3 hrs', 'Pamban – 3.5 hrs'],
    Kanchipuram: ['Mahabalipuram Beach – 1.5 hrs', 'Chennai Marina – 2 hrs'],
    Thanjavur: ['Velankanni Beach – 1.5 hrs', 'Kaveri Delta – 2 hrs'],
    default: ['Marina Beach – nearby', 'Rameswaram – nearby']
  }
}

const getNearbyAlternatives = (interest, city) => {
  const map = NEARBY_ALTERNATIVES[interest]
  if (!map) return []
  return map[city] || map.default || []
}

// ── Transport options ─────────────────────────────────────────────────────────
const TRANSPORT_DETAILS = {
  Chennai: [
    { mode: 'Bus', busNo: '21G', board: 'Central Station', drop: 'Marina Beach', travel: '25 mins', cost: '₹12' },
    { mode: 'Metro', busNo: 'Blue Line', board: 'Chennai Central', drop: 'Mylapore', travel: '15 mins', cost: '₹25' },
    { mode: 'Auto', busNo: '-', board: 'Hotel', drop: 'Destination', travel: '20 mins', cost: '₹80–120' },
    { mode: 'Bus', busNo: '18C', board: 'Koyambedu', drop: 'T.Nagar', travel: '30 mins', cost: '₹15' },
  ],
  Madurai: [
    { mode: 'Auto', busNo: '-', board: 'Bus Stand', drop: 'Meenakshi Temple', travel: '15 mins', cost: '₹60–80' },
    { mode: 'Bus', busNo: '5A', board: 'Central', drop: 'Temple Gate', travel: '20 mins', cost: '₹10' },
    { mode: 'Taxi', busNo: '-', board: 'Hotel', drop: 'Palace', travel: '10 mins', cost: '₹120–150' },
  ],
  Ooty: [
    { mode: 'Bus', busNo: 'TNSTC', board: 'Ooty Bus Stand', drop: 'Doddabetta', travel: '30 mins', cost: '₹15' },
    { mode: 'Taxi', busNo: '-', board: 'Hotel', drop: 'Ooty Lake', travel: '10 mins', cost: '₹150–200' },
    { mode: 'Train', busNo: 'Nilgiri Express', board: 'Ooty Station', drop: 'Coonoor', travel: '45 mins', cost: '₹30' },
  ],
  Kodaikanal: [
    { mode: 'Bus', busNo: 'TNSTC', board: 'Kodai Bus Stand', drop: 'Lake Point', travel: '10 mins', cost: '₹10' },
    { mode: 'Auto', busNo: '-', board: 'Hotel', drop: 'Coaker Walk', travel: '15 mins', cost: '₹60–100' },
  ],
  Thanjavur: [
    { mode: 'Auto', busNo: '-', board: 'Bus Stand', drop: 'Big Temple', travel: '10 mins', cost: '₹40–60' },
    { mode: 'Bus', busNo: '7', board: 'Town Bus Stand', drop: 'Palace', travel: '15 mins', cost: '₹8' },
  ],
  Kanchipuram: [
    { mode: 'Bus', busNo: '51', board: 'Chennai CMBT', drop: 'Kancheepuram', travel: '2 hrs', cost: '₹80' },
    { mode: 'Auto', busNo: '-', board: 'Bus Stand', drop: 'Kailasanathar Temple', travel: '10 mins', cost: '₹40–60' },
  ],
  Rameswaram: [
    { mode: 'Bus', busNo: 'TNSTC', board: 'Madurai', drop: 'Rameswaram', travel: '4 hrs', cost: '₹150' },
    { mode: 'Auto', busNo: '-', board: 'Hotel', drop: 'Ramanathaswamy Temple', travel: '10 mins', cost: '₹50–80' },
  ],
  Kanyakumari: [
    { mode: 'Ferry', busNo: '-', board: 'Kanyakumari Jetty', drop: 'Vivekananda Rock', travel: '10 mins', cost: '₹40' },
    { mode: 'Auto', busNo: '-', board: 'Bus Stand', drop: 'Sunrise Point', travel: '5 mins', cost: '₹30–50' },
  ],
  Mahabalipuram: [
    { mode: 'Bus', busNo: '119C', board: 'Chennai CMBT', drop: 'Mahabalipuram', travel: '1.5 hrs', cost: '₹65' },
    { mode: 'Auto', busNo: '-', board: 'Stand', drop: 'Shore Temple', travel: '5 mins', cost: '₹30–50' },
  ],
  default: [
    { mode: 'Auto', busNo: '-', board: 'Near Hotel', drop: 'Destination', travel: '15–30 mins', cost: '₹60–150' },
    { mode: 'Bus', busNo: 'Local', board: 'Bus Stand', drop: 'Destination', travel: '20–40 mins', cost: '₹10–25' },
  ]
}

// ── Budget Rates (per person per day) ─────────────────────────────────────────
const BUDGET_RATES = {
  withHotel: { stay: 1200, food: 500, transport: 300, localTravel: 200 },
  noHotel: { stay: 0, food: 400, transport: 300, localTravel: 150 }
}
const MIN_BUDGET_PER_PERSON_PER_DAY = 600

// ── Place timings by category ─────────────────────────────────────────────────
const CATEGORY_TIMINGS = {
  Temple: { open: '5:00 AM', close: '12:00 PM, 4:00 PM–9:00 PM' },
  Heritage: { open: '9:00 AM', close: '5:30 PM' },
  Museum: { open: '10:00 AM', close: '5:00 PM' },
  Beach: { open: '6:00 AM', close: '10:00 PM' },
  'Hill Station': { open: '7:00 AM', close: '6:00 PM' },
  Waterfall: { open: '7:00 AM', close: '5:30 PM' },
  Trekking: { open: '6:00 AM', close: '4:00 PM' },
  Wildlife: { open: '6:00 AM', close: '9:00 AM, 4:00 PM–6:00 PM' },
  'Food Tour': { open: '7:00 AM', close: '10:00 PM' },
  Photography: { open: '6:00 AM', close: '8:00 PM' },
}

// ── Plan builder ─────────────────────────────────────────────────────────────
const buildPlan = ({ location, startDate, endDate, travelers, budgetLimit, interests, wantHotel }) => {
  const days = daysInclusive(startDate, endDate)
  const cityAttractions = attractionsByCity[location] || []
  const cityCategories = new Set(cityAttractions.map(a => a.category))

  const missingInterests = interests.filter(i => !cityCategories.has(i))
  const availableInCity = [...cityCategories]

  const preferred = cityAttractions.filter(a => interests.includes(a.category))
  const pool = preferred.length ? preferred : cityAttractions

  const rates = wantHotel ? BUDGET_RATES.withHotel : BUDGET_RATES.noHotel
  const entryFeesTotal = pool.slice(0, days * 3).reduce((sum, a) => sum + (a.entryFee || 0), 0) * travelers
  const stayTotal = rates.stay * days * travelers
  const foodTotal = rates.food * days * travelers
  const transportTotal = rates.transport * days * travelers
  const localTravelTotal = rates.localTravel * days * travelers
  const estimatedTotal = stayTotal + foodTotal + transportTotal + localTravelTotal + entryFeesTotal

  const budgetTooLow = budgetLimit > 0 && budgetLimit < (MIN_BUDGET_PER_PERSON_PER_DAY * travelers * days)

  const SLOT_TIMES = [
    { label: 'Morning', time: '09:00 AM' },
    { label: 'Afternoon', time: '01:30 PM' },
    { label: 'Evening', time: '05:30 PM' },
  ]

  const getTransport = (city, idx) => {
    const opts = TRANSPORT_DETAILS[city] || TRANSPORT_DETAILS.default
    return opts[idx % opts.length]
  }

  const usedPlaces = new Set()
  const itinerary = []
  const themes = ['Temples & Heritage', 'Nature & Beaches', 'Markets & Food', 'Culture & Arts', 'Local Life']

  for (let d = 1; d <= days; d++) {
    const dayItems = []

    for (let t = 0; t < SLOT_TIMES.length; t++) {
      let item = null
      // Try to find unused attraction from pool
      for (let i = 0; i < pool.length * 2; i++) {
        const candidate = pool[(d * 3 + t + i) % Math.max(1, pool.length)]
        if (!usedPlaces.has(candidate.title)) {
          item = candidate
          usedPlaces.add(candidate.title)
          break
        }
      }
      // Fallback: try all attractions
      if (!item) {
        for (let i = 0; i < cityAttractions.length; i++) {
          const candidate = cityAttractions[(d * 3 + t + i) % Math.max(1, cityAttractions.length)]
          if (!usedPlaces.has(candidate.title)) {
            item = candidate
            usedPlaces.add(candidate.title)
            break
          }
        }
      }
      if (!item && cityAttractions.length > 0) {
        item = cityAttractions[(d * 3 + t) % cityAttractions.length]
      }
      if (!item) continue

      const timings = CATEGORY_TIMINGS[item.category] || { open: '9:00 AM', close: '5:00 PM' }
      const transport = getTransport(location, t)
      dayItems.push({
        timeSlot: SLOT_TIMES[t].label,
        time: SLOT_TIMES[t].time,
        title: item.title,
        category: item.category,
        description: item.notes,
        duration: item.durationHours,
        entryFee: item.entryFee,
        cost: item.entryFee === 0 ? 'Free' : `₹${item.entryFee}`,
        bestTime: item.bestTime || SLOT_TIMES[t].label,
        openTime: timings.open,
        closeTime: timings.close,
        transport,
        travelFromPrev: t === 0 ? 'From Hotel / Stay' : `~${10 + t * 5}–${20 + t * 5} mins`,
      })
    }

    const dayDate = new Date(new Date(startDate).getTime() + (d - 1) * 86400000)
    itinerary.push({
      day: d,
      date: dayDate.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }),
      theme: themes[(d - 1) % themes.length],
      items: dayItems,
      dayCost: dayItems.reduce((sum, x) => sum + (x.entryFee || 0) * travelers, 0),
    })
  }

  return {
    location, days, travelers, startDate, endDate,
    wantHotel, budgetLimit,
    budgetBreakdown: {
      stay: stayTotal,
      food: foodTotal,
      transport: transportTotal,
      localTravel: localTravelTotal,
      tickets: entryFeesTotal,
      total: estimatedTotal,
      remaining: Math.max(0, budgetLimit - estimatedTotal),
      overBudget: estimatedTotal > budgetLimit,
    },
    budgetTooLow,
    missingInterests,
    availableInCity,
    itinerary,
  }
}

// ── Component ─────────────────────────────────────────────────────────────────
const SmartPlanner = () => {
  const [searchParams] = useSearchParams()
  const locationOptions = useMemo(() => Object.keys(attractionsByCity), [])
  const interestOptions = ['Temple', 'Beach', 'Heritage', 'Wildlife', 'Hill Station', 'Waterfall', 'Museum', 'Food Tour', 'Photography', 'Trekking']

  const [form, setForm] = useState({
    location: 'Chennai',
    startDate: '',
    endDate: '',
    travelers: 2,
    budgetLimit: 20000,
    interests: ['Heritage', 'Food Tour'],
    wantHotel: true,
  })

  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(false)
  const [expandedDay, setExpandedDay] = useState(1)
  const [error, setError] = useState('')

  // Pre-fill district from URL param (e.g. from HeroCarousel "Plan Your Trip" button)
  useEffect(() => {
    const districtParam = searchParams.get('district')
    if (districtParam) {
      // Find the closest match in available location options
      const exact = locationOptions.find(l => l.toLowerCase() === districtParam.toLowerCase())
      const partial = locationOptions.find(l => l.toLowerCase().includes(districtParam.toLowerCase()))
      const match = exact || partial
      if (match) {
        setForm(f => ({ ...f, location: match }))
      }
    }
  }, [searchParams, locationOptions])

  const days = useMemo(() => daysInclusive(form.startDate, form.endDate), [form.startDate, form.endDate])

  const cityCategories = useMemo(
    () => new Set((attractionsByCity[form.location] || []).map(a => a.category)),
    [form.location]
  )
  const unsupportedInterests = useMemo(
    () => form.interests.filter(i => !cityCategories.has(i)),
    [form.interests, cityCategories]
  )

  const canGenerate = form.interests.length > 0 && unsupportedInterests.length === 0

  const setField = (key, val) => setForm(p => ({ ...p, [key]: val }))

  const toggleInterest = (interest) => {
    setForm(p => ({
      ...p,
      interests: p.interests.includes(interest)
        ? p.interests.filter(x => x !== interest)
        : [...p.interests, interest]
    }))
  }

  const validate = () => {
    if (!form.location) return 'Please select a location'
    if (!form.startDate) return 'Please select start date'
    if (!form.endDate) return 'Please select end date'
    if (days <= 0) return 'End date must be after start date'
    if (!form.travelers || form.travelers < 1) return 'At least 1 traveler required'
    if (!form.budgetLimit || form.budgetLimit < 500) return 'Budget must be at least ₹500'
    if (!form.interests.length) return 'Select at least one interest'
    if (unsupportedInterests.length > 0) return `${unsupportedInterests.join(', ')} not available in ${form.location}. Please deselect or change city.`
    return null
  }

  const generate = () => {
    const err = validate()
    if (err) { setError(err); return }
    setError('')
    setLoading(true)
    setTimeout(() => {
      const built = buildPlan({
        location: form.location,
        startDate: form.startDate,
        endDate: form.endDate,
        travelers: Number(form.travelers),
        budgetLimit: Number(form.budgetLimit),
        interests: form.interests,
        wantHotel: form.wantHotel,
      })
      setPlan(built)
      setExpandedDay(1)
      setLoading(false)
    }, 600)
  }

  const categoryColor = (cat = '') => {
    const c = cat.toLowerCase()
    if (c.includes('temple')) return 'border-l-orange-500'
    if (c.includes('food')) return 'border-l-emerald-500'
    if (c.includes('museum')) return 'border-l-sky-500'
    if (c.includes('heritage')) return 'border-l-amber-500'
    if (c.includes('beach')) return 'border-l-blue-500'
    if (c.includes('hill') || c.includes('waterfall') || c.includes('trekk')) return 'border-l-green-600'
    if (c.includes('photo')) return 'border-l-pink-500'
    if (c.includes('wildlife')) return 'border-l-teal-500'
    return 'border-l-slate-300'
  }

  return (
    <div className="min-h-screen bg-[#f0f4ff] dark:bg-slate-950 px-4 md:px-6 py-8 pt-24">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white shadow-md">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white">AI Trip Planner</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Smart Tamil Nadu itinerary · Budget-aware · Interest-based</p>
            </div>
          </div>
        </motion.div>

        {/* Form Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Location */}
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">City / Location</label>
              <div className="mt-2 relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={form.location}
                  onChange={e => setField('location', e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 pl-9 pr-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-200 bg-white dark:bg-slate-800"
                >
                  {locationOptions.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                </select>
              </div>
            </div>

            {/* Travelers */}
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Travelers</label>
              <div className="mt-2 relative">
                <Users className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number" min={1} value={form.travelers}
                  onChange={e => setField('travelers', Number(e.target.value || 1))}
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 pl-9 pr-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-200 bg-white dark:bg-slate-800"
                />
              </div>
            </div>

            {/* Start Date */}
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Start Date</label>
              <div className="mt-2 relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="date" value={form.startDate}
                  onChange={e => setField('startDate', e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 pl-9 pr-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-200 bg-white dark:bg-slate-800"
                />
              </div>
            </div>

            {/* End Date */}
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                End Date
                {days > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 text-xs font-black">
                    {days} day{days > 1 ? 's' : ''}
                  </span>
                )}
              </label>
              <div className="mt-2 relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="date" value={form.endDate}
                  onChange={e => setField('endDate', e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 pl-9 pr-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-200 bg-white dark:bg-slate-800"
                />
              </div>
            </div>

            {/* Budget */}
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Budget (₹)</label>
              <div className="mt-2 relative">
                <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number" min={500} step={500} value={form.budgetLimit}
                  onChange={e => setField('budgetLimit', Number(e.target.value || 0))}
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 pl-9 pr-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-200 bg-white dark:bg-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Hotel Stay Toggle */}
          <div className="mt-6 p-4 rounded-2xl border border-blue-100 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/20">
            <div className="flex items-center gap-3 mb-3">
              <Hotel className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="font-black text-slate-900 dark:text-white text-sm">Do you want a hotel stay?</span>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setField('wantHotel', true)}
                className={`flex-1 py-2.5 rounded-xl border font-black text-sm transition-all ${form.wantHotel ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-300'}`}
              >
                ✅ Yes — Include Hotel Stay
              </button>
              <button
                type="button"
                onClick={() => setField('wantHotel', false)}
                className={`flex-1 py-2.5 rounded-xl border font-black text-sm transition-all ${!form.wantHotel ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-300'}`}
              >
                🚌 No — Day Travel Only
              </button>
            </div>
            {!form.wantHotel && (
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 font-semibold">Day travel only — no accommodation costs included.</p>
            )}
          </div>

          {/* Interests */}
          <div className="mt-6">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Your Interests</label>
            <div className="mt-3 flex flex-wrap gap-2">
              {interestOptions.map(interest => {
                const selected = form.interests.includes(interest)
                const unavailable = !cityCategories.has(interest)
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-4 py-2 rounded-full border text-sm font-semibold transition-all
                      ${selected && !unavailable ? 'bg-blue-600 text-white border-blue-600 shadow-md' : ''}
                      ${selected && unavailable ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-400' : ''}
                      ${!selected && !unavailable ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700' : ''}
                      ${!selected && unavailable ? 'bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700 opacity-70' : ''}
                    `}
                    title={unavailable ? `Not available in ${form.location}` : interest}
                  >
                    {interest}
                    {unavailable && selected && ' ⚠️'}
                    {unavailable && !selected && ' ✗'}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Unsupported interest warning BEFORE generation */}
          {unsupportedInterests.length > 0 && (
            <div className="mt-4 rounded-2xl border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20 p-4">
              <div className="flex items-start gap-2 text-sm text-orange-800 dark:text-orange-300">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <strong>Cannot generate plan yet.</strong>
                  <div className="mt-1">
                    There are no <strong>{unsupportedInterests.join(', ')}</strong> spots in <strong>{form.location}</strong>.
                    But nearby options you can visit are:
                  </div>
                  <ul className="mt-2 space-y-1">
                    {unsupportedInterests.map(interest => (
                      <li key={interest}>
                        <span className="font-bold">{interest}:</span>{' '}
                        {getNearbyAlternatives(interest, form.location).map(alt => (
                          <span key={alt} className="inline-block rounded-full bg-orange-100 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-700 px-2 py-0.5 text-xs font-bold text-orange-700 dark:text-orange-300 mr-1 mb-1">📍 {alt}</span>
                        ))}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 font-semibold">Also available in {form.location}:</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {[...cityCategories].map(cat => (
                      <span key={cat} className="inline-flex items-center gap-1 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 px-2 py-0.5 text-xs font-bold text-blue-700 dark:text-blue-300">✓ {cat}</span>
                    ))}
                  </div>
                  <div className="mt-2 text-xs">👉 Please <strong>deselect</strong> unavailable interests or <strong>change the city</strong> to generate your plan.</div>
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-4 rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-700 dark:text-red-400 font-semibold">
              {error}
            </div>
          )}

          {/* Generate Button */}
          <div className="mt-8">
            <button
              type="button"
              disabled={loading || !canGenerate}
              onClick={generate}
              className="w-full md:w-auto rounded-2xl px-10 py-4 font-black text-white text-base shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: canGenerate ? 'linear-gradient(90deg, #1d4ed8 0%, #2563eb 60%, #3b82f6 100%)' : '#94a3b8' }}
            >
              {loading ? '✨ Generating Plan…' : canGenerate ? '✨ Generate AI Itinerary' : '⚠️ Fix Interests to Continue'}
            </button>
            {!canGenerate && form.interests.length > 0 && (
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Deselect unavailable interests (marked ⚠️) or change city.</p>
            )}
          </div>
        </div>

        {/* ─── PLAN RESULTS ─────────────────────────────────── */}
        <AnimatePresence>
          {plan && (
            <motion.div
              key="plan"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10"
            >
              {/* Itinerary header */}
              <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">Your Itinerary — {plan.location}</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{plan.days} days · {plan.travelers} traveler{plan.travelers > 1 ? 's' : ''} · {plan.wantHotel ? '🏨 Hotel stay' : '🚌 Day travel'}</p>
                </div>
              </div>

              {/* Budget too low warning */}
              {plan.budgetTooLow && (
                <div className="mb-6 rounded-2xl border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 p-5">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-black text-red-800 dark:text-red-300 text-sm">
                        This trip cannot be completed within ₹{formatINR(plan.budgetLimit)}.
                      </div>
                      <div className="text-red-700 dark:text-red-400 text-sm mt-1">
                        Minimum required: ₹{formatINR(MIN_BUDGET_PER_PERSON_PER_DAY * plan.travelers * plan.days)} for {plan.days} days ({plan.travelers} {plan.travelers > 1 ? 'people' : 'person'}).
                      </div>
                      <div className="mt-3 text-sm text-red-700 dark:text-red-400 font-semibold">Budget-friendly tips:</div>
                      <ul className="mt-1 text-sm text-red-700 dark:text-red-400 space-y-0.5 list-disc list-inside">
                        <li>Stay at budget hostels (₹400–700/night)</li>
                        <li>Use TNSTC buses instead of taxis</li>
                        <li>Focus on free attractions (temples, beaches)</li>
                        <li>Eat at local mess restaurants (₹80–150/meal)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Budget Breakdown Card */}
              <div className="mb-6 rounded-3xl border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                  <div className="font-black text-lg">💰 Budget Breakdown</div>
                  <div className="text-blue-200 text-sm">For {plan.days} days · {plan.travelers} {plan.travelers > 1 ? 'travelers' : 'traveler'}</div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    {[
                      { label: '🚌 Transport', value: plan.budgetBreakdown.transport },
                      { label: '🍛 Food', value: plan.budgetBreakdown.food },
                      { label: '🎟️ Entry Tickets', value: plan.budgetBreakdown.tickets },
                      plan.wantHotel && { label: '🏨 Stay', value: plan.budgetBreakdown.stay },
                      { label: '🛺 Local Travel', value: plan.budgetBreakdown.localTravel },
                    ].filter(Boolean).map(item => (
                      <div key={item.label} className="rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4">
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{item.label}</div>
                        <div className="text-lg font-black text-slate-900 dark:text-white mt-1">₹{formatINR(item.value)}</div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-700 pt-4 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Estimated Total</div>
                      <div className={`text-2xl font-black ${plan.budgetBreakdown.overBudget ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
                        ₹{formatINR(plan.budgetBreakdown.total)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Your Budget</div>
                      <div className="text-2xl font-black text-blue-600 dark:text-blue-400">₹{formatINR(plan.budgetLimit)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                        {plan.budgetBreakdown.overBudget ? '⚠️ Over Budget' : '✅ Remaining'}
                      </div>
                      <div className={`text-2xl font-black ${plan.budgetBreakdown.overBudget ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        {plan.budgetBreakdown.overBudget ? '-' : ''}₹{formatINR(Math.abs(plan.budgetLimit - plan.budgetBreakdown.total))}
                      </div>
                    </div>
                  </div>

                  {plan.budgetBreakdown.overBudget && !plan.budgetTooLow && (
                    <div className="mt-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3 text-sm text-amber-800 dark:text-amber-300">
                      <strong>Tip:</strong> To stay within budget, consider: reducing days, choosing free attractions, or using TNSTC buses instead of taxis.
                    </div>
                  )}
                </div>
              </div>

              {/* Day-by-day itinerary */}
              <div className="space-y-4">
                {plan.itinerary.map(day => {
                  const isOpen = expandedDay === day.day
                  return (
                    <div key={day.day} className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
                      <button
                        type="button"
                        onClick={() => setExpandedDay(prev => prev === day.day ? null : day.day)}
                        className="w-full text-left px-6 py-4 flex items-center justify-between"
                        style={{ background: 'linear-gradient(90deg, #1d4ed8 0%, #2563eb 60%, #3b82f6 100%)' }}
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-white font-black text-lg">Day {day.day}</div>
                          <div className="text-blue-200 text-sm">{day.date}</div>
                          <div className="rounded-full bg-white/20 text-white px-3 py-1 text-xs font-bold">{day.theme}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white">
                            ₹{formatINR(day.dayCost)} tickets
                          </div>
                          {isOpen ? <ChevronUp className="w-5 h-5 text-white" /> : <ChevronDown className="w-5 h-5 text-white" />}
                        </div>
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="p-5 space-y-4 bg-slate-50 dark:bg-slate-900/50">
                              {day.items.map((item, idx) => (
                                <div
                                  key={idx}
                                  className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-5 border-l-4 ${categoryColor(item.category)}`}
                                >
                                  {/* Time slot header */}
                                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                                    <div className="flex items-center gap-2">
                                      <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 text-xs font-black">
                                        {item.timeSlot === 'Morning' ? '🌅' : item.timeSlot === 'Afternoon' ? '☀️' : '🌆'} {item.timeSlot}
                                      </span>
                                      <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{item.time}</span>
                                    </div>
                                    <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1 text-xs font-bold">
                                      {item.category}
                                    </span>
                                  </div>

                                  {/* Place info */}
                                  <div className="font-black text-slate-900 dark:text-white text-base mb-1">📍 {item.title}</div>
                                  {item.description && (
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{item.description}</p>
                                  )}

                                  {/* Place details grid */}
                                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-3">
                                    <div className="rounded-xl bg-slate-50 dark:bg-slate-700 p-2 text-center">
                                      <div className="text-xs text-slate-400 dark:text-slate-500">Opens</div>
                                      <div className="text-xs font-black text-slate-700 dark:text-slate-200">{item.openTime}</div>
                                    </div>
                                    <div className="rounded-xl bg-slate-50 dark:bg-slate-700 p-2 text-center">
                                      <div className="text-xs text-slate-400 dark:text-slate-500">Closes</div>
                                      <div className="text-xs font-black text-slate-700 dark:text-slate-200">{item.closeTime}</div>
                                    </div>
                                    <div className="rounded-xl bg-slate-50 dark:bg-slate-700 p-2 text-center">
                                      <div className="text-xs text-slate-400 dark:text-slate-500">Entry</div>
                                      <div className="text-xs font-black text-slate-700 dark:text-slate-200">{item.cost}</div>
                                    </div>
                                    <div className="rounded-xl bg-slate-50 dark:bg-slate-700 p-2 text-center">
                                      <div className="text-xs text-slate-400 dark:text-slate-500">Duration</div>
                                      <div className="text-xs font-black text-slate-700 dark:text-slate-200">{item.duration}h</div>
                                    </div>
                                    <div className="rounded-xl bg-slate-50 dark:bg-slate-700 p-2 text-center">
                                      <div className="text-xs text-slate-400 dark:text-slate-500">Travel from prev</div>
                                      <div className="text-xs font-black text-slate-700 dark:text-slate-200">{item.travelFromPrev}</div>
                                    </div>
                                  </div>

                                  {/* Transport details */}
                                  {item.transport && (
                                    <div className="rounded-xl border border-blue-100 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-3">
                                      <div className="text-xs font-black text-blue-800 dark:text-blue-300 mb-2">🚌 How to Get Here</div>
                                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs text-blue-700 dark:text-blue-400">
                                        <div><span className="font-black">Mode:</span> {item.transport.mode}</div>
                                        {item.transport.busNo !== '-' && <div><span className="font-black">No.:</span> {item.transport.busNo}</div>}
                                        <div><span className="font-black">Board:</span> {item.transport.board}</div>
                                        <div><span className="font-black">Drop:</span> {item.transport.drop}</div>
                                        <div><span className="font-black">Travel:</span> {item.transport.travel} · {item.transport.cost}</div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default SmartPlanner
