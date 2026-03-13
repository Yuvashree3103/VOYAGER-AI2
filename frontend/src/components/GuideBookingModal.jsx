import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Check, Star, MapPin, Languages } from 'lucide-react'

const GuideBookingModal = ({ guide, onClose }) => {
  const [step, setStep] = useState(1)
  const [travelerName, setTravelerName] = useState('')
  const [travelerEmail, setTravelerEmail] = useState('')
  const [travelerPhone, setTravelerPhone] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [days, setDays] = useState(1)
  const [processing, setProcessing] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const total = guide.pricePerDay * days

  const handleConfirm = () => {
    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      setConfirmed(true)
    }, 1800)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        {/* Guide header */}
        <div className="relative h-36">
          <img
            src={guide.photoUrl}
            alt={guide.name}
            className="w-full h-full object-cover"
            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <button onClick={onClose} className="absolute top-3 right-3 p-2 rounded-full bg-black/40 backdrop-blur text-white hover:bg-black/60 transition">
            <X className="h-4 w-4" />
          </button>
          <div className="absolute bottom-3 left-4">
            <div className="font-black text-white text-lg">{guide.name}</div>
            <div className="flex items-center gap-3 text-xs text-white/80 mt-0.5">
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{guide.city}</span>
              <span className="flex items-center gap-1"><Star className="h-3 w-3 text-amber-400" />{guide.rating}</span>
            </div>
          </div>
        </div>

        <div className="p-5">
          {!confirmed ? (
            <>
              {step === 1 && (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {guide.languages.map(l => (
                      <span key={l} className="inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 px-2.5 py-0.5 text-xs font-bold text-blue-700 dark:text-blue-300">
                        <Languages className="h-3 w-3" />{l}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-300">{guide.about || guide.specialization}</p>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Name</label>
                    <input className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm" placeholder="Full name" value={travelerName} onChange={e => setTravelerName(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email</label>
                    <input type="email" className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm" placeholder="you@email.com" value={travelerEmail} onChange={e => setTravelerEmail(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone</label>
                    <input type="tel" className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm" placeholder="+91 XXXXX XXXXX" value={travelerPhone} onChange={e => setTravelerPhone(e.target.value)} />
                  </div>
                  <button
                    onClick={() => setStep(2)}
                    disabled={!travelerName || !travelerEmail}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-black disabled:opacity-50 hover:shadow-lg transition-all text-sm"
                  >
                    Select Date →
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="font-black text-slate-900 dark:text-white">Choose Date & Duration</h3>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Start Date</label>
                    <div className="mt-1 flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <input type="date" className="flex-1 bg-transparent text-slate-900 dark:text-white text-sm focus:outline-none" min={new Date().toISOString().split('T')[0]} value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Number of Days</label>
                    <div className="flex items-center gap-3 mt-1">
                      <button onClick={() => setDays(Math.max(1, days - 1))} className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800">-</button>
                      <span className="font-black text-xl text-slate-900 dark:text-white w-6 text-center">{days}</span>
                      <button onClick={() => setDays(days + 1)} className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800">+</button>
                      <span className="text-sm text-slate-500">{days === 1 ? 'day' : 'days'}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4">
                    <div>
                      <div className="text-xs text-slate-500">Total Cost</div>
                      <div className="text-xl font-black text-blue-700 dark:text-blue-300">₹{total.toLocaleString()}</div>
                    </div>
                    <div className="text-xs text-slate-500 text-right">
                      ₹{guide.pricePerDay?.toLocaleString()} × {days} day{days > 1 ? 's' : ''}
                    </div>
                  </div>
                  <button
                    onClick={handleConfirm}
                    disabled={!selectedDate || processing}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-black disabled:opacity-50 hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    {processing ? (
                      <><div className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Confirming...</>
                    ) : 'Confirm Booking'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Guide Booked! 🎉</h3>
              <p className="text-sm text-slate-500 dark:text-slate-300">
                {guide.name} will be your guide on {selectedDate}. Confirmation sent to {travelerEmail}.
              </p>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 text-left space-y-1.5">
                <div className="flex justify-between text-sm"><span className="text-slate-500">Booking ID</span><span className="font-bold text-slate-900 dark:text-white">GD-{Math.random().toString(36).substring(2,7).toUpperCase()}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-500">Guide</span><span className="font-bold text-slate-900 dark:text-white">{guide.name}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-500">Date</span><span className="font-bold text-slate-900 dark:text-white">{selectedDate}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-500">Duration</span><span className="font-bold text-slate-900 dark:text-white">{days} day{days > 1 ? 's' : ''}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-500">Total</span><span className="font-black text-green-600">₹{total.toLocaleString()}</span></div>
              </div>
              <button onClick={onClose} className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-black text-sm">
                Done
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default GuideBookingModal
