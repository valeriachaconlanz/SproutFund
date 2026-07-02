import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import InvestmentForm from './pages/InvestmentForm'
import Results from './pages/Results'
import Auth from './pages/Auth'
import Glossary from './pages/Glossary'
import MarketTips from './pages/MarketTips'
import Profile from './pages/Profile'
import './App.css'

// These routes render their own nav bar (logo, theme toggle, user menu),
// so the global Navbar would just duplicate it.
const ROUTES_WITH_OWN_NAV = ['/dashboard', '/results', '/profile']

function AppRoutes() {
  const location = useLocation()
  const showGlobalNavbar = !ROUTES_WITH_OWN_NAV.includes(location.pathname)

  return (
    <>
      {showGlobalNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/auth" element={<Auth />} />

        <Route path="/tips" element={<MarketTips />} />

        <Route path="/glossary" element={<Glossary />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <InvestmentForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/results"
          element={
            <ProtectedRoute>
              <Results />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
