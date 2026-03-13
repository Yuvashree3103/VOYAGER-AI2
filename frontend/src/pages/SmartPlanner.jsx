import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, IndianRupee, Users } from 'lucide-react'
import attractionsByCity from '../data/attractions.json'
import { formatINR } from '../utils/ui'

const daysInclusive = (startDate, endDate) => {
  if (!startDate || !endDate) return 0
  const start = new Date(startDate)
  const end = new Date(endDate)
  if (Number.isNaN(start.valueOf()) || Number.isNaN(end.valueOf())) return 0
  const d = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1
  return d > 0 ? d : 0
}

const buildPlan = ({ tripName, location, startDate, endDate, travelers, budgetLimit, travelStyle, interests }) => {
  const days = daysInclusive(startDate, endDate)
  const cityAttractions = attractionsByCity[location] || []

  const cityCategories = new Set(cityAttractions.map((a) => a.category))
  const missingInterests = interests.filter((i) => !cityCategories.has(i))

  const preferred = cityAttractions.filter((a) => interests.includes(a.category))
  const pool = preferred.length ? preferred : cityAttractions

  const pick = (arr, count) => {
    const out = []
    const used = new Set()
    for (let i = 0; i < arr.length && out.length < count; i++) {
      const key = arr[i].title
      if (used.has(key)) continue
      used.add(key)
      out.push(arr[i])
    }
    return out
  }

  const times = [
    { label: 'Morning', time: '09:00 AM' },
    { label: 'Afternoon', time: '01:00 PM' },
    { label: 'Evening', time: '05:00 PM' },
  ]

  const itinerary = []
  let cursor = 0
  for (let d = 1; d <= days; d++) {
    const dayItems = []
    for (let t = 0; t < times.length; t++) {
      const item = pool[(cursor + t) % pool.length] || cityAttractions[(cursor + t) % cityAttractions.length]
      if (!item) continue
      dayItems.push({
        time: times[t].time,
        title: item.title,
        category: item.category,
        description: item.notes,
        duration: item.durationHours,
        entryFee: item.entryFee,
        cost: item.entryFee === 0 ? 'Free' : `₹${item.entryFee}`,
      })
    }
    cursor += times.length
    itinerary.push({
      day: d,
      date: new Date(new Date(startDate).getTime() + (d - 1) * 86400000).toISOString().slice(0, 10),
      theme: `Day ${d} — ${location} Exploration`,
      items: dayItems,
      total_cost: dayItems.reduce((sum, x) => sum + (x.entryFee || 0) * travelers, 0),
      total_duration_hours: dayItems.reduce((sum, x) => sum + (x.duration || 0), 0),
    })
  }

  const styleRates = {
    Budget: { stay: 900, food: 450, transport: 250 },
    Moderate: { stay: 1800, food: 800, transport: 450 },
    Luxury: { stay: 4500, food: 1400, transport: 900 },
  }

  const rate = styleRates[travelStyle] || styleRates.Moderate
  const base = (rate.stay + rate.food + rate.transport) * days * travelers
  const entryFees = itinerary.reduce((sum, d) => sum + (d.total_cost || 0), 0)
  const estimatedTotal = Math.round(base + entryFees)

  const budget = {
    total: estimatedTotal,
    per_day: Math.round(estimatedTotal / Math.max(1, days)),
    per_person: Math.round(estimatedTotal / Math.max(1, travelers)),
  }

  return {
    trip_name: tripName,
    location,
    start_date: startDate,
    end_date: endDate,
    days,
    travelers,
    budget_level: travelStyle.toLowerCase(),
    strict_budget: budgetLimit,
    budget,
    itinerary,
    insights: {
      missingInterests,
      overBudget: budgetLimit > 0 ? estimatedTotal > budgetLimit : false,
    },
  }
}

