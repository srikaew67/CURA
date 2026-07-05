import { useLayoutEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { useAuth } from './services/useAuth'
import HomePage from './page/home/HomePage'
import DemoPage from './page/demo/DemoPage'
import CompanyDashboard from './page/company/CompanyDashboard'
import ProductCatalog from './page/customer/ProductCatalog'
import LoginPage from './page/login/LoginPage'
import Navbar from './shared/Navbar'

function Page() {
    const { pathname } = useLocation()
    const { isLoggedIn } = useAuth()

    useLayoutEffect(() => {
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual'
        }
        window.scrollTo(0, 0)
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0
    }, [pathname])

    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/demo" element={<DemoPage />} />
                <Route path="/products" element={<ProductCatalog />} />
                <Route path="/login" element={
                    isLoggedIn ? <Navigate to="/company" replace /> : <LoginPage />
                } />
                <Route path="/company" element={
                    isLoggedIn ? <CompanyDashboard /> : <Navigate to="/login" replace />
                } />
            </Routes>
        </>
    )
}

export default Page
