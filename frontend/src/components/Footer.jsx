import React from 'react'
import { Github, Instagram, Linkedin, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'

// Dark footer with quick links and contact block
const Footer = () => {
  return (
    <footer className="mt-16 bg-slate-950 text-slate-300">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-sm" style={{ background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 70%)' }}>
                ✈️
              </div>
              <div>
                <div className="text-lg font-black text-white">VoyagerAI</div>
                <div className="text-[10px] font-bold tracking-[0.22em] uppercase text-slate-400">Smart Travel</div>
              </div>
            </Link>
            <p className="mt-4 text-sm text-slate-400 leading-relaxed">
              AI-powered travel planning for Tamil Nadu—discover agencies, guides, packages, food, and smart itineraries.
            </p>
          </div>

          <div>
            <div className="text-sm font-black text-white">Quick Links</div>
            <div className="mt-4 space-y-2 text-sm">
              <Link to="/" className="block hover:text-white">Dashboard</Link>
              <Link to="/plan" className="block hover:text-white">Plan Trip</Link>
              <Link to="/deals" className="block hover:text-white">Deals</Link>
              <Link to="/translator" className="block hover:text-white">Translator</Link>
              <Link to="/advisor" className="block hover:text-white">AI Advisor</Link>
            </div>
          </div>

          <div>
            <div className="text-sm font-black text-white">Support</div>
            <div className="mt-4 space-y-2 text-sm text-slate-400">
              <div>Emergency: 100 / 108 / 101</div>
              <div>Tourist Helpline: 1363</div>
              <div>Best travel season: Nov–Feb</div>
            </div>
          </div>

          <div>
            <div className="text-sm font-black text-white">Contact</div>
            <div className="mt-4 flex items-center gap-3">
              <a href="mailto:support@voyagerai.local" className="p-2 rounded-xl bg-white/10 hover:bg-white/15 transition" aria-label="Email">
                <Mail className="h-4 w-4" />
              </a>
              <a href="https://github.com" className="p-2 rounded-xl bg-white/10 hover:bg-white/15 transition" aria-label="GitHub" target="_blank" rel="noreferrer">
                <Github className="h-4 w-4" />
              </a>
              <a href="https://instagram.com" className="p-2 rounded-xl bg-white/10 hover:bg-white/15 transition" aria-label="Instagram" target="_blank" rel="noreferrer">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://linkedin.com" className="p-2 rounded-xl bg-white/10 hover:bg-white/15 transition" aria-label="LinkedIn" target="_blank" rel="noreferrer">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
            <div className="mt-4 text-xs text-slate-500">support@voyagerai.local</div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-xs text-slate-500 flex items-center justify-between flex-wrap gap-3">
          <div>© {new Date().getFullYear()} VoyagerAI — Smart Travel Companion for Tamil Nadu</div>
          <div className="text-slate-600">Built with React + Tailwind + Framer Motion</div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

