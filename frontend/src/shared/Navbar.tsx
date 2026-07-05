import { Link, useLocation, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { useAuth } from "../services/useAuth"

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
    const { isLoggedIn, auth, logout } = useAuth()

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // Close mobile menu on route change
    useEffect(() => {
        const timer = window.setTimeout(() => setMobileOpen(false), 0)
        return () => window.clearTimeout(timer)
    }, [location.pathname])

    const goToHomeAndScroll = (targetId?: string) => {
        if (location.pathname !== "/") {
            // Navigate to home first, then scroll after render
            navigate("/")
            setTimeout(() => {
                if (targetId) {
                    const el = document.getElementById(targetId)
                    if (el) el.scrollIntoView({ behavior: "smooth" })
                } else {
                    window.scrollTo({ top: 0, behavior: "smooth" })
                }
            }, 100)
        } else {
            if (targetId) {
                const el = document.getElementById(targetId)
                if (el) el.scrollIntoView({ behavior: "smooth" })
            } else {
                window.scrollTo({ top: 0, behavior: "smooth" })
            }
        }
    }

    const isActive = (path: string) => location.pathname === path

    const navLinkStyle = (path?: string) => ({
        color: path && isActive(path) ? '#a5b4fc' : 'rgba(255,255,255,0.6)',
    })

    const handleLogout = () => {
        logout()
        navigate("/")
    }

    return (
        <nav
            className="w-full fixed top-0 z-50 flex justify-center transition-all duration-500"
            style={{
                background: scrolled
                    ? "rgba(2, 4, 9, 0.85)"
                    : "transparent",
                backdropFilter: scrolled ? "blur(20px)" : "none",
                WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
                borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "none",
            }}
        >
            <div className="w-full flex justify-between items-center px-6 sm:px-16 h-16">
                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-2 font-bold text-xl tracking-wider"
                    style={{ letterSpacing: "0.15em" }}
                >
                    <span
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-black"
                        style={{
                            background: "linear-gradient(135deg, #4f6ef7, #8b5cf6)",
                            boxShadow: "0 0 16px rgba(79,110,247,0.5)",
                        }}
                    >
                        C
                    </span>
                    <span className="gradient-text">CURA</span>
                </Link>

                {/* Mobile toggle */}
                <button
                    className="sm:hidden flex flex-col gap-1 cursor-pointer"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >
                    <span className="block w-5 h-0.5 bg-white/70 transition-all duration-300"
                        style={{ transform: mobileOpen ? 'rotate(45deg) translateY(6px)' : 'none' }} />
                    <span className="block w-5 h-0.5 bg-white/70 transition-all duration-300"
                        style={{ opacity: mobileOpen ? 0 : 1 }} />
                    <span className="block w-5 h-0.5 bg-white/70 transition-all duration-300"
                        style={{ transform: mobileOpen ? 'rotate(-45deg) translateY(-6px)' : 'none' }} />
                </button>

                {/* Desktop Nav links */}
                <div className="hidden sm:flex items-center gap-6">
                    <button
                        onClick={() => goToHomeAndScroll()}
                        className="text-sm font-medium px-1 py-1.5 transition-colors duration-200 cursor-pointer"
                        style={{ color: "rgba(255,255,255,0.6)" }}
                        onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                        onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
                    >
                        About
                    </button>
                    <button
                        onClick={() => goToHomeAndScroll("services")}
                        className="text-sm font-medium px-1 py-1.5 transition-colors duration-200 cursor-pointer"
                        style={{ color: "rgba(255,255,255,0.6)" }}
                        onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                        onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
                    >
                        Services
                    </button>
                    <Link
                        to="/products"
                        className="text-sm font-medium px-1 py-1.5 transition-colors duration-200"
                        style={navLinkStyle('/products')}
                        onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                        onMouseLeave={e => (e.currentTarget.style.color = isActive('/products') ? '#a5b4fc' : 'rgba(255,255,255,0.6)')}
                    >
                        Products
                    </Link>

                    {/* Company Portal — only visible when logged in */}
                    {isLoggedIn && (
                        <>
                            <Link
                                to="/company"
                                className="text-sm font-medium px-1 py-1.5 transition-colors duration-200"
                                style={navLinkStyle('/company')}
                                onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                                onMouseLeave={e => (e.currentTarget.style.color = isActive('/company') ? '#a5b4fc' : 'rgba(255,255,255,0.6)')}
                            >
                                {auth?.companyName || 'Company Portal'}
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="text-sm font-medium px-1 py-1.5 transition-colors duration-200 cursor-pointer"
                                style={{ color: 'rgba(255,255,255,0.4)' }}
                                onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
                                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
                            >
                                Logout
                            </button>
                        </>
                    )}

                    <Link
                        to="/demo"
                        className="text-sm font-semibold px-6 py-2.5 rounded-full btn-primary"
                        style={{ color: "#fff" }}
                    >
                        Live Demo →
                    </Link>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div
                    className="sm:hidden w-full px-6 pb-6 flex flex-col gap-3 animate-fadeInUp"
                    style={{
                        background: 'rgba(2, 4, 9, 0.95)',
                        backdropFilter: 'blur(20px)',
                        borderBottom: '1px solid rgba(255,255,255,0.07)',
                    }}
                >
                    <button
                        onClick={() => { goToHomeAndScroll(); setMobileOpen(false); }}
                        className="text-sm font-medium py-2 text-left cursor-pointer"
                        style={{ color: "rgba(255,255,255,0.6)" }}
                    >
                        About
                    </button>
                    <button
                        onClick={() => { goToHomeAndScroll("services"); setMobileOpen(false); }}
                        className="text-sm font-medium py-2 text-left cursor-pointer"
                        style={{ color: "rgba(255,255,255,0.6)" }}
                    >
                        Services
                    </button>
                    <Link
                        to="/products"
                        className="text-sm font-medium py-2 transition-colors duration-200"
                        style={navLinkStyle('/products')}
                    >
                        Products
                    </Link>
                    {isLoggedIn && (
                        <>
                            <Link
                                to="/company"
                                className="text-sm font-medium py-2 transition-colors duration-200"
                                style={navLinkStyle('/company')}
                            >
                                {auth?.companyName || 'Company Portal'}
                            </Link>
                            <button
                                onClick={() => { handleLogout(); setMobileOpen(false); }}
                                className="text-sm font-medium py-2 text-left cursor-pointer"
                                style={{ color: '#f87171' }}
                            >
                                Logout
                            </button>
                        </>
                    )}
                    <Link
                        to="/demo"
                        className="text-sm font-semibold px-6 py-2.5 rounded-full btn-primary text-center mt-2"
                        style={{ color: "#fff" }}
                    >
                        Live Demo →
                    </Link>
                </div>
            )}
        </nav>
    )
}

export default Navbar
