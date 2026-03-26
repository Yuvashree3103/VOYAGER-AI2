import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './services/theme'

// Eager imports for key pages
import Home from './pages/Home'
import AIAdvisor from './pages/AIAdvisor'

// Lazy imports for all other pages (code splitting)
const SmartPlanner = lazy(() => import('./pages/SmartPlanner'))
const Deals = lazy(() => import('./pages/Deals'))
const Journal = lazy(() => import('./pages/Journal'))
const Emergency = lazy(() => import('./pages/Emergency'))
const Translator = lazy(() => import('./pages/Translator'))
const Profile = lazy(() => import('./pages/Profile'))
const Agency = lazy(() => import('./pages/Agency'))
const FestivalCalendar = lazy(() => import('./pages/FestivalCalendar'))
const BudgetTracker = lazy(() => import('./pages/BudgetTracker'))
const Checklist = lazy(() => import('./pages/Checklist'))

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#0a0f1e]">
    <div className="flex flex-col items-center gap-4">
      <div className="loader" />
      <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">Loading…</p>
    </div>
  </div>
)

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0a0f1e] transition-colors duration-300">
            <Navbar />
            <Toaster
              position="top-right"
              toastOptions={{
                style: { fontFamily: 'Outfit, Inter, sans-serif', fontSize: '14px', borderRadius: '12px' },
                success: { style: { background: '#2563EB', color: 'white' } },
                error: { style: { background: '#f43f5e', color: 'white' } },
              }}
            />
            <main>
              <Suspense fallback={<PageLoader />}>
                <AnimatePresence mode="wait">
                  <Routes>
                    {/* Core Pages */}
                    <Route path="/" element={<Home />} />
                    <Route path="/plan" element={<SmartPlanner />} />
                    <Route path="/festivals" element={<FestivalCalendar />} />
                    <Route path="/deals" element={<Deals />} />
                    <Route path="/journal" element={<Journal />} />
                    <Route path="/emergency" element={<Emergency />} />
                    <Route path="/advisor" element={<AIAdvisor />} />
                    <Route path="/translator" element={<Translator />} />
                    <Route path="/budget" element={<BudgetTracker />} />
                    <Route path="/packing" element={<Checklist />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/agencies/:id" element={<Agency />} />

                    {/* Removed pages — redirect to home */}
                    <Route path="/map" element={<Navigate to="/" replace />} />
                    <Route path="/food" element={<Navigate to="/" replace />} />
                    <Route path="/achievements" element={<Navigate to="/" replace />} />

                    {/* Legacy redirects */}
                    <Route path="/ai-advisor" element={<Navigate to="/advisor" replace />} />
                    <Route path="/planner" element={<Navigate to="/plan" replace />} />
                    <Route path="/weather" element={<Navigate to="/" replace />} />

                    {/* 404 */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </AnimatePresence>
              </Suspense>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
