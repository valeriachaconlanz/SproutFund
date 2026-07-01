import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import ProtectedRoute from './components/ProtectedRoute'
import InvestmentForm from './pages/InvestmentForm'
import Results from './pages/Results'
import Auth from './pages/Auth'
import MarketTips from './pages/MarketTips'
import Profile from './pages/Profile'
import './App.css'

function App() {
  return (
    <ThemeProvider>
    <AuthProvider>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/tips" element={<MarketTips />} />
        <Route
          path="/"
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
    </AuthProvider>
    </ThemeProvider>
  )
}

export default App
