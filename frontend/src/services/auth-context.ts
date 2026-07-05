import { createContext } from 'react'

export interface AuthState {
    companyId: string
    companyName: string
}

export interface AuthContextType {
    auth: AuthState | null
    login: (companyId: string, companyName: string) => void
    logout: () => void
    isLoggedIn: boolean
}

export const AuthContext = createContext<AuthContextType>({
    auth: null,
    login: () => {},
    logout: () => {},
    isLoggedIn: false,
})

