import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { CalendarIcon, CurrencyRupeeIcon, MapPinIcon, MicrophoneIcon, UsersIcon } from '@heroicons/react/24/outline'
import AnimatedCard from '../components/AnimatedCard'
import GradientButton from '../components/GradientButton'
import Skeleton from '../components/Skeleton'
import { plannerAPI } from '../services/api'
import toast from 'react-hot-toast'

const cities = [
  'Chennai', 'Madurai', 'Ooty', 'Kodaikanal', 'Coimbatore', 'Thanjavur', 'Rameswaram', 'Kanyakumari', 'Trichy',
  'Mahabalipuram', 'Kanchipuram', 'Vellore', 'Tirunelveli', 'Tenkasi', 'Kumbakonam', 'Chidambaram'
]

const interestOptions = [
  'Temple', 'Beach', 'Heritage', 'Wildlife', 'Hill Station', 'Waterfall', 'Food Tour', 'Photography', 'Shopping', 'Adventure', 'Nature'
]

const TripPlanner = () => {
  const [form, setForm] = useState({
    city: 'Chennai',
    startDate: '',
    endDate: '',
    travelers: 2,
    budget: 12000,
    interests: ['Temple', 'Beach']
  })
  const [loading, setLoading] = useState(false)
  const [plan, setPlan] = useState(null)
  const [showOriginal, setShowOriginal] = useState(false)

  const canSpeak = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)

  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-IN'
    recognition.onresult = (event) => {
      const spoken = event.results[0][0].transcript
      setForm((prev) => ({ ...prev, city: spoken }))
    }
    recognition.start()
  }

  const toggleInterest = (interest) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest) ? prev.interests.filter((i) => i !== interest) : [...prev.interests, interest]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.startDate || !form.endDate) {
      toast.error('Select travel dates')
      return
    }
    setLoading(true)
    try {
      const res = await plannerAPI.planTrip({
        tripName: 'VoyagerAI Trip',
        location: form.city,
        startDate: form.startDate,
        endDate: form.endDate,
        travelers: form.travelers,
        budget: form.budget,
        interests: form.interests
      })
      if (res?.plan) {
        setPlan(res.plan)
        setShowOriginal(false)
        toast.success('AI itinerary ready')
      } else {
        toast.error('No itinerary returned')
      }
    } catch {
      toast.error('Unable to generate itinerary')
    } finally {
      setLoading(false)
    }
  }

  const itineraryToShow = useMemo(() => {
    if (!plan) return []
    if (plan.budget_warning && showOriginal && plan.original_itinerary) return plan.original_itinerary
    return plan.itinerary || []
  }, [plan, showOriginal])

  return (
    <div className="min-h-screen bg-[#f8fafc] px-6 pt-24 pb-10">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-black text-slate-900">Smart Trip Planner</h1>
          <p className="text-slate-500">Generate a day-wise Tamil Nadu itinerary with budget-aware optimizations.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
          <AnimatedCard className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">City</label>
                <div className="mt-2 flex gap-2">
                  <div className="flex-1 relative">
                    <MapPinIcon className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      value={form.city}
                      onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 px-10 py-3 text-sm font-semibold text-slate-900"
                      list="tn-cities"
                      placeholder="Choose city"
                    />
                    <datalist id="tn-cities">
                      {cities.map((city) => (
                        <option key={city} value={city} />
                      ))}
                    </datalist>
                  </div>
                  <button
                    type="button"
                    onClick={startVoiceInput}
                    disabled={!canSpeak}
                    className="w-12 rounded-2xl border border-slate-200 bg-white text-slate-600"
                  >
                    <MicrophoneIcon className="h-5 w-5 mx-auto" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Start Date</label>
                  <div className="relative mt-2">
                    <CalendarIcon className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      value={form.startDate}
                      onChange={(e) => setForm((prev) => ({ ...prev, startDate: e.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 px-10 py-3 text-sm font-semibold text-slate-900"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">End Date</label>
                  <div className="relative mt-2">
                    <CalendarIcon className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      value={form.endDate}
                      onChange={(e) => setForm((prev) => ({ ...prev, endDate: e.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 px-10 py-3 text-sm font-semibold text-slate-900"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Travelers</label>
                <div className="relative mt-2">
                  <UsersIcon className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    min={1}
                    value={form.travelers}
                    onChange={(e) => setForm((prev) => ({ ...prev, travelers: Number(e.target.value) }))}
                    className="w-full rounded-2xl border border-slate-200 px-10 py-3 text-sm font-semibold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Budget</label>
                <div className="relative mt-2">
                  <CurrencyRupeeIcon className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    min={1000}
                    step={500}
                    value={form.budget}
                    onChange={(e) => setForm((prev) => ({ ...prev, budget: Number(e.target.value) }))}
                    className="w-full rounded-2xl border border-slate-200 px-10 py-3 text-sm font-semibold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Interests</label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {interestOptions.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-3 py-2 rounded-full text-xs font-bold border ${
                        form.interests.includes(interest)
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              <GradientButton type="submit" variant="primary" className="w-full justify-center">
                Generate AI Itinerary
              </GradientButton>
            </form>
          </AnimatedCard>

          <div className="space-y-6">
            {loading && (
              <AnimatedCard className="p-6">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-40 w-full" />
                </div>
              </AnimatedCard>
            )}

            {!loading && !plan && (
              <AnimatedCard className="p-10 text-center">
                <div className="text-2xl font-black text-slate-900">Plan your Tamil Nadu adventure</div>
                <div className="mt-2 text-slate-500">Enter your dates, budget, and interests to get a personalized itinerary.</div>
              </AnimatedCard>
            )}

            {!loading && plan && (
              <>
                <AnimatedCard className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="text-xl font-black text-slate-900">{plan.trip_name}</div>
                      <div className="text-sm text-slate-500">{plan.location} • {plan.days} days • {plan.travelers} travelers</div>
                    </div>
                    <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700">
                      Budget: ₹{plan.budget?.total?.toLocaleString('en-IN')}
                    </div>
                  </div>

                  {plan.budget_warning && (
                    <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                      Budget warning: Estimated ₹{plan.estimated_budget?.total?.toLocaleString('en-IN')} exceeds your budget. Itinerary optimized with free attractions and cheaper transport.
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setShowOriginal((prev) => !prev)}
                          className="px-3 py-2 rounded-full bg-white text-amber-700 border border-amber-200 font-bold text-xs"
                        >
                          {showOriginal ? 'View Optimized Itinerary' : 'View Original Itinerary'}
                        </button>
                      </div>
                      {plan.budget_guidance?.cheaper_alternatives?.length > 0 && (
                        <div className="mt-3 text-xs text-amber-700">
                          Cheaper picks: {plan.budget_guidance.cheaper_alternatives.map((c) => c.cheaper_pick).filter(Boolean).join(' • ')}
                        </div>
                      )}
                    </div>
                  )}

                  {plan.missing_interests?.length > 0 && (
                    <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
                      <div className="font-bold text-slate-900">Interest alternatives</div>
                      <div className="mt-2 space-y-2">
                        {plan.interest_alternatives.map((alt) => (
                          <div key={alt.interest}>
                            <span className="font-bold">{alt.interest}:</span>{' '}
                            {(alt.city_suggestions || []).length ? alt.city_suggestions.join(' • ') : (alt.category_alternatives || []).join(' • ')}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {plan.budget_guidance?.free_attractions?.length > 0 && (
                    <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                      <div className="font-bold text-emerald-800">Free attractions to stay on budget</div>
                      <div className="mt-2">{plan.budget_guidance.free_attractions.map((a) => a.POI).join(' • ')}</div>
                      <div className="mt-2 text-xs text-emerald-700">{plan.budget_guidance.transport_tips?.join(' • ')}</div>
                    </div>
                  )}
                </AnimatedCard>

                {itineraryToShow.map((day) => (
                  <AnimatedCard key={day.day} className="p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="text-lg font-black text-slate-900">Day {day.day}</div>
                      <div className="text-sm text-slate-500">{day.date}</div>
                    </div>
                    <div className="mt-1 text-sm font-semibold text-blue-600">{day.theme}</div>
                    <div className="mt-4 space-y-3">
                      {day.items.map((item, idx) => (
                        <div key={`${day.day}-${idx}`} className="rounded-2xl border border-slate-200 bg-white p-4">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <div className="font-black text-slate-900">{item.time} · {item.title}</div>
                              <div className="text-xs text-slate-500">{item.category} • {item.best_time}</div>
                              <div className="mt-1 text-sm text-slate-600">{item.description}</div>
                              {item.map_url && (
                                <a className="mt-2 inline-block text-xs font-bold text-blue-600" href={item.map_url} target="_blank" rel="noreferrer">
                                  Open in Google Maps
                                </a>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="font-black text-slate-900">{item.cost}</div>
                              <div className="text-xs text-slate-500">{item.duration} hrs</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AnimatedCard>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TripPlanner

