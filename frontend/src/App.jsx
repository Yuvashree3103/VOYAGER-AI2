import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import SmartPlanner from './pages/SmartPlanner'
import Deals from './pages/Deals'
import Journal from './pages/Journal'
import Emergency from './pages/Emergency'
import AIAdvisor from './pages/AIAdvisor'
import Profile from './pages/Profile'
import Translator from './pages/Translator'
import Agency from './pages/Agency'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './services/theme'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <div className="min-h-screen bg-background dark:bg-slate-950">
            <Navbar />
            <Toaster position="top-right" toastOptions={{ style: { fontFamily: 'Inter, sans-serif', fontSize: '14px' } }} />
            <main>
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/" element={<Home />} />
                  <Route path="/plan" element={<SmartPlanner />} />
                  <Route path="/deals" element={<Deals />} />
                  <Route path="/journal" element={<Journal />} />
                  <Route path="/emergency" element={<Emergency />} />
                  <Route path="/advisor" element={<AIAdvisor />} />
                  <Route path="/translator" element={<Translator />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/agencies/:id" element={<Agency />} />
                  {/* Legacy routes */}
                  <Route path="/ai-advisor" element={<Navigate to="/advisor" replace />} />
                  <Route path="/planner" element={<Navigate to="/plan" replace />} />
                  <Route path="/weather" element={<Navigate to="/" replace />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </AnimatePresence>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
