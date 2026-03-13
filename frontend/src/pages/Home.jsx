import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Star, MapPin, Languages, ArrowRight, ShoppingBag, Utensils,
  Luggage, Globe, Shield, Users, BookOpen, Sparkles, MessageCircle,
  Map as MapIcon, Wallet
} from 'lucide-react'
import HeroCarousel from '../components/HeroCarousel'
import SectionHeader from '../components/SectionHeader'
import GradientButton from '../components/GradientButton'
import Footer from '../components/Footer'
import LazyImage from '../components/LazyImage'
import GuideBookingModal from '../components/GuideBookingModal'
import { PackingModal, LanguageModal, SafetyModal, ExpenseModal, JournalModal } from '../components/FeatureModals'

import agencyData from '../data/agencies.json'
import guideData from '../data/guides.json'
import foodData from '../data/foodAndShopping.json'

// ── Helpers ─────────────────────────────────────────────────────────────────
const formatINR = (n) => Number(n).toLocaleString('en-IN')

// ── Feature config ───────────────────────────────────────────────────────────
const FEATURES = [
  { id: 'packing', icon: Luggage, title: 'Smart Packing Checklist', description: 'Enter your destination and get a climate-aware packing list.', color: 'from-blue-500 to-cyan-500', modal: 'packing' },
  { id: 'language', icon: Globe, title: 'Tamil Language Helper', description: 'Essential Tamil phrases for smooth travel conversations.', color: 'from-violet-500 to-purple-600', modal: 'language' },
  { id: 'advisor', icon: Sparkles, title: 'AI Travel Advisor', description: 'Ask Tamil Nadu travel questions and get AI-powered answers.', color: 'from-orange-500 to-amber-500', link: '/advisor' },
  { id: 'safety', icon: Shield, title: 'Safety Alerts', description: 'City-specific emergency contacts and safety tips.', color: 'from-red-500 to-rose-600', modal: 'safety' },
  { id: 'journal', icon: BookOpen, title: 'Travel Journal', description: 'Write and preserve your Tamil Nadu travel memories.', color: 'from-emerald-500 to-teal-500', modal: 'journal' },
  { id: 'expense', icon: Users, title: 'Group Expense Splitter', description: 'Divide trip costs fairly among all travelers.', color: 'from-pink-500 to-fuchsia-600', modal: 'expense' },
  { id: 'plan', icon: MapIcon, title: 'AI Trip Planner', description: 'Generate day-by-day Tamil Nadu itineraries instantly.', color: 'from-indigo-500 to-blue-600', link: '/plan' },
  { id: 'budget', icon: Wallet, title: 'Budget Tracker', description: 'Track daily spending and stay within your travel budget.', color: 'from-yellow-500 to-orange-500', link: '/plan' },
  { id: 'chat', icon: MessageCircle, title: 'AI Chat', description: 'Live chat with your Voyager AI travel assistant.', color: 'from-sky-500 to-blue-600', link: '/advisor' },
  { id: 'offline', icon: Languages, title: 'Offline Phrase Guide', description: 'Basic Tamil phrases — works without internet.', color: 'from-slate-500 to-slate-700', modal: 'language' },
]

const FOOD_TABS = ['Chennai', 'Madurai', 'Ooty', 'Thanjavur', 'Kanchipuram', 'Kodaikanal', 'Thirunelveli']

