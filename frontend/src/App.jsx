import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import InvestmentForm from './pages/InvestmentForm'
import Results from './pages/Results'
import History from './pages/History'
import Auth from './pages/Auth'
import Glossary from './pages/Glossary'
import MarketTips from './pages/MarketTips'
import Profile from './pages/Profile'
import './App.css'
import ScrollService from "./components/ScrollService";

function AppRoutes() {
  return (
    <>
      <ScrollService />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/auth" element={<Auth />} />

        <Route path="/tips" element={<MarketTips />} />

        <Route path="/glossary" element={<Glossary />} />

        <Route path="/dashboard" element={<InvestmentForm />} />

        <Route
          path="/results"
          element={
            <ProtectedRoute>
              <Results />
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
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
  );
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
