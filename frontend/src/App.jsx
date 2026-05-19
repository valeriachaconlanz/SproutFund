import { Routes, Route } from 'react-router-dom'
import InvestmentForm from './pages/InvestmentForm'
import Results from './pages/Results'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<InvestmentForm />} />
      <Route path="/results" element={<Results />} />
    </Routes>
  )
}

export default App
