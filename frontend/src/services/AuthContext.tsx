import { useState, useEffect, type ReactNode } from 'react'
import { AuthContext, type AuthState } from './auth-context'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [auth, setAuth] = useState<AuthState | null>(() => {
        const saved = localStorage.getItem('company_auth')
        if (saved) {
            try { return JSON.parse(saved) } catch { return null }
        }
        return null
    })

    useEffect(() => {
        if (auth) {
            localStorage.setItem('company_auth', JSON.stringify(auth))
        } else {
            localStorage.removeItem('company_auth')
        }
    }, [auth])

    const login = (companyId: string, companyName: string) => {
        setAuth({ companyId, companyName })
    }

    const logout = () => {
        setAuth(null)
    }

    return (
        <AuthContext.Provider value={{ auth, login, logout, isLoggedIn: !!auth }}>
            {children}
        </AuthContext.Provider>
    )
}
