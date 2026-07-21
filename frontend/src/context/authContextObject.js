import { createContext } from 'react'

/* The context object lives apart from the provider so the provider file can
 * export only a component. A file that mixes component and non-component
 * exports silently breaks React Fast Refresh for everything in it.
 */
export const AuthContext = createContext(null)
