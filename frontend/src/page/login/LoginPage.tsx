import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginCompany } from '../../services/api'
import { useAuth } from '../../services/useAuth'

const LoginPage = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { login } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const res = await loginCompany(username, password)
            login(res.company_id, res.company)
            navigate('/company')
        } catch {
            setError('Invalid username or password')
        }
        setLoading(false)
    }

    return (
        <section
            className="min-h-screen flex items-center justify-center px-6"
            style={{ background: 'var(--color-bg)' }}
        >
            <div
                className="w-full max-w-md rounded-2xl p-8 animate-fadeInUp"
                style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(20px)',
                }}
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <div
                        className="inline-flex items-center justify-center w-14 h-14 rounded-2xl text-xl font-black mb-4"
                        style={{
                            background: 'linear-gradient(135deg, #4f6ef7, #8b5cf6)',
                            boxShadow: '0 0 30px rgba(79,110,247,0.4)',
                        }}
                    >
                        🏢
                    </div>
                    <h1
                        className="text-2xl font-bold mb-1"
                        style={{
                            background: 'linear-gradient(135deg, #fff 0%, #a5b4fc 60%, #8b5cf6 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Company Portal
                    </h1>
                    <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
                        Sign in to manage your products
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div
                        className="mb-5 px-4 py-3 rounded-xl text-sm text-center"
                        style={{
                            background: 'rgba(239,68,68,0.1)',
                            border: '1px solid rgba(239,68,68,0.2)',
                            color: '#f87171',
                        }}
                    >
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                            placeholder="e.g. xiaomi"
                            autoComplete="username"
                            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-300"
                            style={{
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: '#fff',
                            }}
                            onFocus={e => e.currentTarget.style.borderColor = 'rgba(79,110,247,0.5)'}
                            onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            autoComplete="current-password"
                            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-300"
                            style={{
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: '#fff',
                            }}
                            onFocus={e => e.currentTarget.style.borderColor = 'rgba(79,110,247,0.5)'}
                            onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer"
                        style={{
                            background: 'linear-gradient(135deg, #4f6ef7, #7c3aed)',
                            boxShadow: '0 0 30px rgba(79,110,247,0.25)',
                            opacity: loading ? 0.6 : 1,
                        }}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p className="text-center text-xs mt-6" style={{ color: 'rgba(255,255,255,0.25)' }}>
                    Demo: use company name as both username & password
                </p>
            </div>
        </section>
    )
}

export default LoginPage
