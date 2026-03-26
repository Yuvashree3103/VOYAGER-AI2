import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, MapPin, Clock, Users, Utensils, Car, Hotel, ArrowLeft, Check, ChevronRight, X } from 'lucide-react'
import allAgencies from '../data/agencies.json'
import Footer from '../components/Footer'

// Mock Payment Modal
const PaymentModal = ({ pkg, agency, onClose, onConfirm }) => {
  const [tab, setTab] = useState('upi')
  const [travelers, setTravelers] = useState(1)
  const [step, setStep] = useState(1) // 1=details, 2=payment, 3=confirmed
  const [travelerName, setTravelerName] = useState('')
  const [travelerEmail, setTravelerEmail] = useState('')
  const [travelerPhone, setTravelerPhone] = useState('')
  const [upiId, setUpiId] = useState('')
  const [cardNum, setCardNum] = useState('')
  const [processing, setProcessing] = useState(false)

  const total = pkg.price * travelers

  const handlePayment = () => {
    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      setStep(3)
    }, 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div>
            <div className="font-black text-slate-900 dark:text-white">{pkg.name}</div>
            <div className="text-sm text-slate-500">{agency.name}</div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-black text-lg text-slate-900 dark:text-white">Traveler Details</h3>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                <input className="mt-1 w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Your full name" value={travelerName} onChange={e => setTravelerName(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email</label>
                <input type="email" className="mt-1 w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="you@email.com" value={travelerEmail} onChange={e => setTravelerEmail(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone</label>
                <input type="tel" className="mt-1 w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="+91 XXXXX XXXXX" value={travelerPhone} onChange={e => setTravelerPhone(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Number of Travelers</label>
                <input type="number" min={1} max={20} className="mt-1 w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" value={travelers} onChange={e => setTravelers(Math.max(1, Number(e.target.value)))} />
              </div>
              <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/30 rounded-2xl p-4">
                <span className="font-bold text-slate-700 dark:text-slate-200">Total Amount</span>
                <span className="text-xl font-black text-blue-700 dark:text-blue-300">₹{total.toLocaleString()}</span>
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={!travelerName || !travelerEmail}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-black disabled:opacity-50 hover:shadow-lg hover:shadow-blue-500/25 transition-all"
              >
                Proceed to Payment →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-black text-lg text-slate-900 dark:text-white">Payment</h3>
              {/* Payment tabs */}
              <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
                {['upi', 'card', 'netbanking'].map(t => (
                  <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${tab === t ? 'bg-white dark:bg-slate-900 shadow text-blue-600 dark:text-blue-400' : 'text-slate-500'}`}>
                    {t === 'upi' ? 'UPI' : t === 'card' ? 'Card' : 'Net Banking'}
                  </button>
                ))}
              </div>

              {tab === 'upi' && (
                <div className="space-y-3">
                  <div className="text-sm text-slate-600 dark:text-slate-300">Enter your UPI ID</div>
                  <input className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="yourname@upi" value={upiId} onChange={e => setUpiId(e.target.value)} />
                  <div className="flex gap-3 mt-2">
                    {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map(app => (
                      <button key={app} onClick={() => setUpiId(`user@${app.toLowerCase()}`)} className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:border-blue-400 hover:text-blue-600 transition">{app}</button>
                    ))}
                  </div>
                </div>
              )}

              {tab === 'card' && (
                <div className="space-y-3">
                  <input className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Card Number" value={cardNum} onChange={e => setCardNum(e.target.value)} />
                  <div className="flex gap-3">
                    <input className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="MM/YY" />
                    <input className="w-24 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="CVV" />
                  </div>
                </div>
              )}

              {tab === 'netbanking' && (
                <div className="grid grid-cols-2 gap-2">
                  {['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'BOI'].map(bank => (
                    <button key={bank} className="py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-300 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition">{bank}</button>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/30 rounded-2xl p-4">
                <span className="font-bold text-slate-700 dark:text-slate-200">Pay Total</span>
                <span className="text-xl font-black text-blue-700 dark:text-blue-300">₹{total.toLocaleString()}</span>
              </div>

              <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-black hover:shadow-lg hover:shadow-green-500/25 transition-all flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : `Pay ₹${total.toLocaleString()}`}
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto">
                <Check className="h-9 w-9 text-green-600" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">Booking Confirmed! 🎉</h3>
              <p className="text-slate-500 dark:text-slate-300">Your booking for <strong>{pkg.name}</strong> has been confirmed. Confirmation details have been sent to {travelerEmail}.</p>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 text-left space-y-2">
                <div className="flex justify-between text-sm"><span className="text-slate-500">Booking ID</span><span className="font-bold text-slate-900 dark:text-white">VYG-{Math.random().toString(36).substring(2, 8).toUpperCase()}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-500">Package</span><span className="font-bold text-slate-900 dark:text-white">{pkg.name}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-500">Travelers</span><span className="font-bold text-slate-900 dark:text-white">{travelers}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-500">Amount Paid</span><span className="font-black text-green-600">₹{total.toLocaleString()}</span></div>
              </div>
              <button onClick={onClose} className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-black hover:shadow-lg transition-all">
                Done
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

const Agency = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [selectedPkg, setSelectedPkg] = useState(null)

  const agency = allAgencies.find(a => a.id === id)

  if (!agency) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-xl font-black text-slate-900 dark:text-white">Agency not found</div>
        <Link to="/" className="mt-4 text-blue-600">← Back to Home</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background dark:bg-slate-950">
      {/* Hero */}
      <div className="relative h-72 md:h-96 overflow-hidden" style={{ background: `linear-gradient(135deg, ${agency.brandColor || '#3b82f6'}22, ${agency.brandColor || '#3b82f6'}55)` }}>
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${agency.brandColor || '#1e40af'}, #0f172a)` }} />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="absolute inset-0 flex items-end p-6 md:p-10">
          <div className="w-full">
            <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-bold mb-4 transition">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <div className="flex items-center gap-5">
              {/* Agency Logo */}
              <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center overflow-hidden shrink-0">
                <img
                  src={agency.logoUrl}
                  alt={agency.name}
                  className="max-w-full max-h-full object-contain p-2"
                  onError={e => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
                <span style={{ display: 'none' }} className="text-xl font-black text-white">
                  {agency.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </span>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-white">{agency.name}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-4">
                  <span className="flex items-center gap-1.5 text-white/80 text-sm"><MapPin className="h-4 w-4 text-orange-300" />{agency.location}</span>
                  <span className="flex items-center gap-1.5 bg-amber-500/20 border border-amber-500/30 rounded-full px-3 py-1 text-amber-300 text-sm font-bold"><Star className="h-3.5 w-3.5" />{agency.rating}</span>
                  <span className="flex items-center gap-1.5 text-white/70 text-sm font-bold">Starting ₹{agency.startingPrice?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* About */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 mb-8">
          <h2 className="font-black text-slate-900 dark:text-white text-lg mb-2">About</h2>
          <p className="text-slate-600 dark:text-slate-300">{agency.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {agency.tourTypes.map(t => (
              <span key={t} className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 px-3 py-1 text-xs font-bold text-blue-700 dark:text-blue-300">{t}</span>
            ))}
          </div>
        </div>

        {/* Packages */}
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Available Packages</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(agency.packages_list || []).map((pkg, idx) => (
            <motion.div key={pkg.name || idx} whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 260, damping: 22 }}>
              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-xl transition-shadow">
                <div className="relative h-48 bg-gradient-to-br from-blue-100 to-violet-100 dark:from-blue-900/30 dark:to-violet-900/30 flex items-center justify-center">
                  <div className="text-center p-4">
                    <div className="text-4xl mb-2">
                      {pkg.type?.includes('Heritage') ? '🏛️' : pkg.type?.includes('Hill') ? '⛰️' : pkg.type?.includes('Beach') ? '🏖️' : pkg.type?.includes('Pilgrimage') ? '🛕' : pkg.type?.includes('Wildlife') ? '🦁' : pkg.type?.includes('Culinary') ? '🍛' : pkg.type?.includes('Honeymoon') ? '💑' : pkg.type?.includes('Budget') ? '💰' : pkg.type?.includes('Adventure') ? '🧗' : pkg.type?.includes('Premium') ? '⭐' : '✈️'}
                    </div>
                    <div className="text-sm font-bold text-slate-600 dark:text-slate-300">{pkg.type}</div>
                  </div>
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/50 rounded-full px-3 py-1 text-white text-xs font-bold backdrop-blur">
                    <Clock className="h-3 w-3" /> {pkg.duration}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-black text-slate-900 dark:text-white text-base leading-snug">{pkg.name}</h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{pkg.description}</p>

                  {/* Inclusions */}
                  {pkg.includes && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {pkg.includes.map((inc, j) => (
                        <span key={j} className="inline-flex items-center gap-1 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-2.5 py-0.5 text-xs font-bold text-green-700 dark:text-green-300">
                          ✓ {inc}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <span className="text-xl font-black text-slate-900 dark:text-white">₹{pkg.price?.toLocaleString()}</span>
                      <span className="text-xs text-slate-500 ml-1">/ person</span>
                    </div>
                    <button
                      onClick={() => setSelectedPkg(pkg)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-black hover:shadow-lg hover:shadow-blue-500/25 transition-all"
                    >
                      Book Now <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedPkg && (
          <PaymentModal
            pkg={selectedPkg}
            agency={agency}
            onClose={() => setSelectedPkg(null)}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}

export default Agency
