import { createContext } from 'react'

/* Separate from the provider for the same Fast Refresh reason as
 * authContextObject — see the note there. */
export const ThemeContext = createContext(null)
