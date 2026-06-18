import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import BudgetInput from '../components/BudgetInput'
import ThemeToggle from '../components/ThemeToggle'
import './InvestmentForm.css'

function InvestmentForm() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/auth')
  }

  return (
    <div className="form-page">
      
      <BudgetInput />
    </div>
  )
}

export default InvestmentForm
