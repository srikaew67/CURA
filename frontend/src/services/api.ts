const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE || 'http://localhost:8080'

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    })
    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }))
        throw new Error(err.error || 'API error')
    }
    return res.json()
}

export interface Company {
    id: string
    name: string
}

export interface Product {
    id: string
    company_id: string
    name: string
    description: string
    image_url: string
}

export interface CatalogProduct extends Product {
    companies: { name: string }
}

// ── Companies ──────────────────────────────────────
export const getCompanies = () =>
    apiFetch<Company[]>('/api/companies')

// ── Products (Company Dashboard) ───────────────────
export const getProducts = (companyId: string) =>
    apiFetch<Product[]>(`/api/products?company_id=${companyId}`)

export const createProduct = (data: {
    company_id: string
    name: string
    description: string
    image_url: string
}) =>
    apiFetch<{ ok: boolean }>('/api/products', {
        method: 'POST',
        body: JSON.stringify(data),
    })

export const updateProduct = (id: string, data: {
    name: string
    description: string
    image_url: string
}) =>
    apiFetch<{ ok: boolean }>(`/api/products?id=${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    })

export const deleteProduct = (id: string) =>
    apiFetch<{ ok: boolean }>(`/api/products?id=${id}`, {
        method: 'DELETE',
    })

// ── Product Catalog (Customer View) ─────────────────
export const getCatalog = () =>
    apiFetch<CatalogProduct[]>('/api/products/catalog')

// ── Auth ────────────────────────────────────────────
export const loginCompany = (username: string, password: string) =>
    apiFetch<{ ok: boolean; company_id: string; company: string }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
    })
