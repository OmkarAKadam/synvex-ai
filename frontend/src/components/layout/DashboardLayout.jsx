import { useState, useEffect, useRef } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import {
  Brain,
  LayoutDashboard,
  Target,
  ListTodo,
  Sparkles,
  User,
  LogOut,
  Menu,
  X
} from 'lucide-react'

export default function DashboardLayout({ children, title }) {
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const closeButtonRef = useRef(null)
  const hamburgerRef = useRef(null)

  useEffect(() => {
    if (!mobileMenuOpen) return
    closeButtonRef.current?.focus()
    const handleEscape = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false)
    }
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
      hamburgerRef.current?.focus()
    }
  }, [mobileMenuOpen])

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Goals', href: '/goals', icon: Target },
    { name: 'Tasks', href: '/tasks', icon: ListTodo },
    { name: 'AI Tools', href: '/ai', icon: Sparkles },
    { name: 'Profile', href: '/profile', icon: User },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col md:flex-row">
      {/* Mobile Header / Top Navigation */}
      <header className="md:hidden flex items-center justify-between px-6 py-4 border-b border-border bg-surface sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Brain size={16} className="text-primary" />
          </div>
          <span className="font-bold text-lg tracking-tight">Synvex AI</span>
        </div>
        <button
          ref={hamburgerRef}
          onClick={() => setMobileMenuOpen(true)}
          className="p-1.5 rounded-md hover:bg-surface-elevated text-text-secondary hover:text-text transition-colors"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>
      </header>

      {/* Mobile Drawer backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-overlay/50 md:hidden z-50"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar - Fixed on desktop, Drawer on mobile */}
      <aside
        role={mobileMenuOpen ? 'dialog' : undefined}
        aria-modal={mobileMenuOpen ? 'true' : undefined}
        aria-label="Navigation sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 w-60 bg-surface border-r border-border flex flex-col transition-transform duration-200 ease-out md:translate-x-0 md:static md:h-screen
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Brain size={16} className="text-primary" />
            </div>
            <span className="font-bold text-lg tracking-tight">Synvex AI</span>
          </div>
          <button
            ref={closeButtonRef}
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden p-1.5 rounded-md hover:bg-surface-elevated text-text-secondary hover:text-text transition-colors"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1" aria-label="Main navigation">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors
                  ${isActive
                    ? 'bg-surface-elevated text-text border border-border/50'
                    : 'text-text-secondary hover:text-text hover:bg-surface-elevated/50'
                  }`}
              >
                {({ isActive }) => (
                  <>
                    <Icon size={18} className={`shrink-0 ${isActive ? 'text-primary' : 'text-text-muted'}`} />
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="border-t border-border">
          {user && (
            <div className="px-6 py-4">
              <p className="text-sm font-medium truncate text-text">{user.name}</p>
              <p className="text-xs text-text-muted truncate mt-0.5">{user.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-6 py-2.5 text-sm font-medium text-error hover:text-error hover:bg-error-50 transition-colors"
          >
            <LogOut size={18} className="shrink-0" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 md:h-screen md:overflow-y-auto">
        <div className="flex-1 px-6 py-6 max-w-[90rem] w-full mx-auto space-y-6">
          {/* Optional Page Header */}
          {title && (
            <div className="border-b border-border pb-4 mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-text">{title}</h1>
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  )
}
