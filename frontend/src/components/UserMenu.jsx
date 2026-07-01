import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './UserMenu.css'

const AVATAR_BACKGROUNDS = {
  indigo: 'linear-gradient(135deg, #7c3aed, #4338ca)',
  emerald: 'linear-gradient(135deg, #10b981, #047857)',
  sunset: 'linear-gradient(135deg, #f59e0b, #ef4444)',
  coral: 'linear-gradient(135deg, #f472b6, #ec4899)',
  teal: 'linear-gradient(135deg, #14b8a6, #0f766e)',
  amber: 'linear-gradient(135deg, #fcd34d, #f59e0b)',
}

function getInitials(name) {
  if (!name) return 'SF'
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')
}

function UserMenu() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const initials = getInitials(user?.name)
  const firstName = user?.name?.split(' ')[0] || 'Profile'
  const avatarBg = AVATAR_BACKGROUNDS[user?.avatar] || AVATAR_BACKGROUNDS.indigo

  return (
    <div className="user-menu" ref={ref}>
      <button
        type="button"
        className="user-menu-toggle"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <span className="user-menu-avatar" style={{ background: avatarBg }}>
          {user?.photo ? (
            <img src={user.photo} alt={`${firstName} profile`} />
          ) : (
            initials
          )}
        </span>
        <span className="user-menu-name">{firstName}</span>
      </button>

      {open && (
        <div className="user-menu-dropdown">
          <button
            type="button"
            className="user-menu-item"
            onClick={() => {
              setOpen(false)
              navigate('/profile')
            }}
          >
            Profile
          </button>
          <div className="user-menu-divider" />
          <button
            type="button"
            className="user-menu-item user-menu-signout"
            onClick={() => {
              setOpen(false)
              logout()
              navigate('/auth')
            }}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}

export default UserMenu
