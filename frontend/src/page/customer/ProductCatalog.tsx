import { useState, useEffect, useMemo } from 'react'
import { getCatalog } from '../../services/api'
import type { CatalogProduct } from '../../services/api'

interface GroupedProducts {
    [companyName: string]: CatalogProduct[]
}

const ProductCatalog = () => {
    const [products, setProducts] = useState<CatalogProduct[]>([])
    const [loading, setLoading] = useState(true)
    const [filterCompany, setFilterCompany] = useState<string>('all')
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getCatalog()
                setProducts(data)
            } catch (err) {
                console.error('Failed to fetch catalog:', err)
            }
            setLoading(false)
        }
        fetchProducts()
    }, [])

    const companyNames = useMemo(
        () => [...new Set(products.map(p => p.companies?.name).filter(Boolean))],
        [products],
    )

    const filteredProducts = useMemo(() => {
        const normalizedSearch = searchQuery.trim().toLowerCase()

        return products.filter(p => {
            const matchesCompany = filterCompany === 'all' || p.companies?.name === filterCompany
            const matchesSearch = normalizedSearch === '' ||
                p.name.toLowerCase().includes(normalizedSearch) ||
                p.description?.toLowerCase().includes(normalizedSearch)
            return matchesCompany && matchesSearch
        })
    }, [filterCompany, products, searchQuery])

    const grouped = useMemo(
        () => filteredProducts.reduce((acc, product) => {
            const company = product.companies?.name || 'Unknown'
            if (!acc[company]) acc[company] = []
            acc[company].push(product)
            return acc
        }, {} as GroupedProducts),
        [filteredProducts],
    )

    return (
        <section
            className="min-h-screen pt-24 pb-16 px-6"
            style={{ background: 'var(--color-bg)' }}
        >
            <div className="max-w-7xl mx-auto">
                {/* Hero Header */}
                <div className="text-center mb-12 animate-fadeInUp">
                    <div
                        className="inline-block px-4 py-1.5 rounded-full text-xs font-medium mb-4"
                        style={{
                            background: 'rgba(79,110,247,0.12)',
                            border: '1px solid rgba(79,110,247,0.2)',
                            color: '#a5b4fc',
                        }}
                    >
                        Product Catalog
                    </div>
                    <h1
                        className="text-5xl font-bold mb-4"
                        style={{
                            background: 'linear-gradient(135deg, #fff 0%, #a5b4fc 50%, #8b5cf6 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Explore Our Products
                    </h1>
                    <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--color-muted)' }}>
                        Browse products and services from our partner companies.
                        Ask our AI assistant for more details about any product!
                    </p>
                </div>

                {/* Search & Filter Bar */}
                <div
                    className="rounded-2xl p-4 mb-10 flex flex-col sm:flex-row gap-4 animate-fadeInUp delay-100"
                    style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        backdropFilter: 'blur(20px)',
                    }}
                >
                    {/* Search */}
                    <div className="relative flex-1">
                        <span
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-sm"
                            style={{ color: 'rgba(255,255,255,0.3)' }}
                        >
                            🔍
                        </span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search products..."
                            className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all duration-300"
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                color: '#fff',
                            }}
                            onFocus={e => e.currentTarget.style.borderColor = 'rgba(79,110,247,0.4)'}
                            onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                        />
                    </div>

                    {/* Company Filter */}
                    <div className="flex gap-2 flex-wrap items-center">
                        <button
                            onClick={() => setFilterCompany('all')}
                            className="px-4 py-2.5 rounded-xl text-xs font-medium transition-all duration-300 cursor-pointer"
                            style={{
                                background: filterCompany === 'all'
                                    ? 'linear-gradient(135deg, #4f6ef7, #7c3aed)'
                                    : 'rgba(255,255,255,0.05)',
                                border: filterCompany === 'all'
                                    ? 'none'
                                    : '1px solid rgba(255,255,255,0.08)',
                                boxShadow: filterCompany === 'all'
                                    ? '0 0 20px rgba(79,110,247,0.25)'
                                    : 'none',
                            }}
                        >
                            All Companies
                        </button>
                        {companyNames.map(name => (
                            <button
                                key={name}
                                onClick={() => setFilterCompany(name!)}
                                className="px-4 py-2.5 rounded-xl text-xs font-medium transition-all duration-300 cursor-pointer"
                                style={{
                                    background: filterCompany === name
                                        ? 'linear-gradient(135deg, #4f6ef7, #7c3aed)'
                                        : 'rgba(255,255,255,0.05)',
                                    border: filterCompany === name
                                        ? 'none'
                                        : '1px solid rgba(255,255,255,0.08)',
                                    boxShadow: filterCompany === name
                                        ? '0 0 20px rgba(79,110,247,0.25)'
                                        : 'none',
                                }}
                            >
                                {name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <div
                            className="w-12 h-12 rounded-full animate-spin mb-4"
                            style={{
                                border: '3px solid rgba(255,255,255,0.08)',
                                borderTopColor: '#4f6ef7',
                            }}
                        />
                        <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
                            Loading products...
                        </p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-24">
                        <div className="text-5xl mb-4">🔍</div>
                        <p className="text-lg font-medium mb-2">No products found</p>
                        <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
                            Try adjusting your search or filter
                        </p>
                    </div>
                ) : (
                    /* Product Groups by Company */
                    Object.entries(grouped).map(([companyName, companyProducts], groupIdx) => (
                        <div key={companyName} className="mb-12">
                            {/* Company Name Header */}
                            <div
                                className="flex items-center gap-3 mb-6 animate-fadeInUp"
                                style={{ animationDelay: `${groupIdx * 0.1}s` }}
                            >
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                                    style={{
                                        background: 'linear-gradient(135deg, #4f6ef7, #8b5cf6)',
                                        boxShadow: '0 0 20px rgba(79,110,247,0.3)',
                                    }}
                                >
                                    {companyName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">{companyName}</h2>
                                    <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
                                        {companyProducts.length} product{companyProducts.length !== 1 ? 's' : ''}
                                    </p>
                                </div>
                            </div>

                            {/* Product Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                {companyProducts.map((product, idx) => (
                                    <div
                                        key={product.id}
                                        className="group rounded-2xl overflow-hidden transition-all duration-500 animate-fadeInUp"
                                        style={{
                                            background: 'rgba(255,255,255,0.03)',
                                            border: '1px solid rgba(255,255,255,0.08)',
                                            animationDelay: `${(groupIdx * 0.1) + (idx * 0.05)}s`,
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.transform = 'translateY(-4px)'
                                            e.currentTarget.style.borderColor = 'rgba(79,110,247,0.3)'
                                            e.currentTarget.style.boxShadow = '0 12px 40px rgba(79,110,247,0.12)'
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.transform = 'translateY(0)'
                                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                                            e.currentTarget.style.boxShadow = 'none'
                                        }}
                                    >
                                        {/* Product Image */}
                                        <div
                                            className="w-full h-44 flex items-center justify-center overflow-hidden"
                                            style={{
                                                background: 'linear-gradient(135deg, rgba(79,110,247,0.08), rgba(139,92,246,0.08))',
                                            }}
                                        >
                                            {product.image_url ? (
                                                <img
                                                    src={product.image_url}
                                                    alt={product.name}
                                                    loading="lazy"
                                                    decoding="async"
                                                    className="w-full h-full object-cover transition-transform duration-500"
                                                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                                />
                                            ) : (
                                                <span className="text-5xl opacity-30">📦</span>
                                            )}
                                        </div>

                                        {/* Product Info */}
                                        <div className="p-5">
                                            <h3 className="font-semibold text-sm mb-1.5 truncate">
                                                {product.name}
                                            </h3>
                                            <p
                                                className="text-xs leading-relaxed mb-4"
                                                style={{
                                                    color: 'rgba(255,255,255,0.45)',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                {product.description || 'No description available'}
                                            </p>

                                            {/* Company Badge */}
                                            <div
                                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
                                                style={{
                                                    background: 'rgba(79,110,247,0.1)',
                                                    color: '#a5b4fc',
                                                }}
                                            >
                                                <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#4f6ef7' }} />
                                                {companyName}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    )
}

export default ProductCatalog
