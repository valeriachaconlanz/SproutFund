import { Link, useNavigate } from 'react-router-dom'
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
      <nav className="form-page-nav">
        <span className="form-page-logo">Sprout<span>Fund</span></span>
        <div className="form-page-nav-right">
          {user && <span className="form-page-user">Hi, {user.name.split(' ')[0]}</span>}
          <Link className="form-page-glossary-link" to="/glossary">
            Glossary
          </Link>
          <ThemeToggle />
          <button className="form-page-logout" onClick={handleLogout}>Sign out</button>
        </div>
      </nav>
      <BudgetInput />
    </div>
  )
}

export default InvestmentForm
