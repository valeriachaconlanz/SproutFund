import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import BudgetInput from '../components/BudgetInput'
import ThemeToggle from '../components/ThemeToggle'
import UserMenu from '../components/UserMenu'
import './InvestmentForm.css'

function InvestmentForm() {
  const { user } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    navigate('/auth')
  }

  return (
    <div className="form-page">
      <nav className="form-page-nav">
        <span className="form-page-logo">Sprout<span>Fund</span></span>
        <div className="form-page-nav-right">
          {user && <span className="form-page-user">Hi, {user.name.split(' ')[0]}</span>}
          <ThemeToggle />
          <UserMenu />
        </div>
      </nav>
      <BudgetInput />
    </div>
  )
}

export default InvestmentForm