const SmartPlanner = () => {
  const locationOptions = useMemo(() => Object.keys(attractionsByCity), [])
  const interestOptions = useMemo(() => ['Temple', 'Beach', 'Heritage', 'Wildlife', 'Hill Station', 'Waterfall', 'Museum', 'Food Tour', 'Photography', 'Trekking'], [])

  const [form, setForm] = useState({
    tripName: 'My Tamil Nadu Adventure',
    location: 'Chennai',
    startDate: '',
    endDate: '',
    travelers: 2,
    budgetLimit: 20000,
    travelStyle: 'Moderate',
    interests: ['Heritage', 'Food Tour'],
  })

  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(false)
  const [expandedDay, setExpandedDay] = useState(1)

  const days = useMemo(() => daysInclusive(form.startDate, form.endDate), [form.startDate, form.endDate])

  const cityCategories = useMemo(() => new Set((attractionsByCity[form.location] || []).map((a) => a.category)), [form.location])
  const unsupportedInterests = useMemo(() => form.interests.filter((i) => !cityCategories.has(i)), [form.interests, cityCategories])

  const toggleInterest = (interest) => {
    setForm((prev) => {
      const exists = prev.interests.includes(interest)
      return { ...prev, interests: exists ? prev.interests.filter((x) => x !== interest) : [...prev.interests, interest] }
    })
  }

  const validate = () => {
    if (!form.tripName.trim()) return 'Trip Name is required'
    if (!form.location) return 'Location is required'
    if (!form.startDate) return 'Start Date is required'
    if (!form.endDate) return 'End Date is required'
    if (days <= 0) return 'End Date must be after Start Date'
    if (!form.travelers || form.travelers < 1) return 'Travelers must be at least 1'
    if (!form.budgetLimit || form.budgetLimit < 500) return 'Budget Limit must be at least ₹500'
    if (!form.interests.length) return 'Select at least one interest'
    return null
  }

  const generateItinerary = async () => {
    const err = validate()
    if (err) {
      setPlan(null)
      return
    }
    setLoading(true)
    try {
      const built = buildPlan({
        tripName: form.tripName,
        location: form.location,
        startDate: form.startDate,
        endDate: form.endDate,
        travelers: form.travelers,
        budgetLimit: Number(form.budgetLimit),
        travelStyle: form.travelStyle,
        interests: form.interests,
      })
      setPlan(built)
      setExpandedDay(1)
    } finally {
      setLoading(false)
    }
  }

  const categoryBorder = (category) => {
    const c = String(category || '').toLowerCase()
    if (c.includes('temple') || c.includes('religious')) return 'border-l-orange-500'
    if (c.includes('food')) return 'border-l-emerald-600'
    if (c.includes('museum')) return 'border-l-sky-500'
    if (c.includes('heritage')) return 'border-l-amber-500'
    if (c.includes('beach')) return 'border-l-blue-500'
    if (c.includes('hill') || c.includes('nature') || c.includes('waterfall')) return 'border-l-green-600'
    return 'border-l-slate-300'
  }

  const displayTime = (value) => String(value || '').replace('–', ' - ')

  return (
    <div className="min-h-screen bg-[#fbfaf7] px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Trip Planner</h1>
          <p className="text-slate-500 mt-1">AI-powered location-locked itinerary for Tamil Nadu</p>
        </motion.div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold text-slate-700">Trip Name</label>
              <input
                value={form.tripName}
                onChange={(e) => setForm((p) => ({ ...p, tripName: e.target.value }))}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-emerald-200"
                placeholder="My Tamil Nadu Adventure"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Location (All suggestions locked to this city)</label>
              <select
                value={form.location}
                onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-emerald-200"
              >
                {locationOptions.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">Start Date</label>
              <div className="mt-2 relative">
                <Calendar className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 pl-12 pr-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">End Date</label>
              <div className="mt-2 relative">
                <Calendar className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 pl-12 pr-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">Travelers</label>
              <div className="mt-2 relative">
                <Users className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min={1}
                  value={form.travelers}
                  onChange={(e) => setForm((p) => ({ ...p, travelers: Number(e.target.value || 1) }))}
                  className="w-full rounded-2xl border border-slate-200 pl-12 pr-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">Budget Limit (₹)</label>
              <div className="mt-2 relative">
                <IndianRupee className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min={500}
                  step={100}
                  value={form.budgetLimit}
                  onChange={(e) => setForm((p) => ({ ...p, budgetLimit: Number(e.target.value || 0) }))}
                  className="w-full rounded-2xl border border-slate-200 pl-12 pr-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold text-slate-700">Travel Style</label>
              <select
                value={form.travelStyle}
                onChange={(e) => setForm((p) => ({ ...p, travelStyle: e.target.value }))}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-emerald-200"
              >
                {['Budget', 'Moderate', 'Luxury'].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="text-xs font-black text-slate-500">How it works</div>
              <div className="mt-1 text-sm text-slate-600">
                The itinerary is generated instantly from Tamil Nadu attraction data and optimized for your interests and trip length.
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="text-sm font-semibold text-slate-700 mb-3">Interests</div>
            <div className="flex flex-wrap gap-3">
              {interestOptions.map((interest) => {
                const selected = form.interests.includes(interest)
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-4 py-2 rounded-full border text-sm font-semibold transition ${
                      selected ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {interest}
                  </button>
                )
              })}
            </div>
          </div>

          {unsupportedInterests.length > 0 && (
            <div className="mt-6 rounded-2xl border border-orange-400 bg-orange-50/50 p-5">
              <div className="text-sm text-slate-700">
                <span className="font-semibold">Note:</span> {unsupportedInterests.join(', ')} activities are limited in {form.location}.
              </div>
            </div>
          )}

          <div className="mt-8">
            <button
              type="button"
              disabled={loading}
              onClick={generateItinerary}
              className="w-full md:w-[260px] rounded-2xl px-7 py-4 font-bold text-white shadow-sm transition disabled:opacity-60"
              style={{ background: 'linear-gradient(90deg, #0f766e 0%, #d97706 100%)' }}
            >
              {loading ? 'Generating…' : 'Generate Itinerary ✨'}
            </button>
          </div>
        </div>

        {plan && (
          <div className="mt-12">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <h2 className="text-2xl font-black text-slate-900">Your Itinerary — {plan.location} Only</h2>
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 text-amber-900 px-4 py-2 font-bold">
                ₹ Est. Total: ₹{formatINR(plan?.budget?.total)} / ₹{formatINR(form.budgetLimit)}
              </div>
            </div>

            {plan.insights?.overBudget ? (
              <div className="mt-4 rounded-2xl border border-orange-300 bg-orange-50 p-4 text-sm text-slate-700">
                <span className="font-black">Budget note:</span> Estimated total may exceed your limit. Reduce days, select Budget style, or remove paid attractions.
              </div>
            ) : null}

            <div className="mt-6 space-y-6">
              {plan.itinerary?.map((day) => {
                const isOpen = expandedDay === day.day
                return (
                  <div key={day.day} className="rounded-2xl overflow-hidden border border-slate-200 bg-white">
                    <button
                      type="button"
                      onClick={() => setExpandedDay((prev) => (prev === day.day ? null : day.day))}
                      className="w-full text-left px-6 py-4 flex items-center justify-between"
                      style={{ background: 'linear-gradient(90deg, rgba(5,150,105,0.85) 0%, rgba(217,119,6,0.85) 100%)' }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-white font-black text-lg">Day {day.day}</div>
                        <div className="text-white/90 text-sm">{day.date}</div>
                        <div className="ml-2 rounded-full bg-white/20 text-white px-3 py-1 text-xs font-bold">{plan.location}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white">₹{formatINR(day.total_cost)}</div>
                        <div className="text-white text-sm font-bold">{isOpen ? '▴' : '▾'}</div>
                      </div>
                    </button>

                    {isOpen && (
                      <div className="p-6 space-y-4 bg-[#fbfaf7]">
                        {day.items?.map((item, idx) => (
                          <div
                            key={`${day.day}-${idx}`}
                            className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-5 border-l-4 ${categoryBorder(item.category)}`}
                          >
                            <div className="flex items-start justify-between gap-4 flex-wrap">
                              <div className="min-w-[120px]">
                                <div className="text-xs font-bold text-slate-500">{displayTime(item.time)}</div>
                                <div className="text-xs text-slate-400">{item.duration ? `${Math.round(item.duration)}h` : ''}</div>
                              </div>

                              <div className="flex-1 min-w-[240px]">
                                <div className="flex items-start gap-3">
                                  <div className="text-xl">{item.icon || '📍'}</div>
                                  <div>
                                    <div className="font-bold text-slate-900">{item.title}</div>
                                    {item.description && <div className="text-sm text-slate-500 mt-1">{item.description}</div>}
                                    <div className="mt-2 space-y-1 text-xs text-slate-500">
                                      {item.reachability && <div>🚌 {item.reachability}</div>}
                                      {typeof item.distance_km === 'number' && <div>📏 {item.distance_km} km</div>}
                                      {item.place && <div>📍 {item.place}</div>}
                                      <div>₹ {item.cost === 'Free' ? '0' : String(item.cost).replace('₹', '')}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="min-w-[170px] flex justify-end">
                                <button
                                  type="button"
                                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-800 hover:bg-slate-50"
                                >
                                  View Details
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SmartPlanner
