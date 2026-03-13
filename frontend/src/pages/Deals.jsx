import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'

const Deals = () => {
  const tripChips = useMemo(() => ['Chennai, Tamil Nadu', 'T Nagar, Chennai', 'Marina', 'Mahabalipuram'], [])
  const [query, setQuery] = useState('Chennai')
  const [tab, setTab] = useState('flights')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([])

  const search = async () => {
    setLoading(true)
    try {
      // Local dataset for instant results (replace with real API later)
      const q = (query || '').trim().toLowerCase()
      const flights = [
        { provider: 'TN Air Deals', from: 'Chennai (MAA)', to: 'Madurai (IXM)', price: 4599, stops: 0, duration: '1h 10m' },
        { provider: 'TN Air Deals', from: 'Chennai (MAA)', to: 'Coimbatore (CJB)', price: 3899, stops: 0, duration: '1h 05m' },
        { provider: 'TN Air Deals', from: 'Chennai (MAA)', to: 'Trichy (TRZ)', price: 4199, stops: 0, duration: '1h 00m' }
      ]

      const hotels = [
        { name: 'The Marina Stay', city: 'Chennai', rating: 4.4, price_per_night: 2699, distance_km: 1.6, contact: '+91-90000-00001' },
        { name: 'Heritage Courtyard', city: 'Madurai', rating: 4.3, price_per_night: 2299, distance_km: 2.4, contact: '+91-90000-00002' },
        { name: 'Nilgiris View Resort', city: 'Ooty', rating: 4.5, price_per_night: 3199, distance_km: 3.1, contact: '+91-90000-00003' }
      ]

      const activities = [
        { title: 'Mahabalipuram Heritage Walk', city: 'Mahabalipuram', price: 599, rating: 4.6, duration: '90 mins' },
        { title: 'Chennai Food Trail', city: 'Chennai', price: 799, rating: 4.7, duration: '2 hours' },
        { title: 'Ooty Tea Estate Photography', city: 'Ooty', price: 699, rating: 4.5, duration: '2 hours' }
      ]

      const byTab = tab === 'flights' ? flights : tab === 'hotels' ? hotels : activities
      const filtered = q ? byTab.filter((r) => JSON.stringify(r).toLowerCase().includes(q)) : byTab
      setResults(filtered)
    } catch (e) {
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="inline-flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-xl shadow-sm">🏷️</div>
                <div>
                  <h1 className="text-3xl font-black text-slate-900">Travel Deals</h1>
                  <p className="text-slate-500 mt-1">Real-time flight, hotel & activity deals — compare and book directly</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="text-xs font-bold text-slate-500">Your trips:</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {tripChips.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setQuery(t.split(',')[0])}
                  className="px-3 py-2 rounded-full bg-white border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  ✈️ {t}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <div className="relative">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-emerald-200"
                  placeholder="Search a destination…"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={search}
              disabled={loading}
              className="rounded-2xl px-6 py-3 font-black text-white disabled:opacity-60"
              style={{ background: 'linear-gradient(90deg, #059669 0%, #16a34a 100%)' }}
            >
              {loading ? 'Searching…' : 'Search Deals'}
            </button>
          </div>

          <div className="mt-6 flex gap-3">
            {[
              { id: 'flights', label: 'Flights' },
              { id: 'hotels', label: 'Hotels' },
              { id: 'activities', label: 'Activities' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`px-5 py-3 rounded-2xl border text-sm font-black transition ${
                  tab === t.id ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
            {results.length === 0 ? (
              <>
                <div className="mx-auto w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl text-slate-500">🏷️</div>
                <div className="mt-6 text-xl font-black text-slate-900">Find the Best Deals</div>
                <div className="mt-2 text-slate-500">Search for flights, hotels, or activities for any destination</div>
                <button
                  type="button"
                  onClick={search}
                  className="mt-6 rounded-2xl px-6 py-3 font-black text-white"
                  style={{ background: 'linear-gradient(90deg, #059669 0%, #16a34a 100%)' }}
                >
                  Show Chennai Deals
                </button>
              </>
            ) : (
              <div className="text-left">
                <div className="text-sm font-bold text-slate-500 mb-4">
                  Showing {results.length} {tab} deals for <span className="text-slate-900">{query || 'Tamil Nadu'}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.map((r, i) => (
                    <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      {tab === 'flights' ? (
                        <>
                          <div className="font-black text-slate-900">{r.provider}</div>
                          <div className="mt-1 text-sm text-slate-500">{r.from} → {r.to}</div>
                          <div className="mt-3 flex items-center justify-between">
                            <div className="text-2xl font-black text-emerald-600">₹{r.price}</div>
                            <div className="text-sm font-bold text-slate-600">{r.duration}</div>
                          </div>
                        </>
                      ) : tab === 'hotels' ? (
                        <>
                          <div className="font-black text-slate-900">{r.name}</div>
                          <div className="mt-1 text-sm text-slate-500">{r.city} • {r.distance_km} km</div>
                          <div className="mt-3 flex items-center justify-between">
                            <div className="text-2xl font-black text-emerald-600">₹{r.price_per_night}</div>
                            <div className="text-sm font-bold text-slate-600">⭐ {r.rating}</div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="font-black text-slate-900">{r.title}</div>
                          <div className="mt-1 text-sm text-slate-500">{r.city} • {r.duration}</div>
                          <div className="mt-3 flex items-center justify-between">
                            <div className="text-2xl font-black text-emerald-600">₹{r.price}</div>
                            <div className="text-sm font-bold text-slate-600">⭐ {r.rating}</div>
                          </div>
                        </>
                      )}
                      <button className="mt-4 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 font-bold text-slate-800 hover:bg-slate-100" type="button">
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Deals