// ── Cards ────────────────────────────────────────────────────────────────────
const AgencyCard = ({ agency }) => (
  <motion.div whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 280, damping: 22 }}>
    <Link
      to={`/agencies/${agency.id}`}
      className="group block overflow-hidden rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl transition-shadow"
    >
      <div className="relative h-48">
        <img
          src={agency.imageUrl}
          alt={agency.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur rounded-full px-3 py-1 text-white text-xs font-bold">
            <MapPin className="h-3 w-3 text-orange-300" />{agency.location}
          </div>
          <div className="inline-flex items-center gap-1 bg-amber-500/90 rounded-full px-2.5 py-1 text-white text-xs font-black">
            <Star className="h-3 w-3" />{agency.rating}
          </div>
        </div>
      </div>
      <div className="p-5">
        <div className="font-black text-slate-900 dark:text-white text-base leading-snug">{agency.name}</div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {agency.tourTypes.slice(0, 3).map(t => (
            <span key={t} className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 px-2.5 py-0.5 text-xs font-bold text-blue-700 dark:text-blue-300">{t}</span>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-slate-500">From <span className="font-black text-slate-900 dark:text-white">₹{formatINR(agency.startingPrice)}</span></div>
          <span className="inline-flex items-center gap-1.5 text-sm font-black text-blue-600 dark:text-blue-400 group-hover:gap-2.5 transition-all">
            View Packages <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  </motion.div>
)

const GuideCard = ({ guide, onBook }) => (
  <motion.div whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 280, damping: 22 }}>
    <div className="overflow-hidden rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl transition-shadow">
      <div className="relative h-48">
        <img
          src={guide.photoUrl}
          alt={guide.name}
          className="w-full h-full object-cover object-top"
          loading="lazy"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute bottom-3 left-3">
          <div className="font-black text-white text-base">{guide.name}</div>
          <div className="flex items-center gap-1.5 text-white/80 text-xs mt-0.5">
            <Star className="h-3 w-3 text-amber-400" />{guide.rating} · {guide.experience}
          </div>
        </div>
        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur rounded-full px-2.5 py-1 text-white text-xs font-black">
          ₹{formatINR(guide.pricePerDay)}/day
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 mb-2">
          <MapPin className="h-4 w-4 text-orange-400" />{guide.city}
        </div>
        <div className="text-sm text-slate-600 dark:text-slate-300 font-medium">{guide.specialization}</div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {guide.languages.map(l => (
            <span key={l} className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-bold text-slate-600 dark:text-slate-300">
              <Languages className="h-3 w-3" />{l}
            </span>
          ))}
        </div>
        <button
          onClick={() => onBook(guide)}
          className="mt-4 w-full py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-black hover:shadow-lg hover:shadow-blue-500/25 transition-all"
        >
          Book Guide
        </button>
      </div>
    </div>
  </motion.div>
)

const FoodCard = ({ item }) => (
  <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 260, damping: 22 }}>
    <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-md hover:shadow-xl transition-shadow">
      <div className="relative h-44 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-slate-800 dark:to-slate-700">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={e => {
            e.target.style.display = 'none'
          }}
        />
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black text-white shadow ${item.type === 'Food' ? 'bg-orange-500' : 'bg-violet-600'}`}>
            {item.type === 'Food' ? <Utensils className="h-3 w-3" /> : <ShoppingBag className="h-3 w-3" />}
            {item.type}
          </span>
        </div>
      </div>
      <div className="p-4">
        <div className="font-black text-slate-900 dark:text-white text-sm">{item.title}</div>
        <div className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.description}</div>
      </div>
    </div>
  </motion.div>
)

const FeatureCard = ({ feature, onOpen }) => {
  const Icon = feature.icon
  const handleClick = () => {
    if (feature.link) return
    if (feature.modal) onOpen(feature.modal)
  }
  const Wrapper = feature.link ? Link : 'button'
  const wrapperProps = feature.link ? { to: feature.link } : { onClick: handleClick, type: 'button' }

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 280, damping: 22 }}>
      <Wrapper
        {...wrapperProps}
        className="group block w-full text-left rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white dark:bg-slate-900 shadow-sm p-5 hover:shadow-xl transition-shadow"
      >
        <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white shadow-sm mb-4 group-hover:scale-110 transition-transform`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="font-black text-slate-900 dark:text-white text-sm">{feature.title}</div>
        <div className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{feature.description}</div>
        <div className="mt-3 text-xs font-bold text-blue-600 dark:text-blue-400 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
          {feature.modal ? 'Open Tool' : 'Go to Page'} <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </Wrapper>
    </motion.div>
  )
}

