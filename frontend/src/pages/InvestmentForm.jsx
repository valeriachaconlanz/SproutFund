import BudgetInput from '../components/BudgetInput'
import './InvestmentForm.css'

function InvestmentForm() {
  return (
    <div className="form-page">
      <nav className="form-page-nav">
        <span className="form-page-logo">Sprout<span>Fund</span></span>
      </nav>
      <BudgetInput />
    </div>
  )
}

export default InvestmentForm
