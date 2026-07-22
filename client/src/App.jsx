import { useState, useEffect, useRef } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import AppBar from './components/AppBar'
import Dashboard from './pages/Dashboard'
import BotBuilder from './pages/BotBuilder'
import KnowledgeBase from './pages/KnowledgeBase'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const contentRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const vp = window.visualViewport
    if (!vp || !contentRef.current) return
    const handler = () => {
      const diff = window.innerHeight - vp.height
      if (diff > 150) {
        contentRef.current.style.height = `${vp.height - 64}px`
      } else {
        contentRef.current.style.height = 'calc(100vh - 64px)'
      }
    }
    vp.addEventListener('resize', handler)
    return () => vp.removeEventListener('resize', handler)
  }, [])

  return (
    <div className="bg-background text-on-surface min-h-screen overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <AppBar onMenuToggle={() => setSidebarOpen((v) => !v)} />
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div ref={contentRef} className={`md:ml-[320px] mt-16 h-[calc(100vh-64px)] ${location.pathname.startsWith('/bot/') ? 'overflow-hidden' : 'overflow-y-auto'}`}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/bot/:id" element={<BotBuilder />} />
          <Route path="/knowledge" element={<KnowledgeBase />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  )
}