// ── Main Component ───────────────────────────────────────────────────────────
const Home = () => {
  const [foodTab, setFoodTab] = useState('Chennai')
  const [bookingGuide, setBookingGuide] = useState(null)
  const [openModal, setOpenModal] = useState(null)

  const foodItems = foodData[foodTab] || []

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* ── 1. HERO CAROUSEL ──────────────────────────────────── */}
      <div className="pt-20 px-4 md:px-6 max-w-[1440px] mx-auto">
        <HeroCarousel />

        {/* CTA buttons below hero */}
        <div className="mt-6 flex flex-wrap gap-3">
          <GradientButton as={Link} to="/plan" variant="primary">Plan Your Trip</GradientButton>
          <GradientButton as={Link} to="/advisor" variant="secondary">Ask AI Advisor</GradientButton>
        </div>
      </div>

      {/* ── 2. EXPLORE TRAVEL AGENCIES ────────────────────────── */}
      <section className="mt-20 px-4 md:px-6 max-w-[1440px] mx-auto">
        <SectionHeader
          title="Explore Travel Agencies"
          subtitle="Browse verified agencies offering curated routes across temples, beaches, heritage towns, and hill stations."
        />
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {agencyData.map(a => <AgencyCard key={a.id} agency={a} />)}
        </div>
      </section>

      {/* ── 3. LOCAL GUIDES BOOKING ───────────────────────────── */}
      <section className="mt-20 px-4 md:px-6 max-w-[1440px] mx-auto">
        <SectionHeader
          title="Book Local Guides"
          subtitle="Trusted local experts in heritage, temples, coastal routes, hills, and street food — priced transparently per day."
        />
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {guideData.map(g => <GuideCard key={g.id} guide={g} onBook={setBookingGuide} />)}
        </div>
      </section>

      {/* ── 4. WHAT TO BUY & EAT ──────────────────────────────── */}
      <section className="mt-20 px-4 md:px-6 max-w-[1440px] mx-auto">
        <SectionHeader
          title="What to Buy & Eat"
          subtitle="Each city in Tamil Nadu has iconic food and must-buy products. Explore them below."
        />
        {/* Location tabs */}
        <div className="mt-6 flex flex-wrap gap-2">
          {FOOD_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setFoodTab(tab)}
              className={`px-5 py-2 rounded-2xl text-sm font-black transition-all ${
                foodTab === tab
                  ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={foodTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5"
          >
            {foodItems.map(item => <FoodCard key={item.title} item={item} />)}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ── 5. VOYAGER AI FEATURES (LAST) ─────────────────────── */}
      <section className="mt-20 px-4 md:px-6 max-w-[1440px] mx-auto">
        <SectionHeader
          title="Voyager AI Features"
          subtitle="A complete travel toolkit built for Tamil Nadu — click any feature to use it instantly."
        />
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
          {FEATURES.map(f => (
            <FeatureCard key={f.id} feature={f} onOpen={setOpenModal} />
          ))}
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────── */}
      <section className="mt-20 px-4 md:px-6 max-w-[1440px] mx-auto mb-12">
        <div className="rounded-3xl overflow-hidden relative">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/9/9f/Meenakshi_Amman_Temple_gopuram.jpg"
            alt="Tamil Nadu"
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/70 to-violet-900/80" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
            <h2 className="text-3xl md:text-4xl font-black text-white">Ready to Explore Tamil Nadu?</h2>
            <p className="mt-2 text-white/80 max-w-lg">Generate your itinerary in seconds. Book guides, agencies and experiences — all in one place.</p>
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <Link to="/plan" className="px-8 py-3 rounded-2xl bg-white text-blue-700 font-black hover:shadow-xl transition-all text-sm">Plan My Trip</Link>
              <Link to="/advisor" className="px-8 py-3 rounded-2xl bg-white/10 border border-white/30 text-white font-black hover:bg-white/20 transition-all text-sm backdrop-blur">Ask AI</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <Footer />

      {/* ── MODALS ────────────────────────────────────────────── */}
      <AnimatePresence>
        {bookingGuide && <GuideBookingModal guide={bookingGuide} onClose={() => setBookingGuide(null)} />}
        {openModal === 'packing' && <PackingModal onClose={() => setOpenModal(null)} />}
        {openModal === 'language' && <LanguageModal onClose={() => setOpenModal(null)} />}
        {openModal === 'safety' && <SafetyModal onClose={() => setOpenModal(null)} />}
        {openModal === 'expense' && <ExpenseModal onClose={() => setOpenModal(null)} />}
        {openModal === 'journal' && <JournalModal onClose={() => setOpenModal(null)} />}
      </AnimatePresence>
    </div>
  )
}

export default Home
