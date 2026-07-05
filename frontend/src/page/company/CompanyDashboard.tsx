import { useState, useEffect, useCallback } from 'react'
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/api'
import type { Product } from '../../services/api'
import { useAuth } from '../../services/useAuth'

const CompanyDashboard = () => {
    const { auth } = useAuth()
    const selectedCompanyId = auth?.companyId || ''
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)

    // Form state
    const [formName, setFormName] = useState('')
    const [formDescription, setFormDescription] = useState('')
    const [formImageUrl, setFormImageUrl] = useState('')

    // Toast
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3000)
    }

    // Fetch products when company changes
    const fetchProducts = useCallback(async () => {
        if (!selectedCompanyId) return
        setLoading(true)
        try {
            const data = await getProducts(selectedCompanyId)
            setProducts(data)
        } catch (err) {
            console.error('Failed to fetch products:', err)
        }
        setLoading(false)
    }, [selectedCompanyId])

    useEffect(() => {
        void Promise.resolve().then(fetchProducts)
    }, [fetchProducts])

    const resetForm = () => {
        setFormName('')
        setFormDescription('')
        setFormImageUrl('')
        setEditingId(null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formName.trim() || !selectedCompanyId) return

        setSaving(true)

        try {
            if (editingId) {
                await updateProduct(editingId, {
                    name: formName.trim(),
                    description: formDescription.trim(),
                    image_url: formImageUrl.trim(),
                })
                showToast('Product updated successfully!')
            } else {
                await createProduct({
                    company_id: selectedCompanyId,
                    name: formName.trim(),
                    description: formDescription.trim(),
                    image_url: formImageUrl.trim(),
                })
                showToast('Product added successfully!')
            }
            const productData = {
                name: formName.trim(),
                description: formDescription.trim(),
                image_url: formImageUrl.trim(),
            }

            if (editingId) {
                setProducts(prev => prev.map(product =>
                    product.id === editingId ? { ...product, ...productData } : product,
                ))
            } else {
                fetchProducts()
            }
            resetForm()
        } catch (err) {
            showToast(editingId ? 'Failed to update product' : 'Failed to add product', 'error')
            console.error(err)
        }
        setSaving(false)
    }

    const handleEdit = (product: Product) => {
        setEditingId(product.id)
        setFormName(product.name)
        setFormDescription(product.description)
        setFormImageUrl(product.image_url || '')
    }

    const handleDelete = async (id: string) => {
        try {
            await deleteProduct(id)
            showToast('Product deleted')
            setProducts(prev => prev.filter(product => product.id !== id))
        } catch (err) {
            showToast('Failed to delete product', 'error')
            console.error(err)
        }
    }


    return (
        <section
            className="min-h-screen pt-24 pb-16 px-6"
            style={{ background: 'var(--color-bg)' }}
        >
            {/* Toast */}
            {toast && (
                <div
                    className="fixed top-20 right-6 z-50 px-5 py-3 rounded-xl text-sm font-medium animate-fadeInUp"
                    style={{
                        background: toast.type === 'success'
                            ? 'rgba(34,197,94,0.15)'
                            : 'rgba(239,68,68,0.15)',
                        border: `1px solid ${toast.type === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                        color: toast.type === 'success' ? '#4ade80' : '#f87171',
                        backdropFilter: 'blur(16px)',
                    }}
                >
                    {toast.type === 'success' ? '✓' : '✕'} {toast.message}
                </div>
            )}

            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-10 animate-fadeInUp flex items-start justify-between">
                    <div>
                        <h1
                            className="text-4xl font-bold mb-2"
                            style={{
                                background: 'linear-gradient(135deg, #fff 0%, #a5b4fc 60%, #8b5cf6 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Company Dashboard
                        </h1>
                        <p style={{ color: 'var(--color-muted)' }}>
                            Manage your products and services
                        </p>
                    </div>
                    {auth?.companyName && (
                        <div
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium mt-1"
                            style={{
                                background: 'rgba(79,110,247,0.12)',
                                border: '1px solid rgba(79,110,247,0.2)',
                                color: '#a5b4fc',
                            }}
                        >
                            🏢 {auth.companyName}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Panel */}
                    <div className="lg:col-span-1 animate-fadeInUp delay-200">
                        <div
                            className="rounded-2xl p-6"
                            style={{
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                backdropFilter: 'blur(20px)',
                            }}
                        >
                            <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
                                <span
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs"
                                    style={{
                                        background: 'linear-gradient(135deg, #4f6ef7, #8b5cf6)',
                                        boxShadow: '0 0 20px rgba(79,110,247,0.3)',
                                    }}
                                >
                                    {editingId ? '✎' : '+'}
                                </span>
                                {editingId ? 'Edit Product' : 'Add New Product'}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                        Product Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formName}
                                        onChange={e => setFormName(e.target.value)}
                                        required
                                        placeholder="e.g. Premium Widget"
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
                                        Description
                                    </label>
                                    <textarea
                                        value={formDescription}
                                        onChange={e => setFormDescription(e.target.value)}
                                        rows={3}
                                        placeholder="Describe your product..."
                                        className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none transition-all duration-300"
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
                                        Image URL
                                    </label>
                                    <input
                                        type="url"
                                        value={formImageUrl}
                                        onChange={e => setFormImageUrl(e.target.value)}
                                        placeholder="https://..."
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
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="submit"
                                        disabled={saving || !formName.trim()}
                                        className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer"
                                        style={{
                                            background: 'linear-gradient(135deg, #4f6ef7, #7c3aed)',
                                            boxShadow: '0 0 30px rgba(79,110,247,0.25)',
                                            opacity: saving || !formName.trim() ? 0.5 : 1,
                                        }}
                                    >
                                        {saving ? 'Saving...' : editingId ? 'Update Product' : 'Add Product'}
                                    </button>
                                    {editingId && (
                                        <button
                                            type="button"
                                            onClick={resetForm}
                                            className="px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer"
                                            style={{
                                                background: 'rgba(255,255,255,0.06)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Stats Card */}
                        <div
                            className="rounded-2xl p-5 mt-6"
                            style={{
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.08)',
                            }}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                                    style={{ background: 'rgba(79,110,247,0.15)' }}
                                >
                                    📊
                                </div>
                                <div>
                                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Total Products</p>
                                    <p className="text-2xl font-bold gradient-text">{products.length}</p>
                                </div>
                            </div>
                            {auth?.companyName && (
                                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                                    Company: <span style={{ color: '#a5b4fc' }}>{auth.companyName}</span>
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Product List Panel */}
                    <div className="lg:col-span-2 animate-fadeInUp delay-300">
                        <div
                            className="rounded-2xl overflow-hidden"
                            style={{
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.08)',
                            }}
                        >
                            {/* Table Header */}
                            <div
                                className="px-6 py-4 flex items-center justify-between"
                                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                            >
                                <h2 className="text-lg font-semibold">Products</h2>
                                <span
                                    className="text-xs px-3 py-1 rounded-full"
                                    style={{ background: 'rgba(79,110,247,0.15)', color: '#a5b4fc' }}
                                >
                                    {products.length} items
                                </span>
                            </div>

                            {loading ? (
                                <div className="p-12 text-center">
                                    <div
                                        className="inline-block w-8 h-8 rounded-full animate-spin"
                                        style={{
                                            border: '2px solid rgba(255,255,255,0.1)',
                                            borderTopColor: '#4f6ef7',
                                        }}
                                    />
                                    <p className="mt-3 text-sm" style={{ color: 'var(--color-muted)' }}>Loading products...</p>
                                </div>
                            ) : products.length === 0 ? (
                                <div className="p-12 text-center">
                                    <div className="text-4xl mb-3">📦</div>
                                    <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
                                        No products yet. Add your first product!
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                                    {products.map((product, idx) => (
                                        <div
                                            key={product.id}
                                            className="px-6 py-4 flex items-center gap-4 transition-all duration-300"
                                            style={{
                                                animation: `fadeInUp 0.4s ease ${idx * 0.05}s both`,
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                        >
                                            {/* Product Image / Placeholder */}
                                            <div
                                                className="w-12 h-12 rounded-xl flex items-center justify-center text-lg shrink-0 overflow-hidden"
                                                style={{
                                                    background: 'linear-gradient(135deg, rgba(79,110,247,0.15), rgba(139,92,246,0.15))',
                                                }}
                                            >
                                                {product.image_url ? (
                                                    <img
                                                        src={product.image_url}
                                                        alt={product.name}
                                                        loading="lazy"
                                                        decoding="async"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    '📦'
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm truncate">{product.name}</p>
                                                <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>
                                                    {product.description || 'No description'}
                                                </p>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2 shrink-0">
                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer"
                                                    style={{
                                                        background: 'rgba(79,110,247,0.12)',
                                                        color: '#a5b4fc',
                                                        border: '1px solid rgba(79,110,247,0.2)',
                                                    }}
                                                    onMouseEnter={e => {
                                                        e.currentTarget.style.background = 'rgba(79,110,247,0.25)'
                                                        e.currentTarget.style.borderColor = 'rgba(79,110,247,0.4)'
                                                    }}
                                                    onMouseLeave={e => {
                                                        e.currentTarget.style.background = 'rgba(79,110,247,0.12)'
                                                        e.currentTarget.style.borderColor = 'rgba(79,110,247,0.2)'
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer"
                                                    style={{
                                                        background: 'rgba(239,68,68,0.1)',
                                                        color: '#f87171',
                                                        border: '1px solid rgba(239,68,68,0.2)',
                                                    }}
                                                    onMouseEnter={e => {
                                                        e.currentTarget.style.background = 'rgba(239,68,68,0.25)'
                                                        e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'
                                                    }}
                                                    onMouseLeave={e => {
                                                        e.currentTarget.style.background = 'rgba(239,68,68,0.1)'
                                                        e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)'
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CompanyDashboard
