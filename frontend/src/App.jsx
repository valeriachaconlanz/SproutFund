import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'motion/react'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import ProtectedRoute from './components/ProtectedRoute'
import PageTransition from './components/PageTransition'
import CommandPalette from './components/CommandPalette'
import ScrollToTop from './components/ScrollToTop'
import Navbar from './components/Navbar'
import Home from './pages/Home'
<<<<<<< HEAD

/* Home stays eagerly imported — it's the landing route, so lazy-loading it
   would only add a round trip before first paint. Everything else splits into
   its own chunk and loads on navigation, which is what keeps the initial
   bundle from carrying the whole app. */
const InvestmentForm = lazy(() => import('./pages/InvestmentForm'))
const Results = lazy(() => import('./pages/Results'))
const History = lazy(() => import('./pages/History'))
const Auth = lazy(() => import('./pages/Auth'))
const Glossary = lazy(() => import('./pages/Glossary'))
const MarketTips = lazy(() => import('./pages/MarketTips'))
const Profile = lazy(() => import('./pages/Profile'))
=======
import InvestmentForm from './pages/InvestmentForm'
import Results from './pages/Results'
import History from './pages/History'
import Auth from './pages/Auth'
import Glossary from './pages/Glossary'
import MarketTips from './pages/MarketTips'
import Profile from './pages/Profile'
import './App.css'
import ScrollService from "./components/ScrollService";
>>>>>>> 8e8bf30 (Rework saved plans and profile statistics)

function AppRoutes() {
  const location = useLocation()

  return (
    <>
<<<<<<< HEAD
      <ScrollToTop />
=======
      <ScrollService />
>>>>>>> 8e8bf30 (Rework saved plans and profile statistics)
      <Navbar />
      <CommandPalette />

      {/* Keyed on pathname so AnimatePresence sees each route as a distinct
          child and can play the outgoing page's exit before the next mounts.
          Suspense sits inside so a still-loading chunk doesn't tear down the
          exit animation; the fallback is a plain spacer rather than a spinner,
          since these chunks are small enough that a flash would distract. */}
      <AnimatePresence mode="wait" initial={false}>
        <Suspense fallback={<div className="route-fallback" />}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />

            <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />

            <Route path="/tips" element={<PageTransition><MarketTips /></PageTransition>} />

            <Route path="/glossary" element={<PageTransition><Glossary /></PageTransition>} />

<<<<<<< HEAD
            {/* The survey is public — anyone can build a plan; only saving it
                (on the Results page) requires an account. */}
            <Route path="/dashboard" element={<PageTransition><InvestmentForm /></PageTransition>} />
=======
        <Route path="/dashboard" element={<InvestmentForm />} />
>>>>>>> 8e8bf30 (Rework saved plans and profile statistics)

            {/* Deliberately NOT behind ProtectedRoute. Results handles the
                logged-out case itself: the save button reads "Create an account
                to save", and handleSave stashes the plan in sessionStorage
                before the auth detour so the user returns to it. Gating the
                whole route made all of that unreachable — a logged-out visitor
                waited through plan generation and got bounced to /auth without
                ever seeing it. */}
            <Route
              path="/results"
              element={
                <PageTransition>
                  <Results />
                </PageTransition>
              }
            />

            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <History />
                  </PageTransition>
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <Profile />
                  </PageTransition>
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
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
