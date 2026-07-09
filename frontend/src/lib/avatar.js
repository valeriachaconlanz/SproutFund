export const AVATAR_OPTIONS = [
  { id: 'indigo', label: 'Indigo', background: 'linear-gradient(135deg, #7c3aed, #4338ca)' },
  { id: 'emerald', label: 'Emerald', background: 'linear-gradient(135deg, #10b981, #047857)' },
  { id: 'sunset', label: 'Sunset', background: 'linear-gradient(135deg, #f59e0b, #ef4444)' },
  { id: 'coral', label: 'Coral', background: 'linear-gradient(135deg, #f472b6, #ec4899)' },
  { id: 'teal', label: 'Teal', background: 'linear-gradient(135deg, #14b8a6, #0f766e)' },
  { id: 'amber', label: 'Amber', background: 'linear-gradient(135deg, #fcd34d, #f59e0b)' },
]

export function getAvatarBackground(avatarId) {
  return AVATAR_OPTIONS.find((option) => option.id === avatarId)?.background
    || AVATAR_OPTIONS[0].background
}

export function getInitials(name) {
  if (!name) return 'SF'
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')
}
