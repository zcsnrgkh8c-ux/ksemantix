import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Layout = ({ children }) => {
  const { user, logout } = useAuth()
  const location = useLocation()

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/upload', label: 'Upload', icon: '📤' },
    { path: '/analysis', label: 'Analysis', icon: '🔍' },
    { path: '/sentiment', label: 'Sentiment', icon: '💡' },
    { path: '/characters', label: 'Characters', icon: '👥' },
    { path: '/visualization', label: 'Visualization', icon: '📈' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ]

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-900/50 backdrop-blur-lg border-r border-gray-800 p-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold gradient-text">K-Semantix AI</h1>
          <p className="text-xs text-gray-400 mt-1">Korean Semantic Platform</p>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                location.pathname === item.path
                  ? 'bg-primary-500/20 text-primary-400 border-l-4 border-primary-500'
                  : 'text-gray-300 hover:bg-gray-800/50'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="glass-card p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center text-white font-bold">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{user?.username}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}

export default Layout
