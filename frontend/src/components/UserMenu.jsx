import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getAvatarBackground, getInitials } from '../lib/avatar'
import './UserMenu.css'

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
  const avatarBg = getAvatarBackground(user?.avatar)

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
