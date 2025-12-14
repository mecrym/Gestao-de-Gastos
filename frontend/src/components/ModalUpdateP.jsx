import { useEffect, useState } from 'react'
import { X, Pencil } from 'lucide-react'
import { getPaymentById, updatePayment, getCategories } from '../api'

export default function ModalUpdateP({ open, onClose, paymentId }) {
    const [name, setName] = useState('')
    const [date, setDate] = useState('')
    const [value, setValue] = useState('')
    const [categoryId, setCategoryId] = useState('')
    const [categories, setCategories] = useState([])
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [placeholders, setPlaceholders] = useState({})

    useEffect(() => {
        if (open && paymentId) { loadPayment(), loadCategories()}
    }, [open, paymentId])

    const normalizeDate = (d) => {
        try {
            if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d
            const parsed = new Date(d)
            if (isNaN(parsed.getTime())) return ''
            const yyyy = parsed.getFullYear()
            const mm = String(parsed.getMonth() + 1).padStart(2, '0')
            const dd = String(parsed.getDate()).padStart(2, '0')
            return `${yyyy}-${mm}-${dd}`
        } catch {
            return ''
        }
    }

    const loadPayment = async () => {
        try {
            const payment = await getPaymentById(paymentId)
            const normDate = normalizeDate(payment.date)
            setPlaceholders({
                name: payment.name,
                value: payment.value
            })
            setDate(normDate)
            setCategoryId(String(payment.category_id))
            setName('')
            setValue('')
        } catch (e) {
            console.error('Error loading payment:', e)
        }
    }

    const loadCategories = async () => {
        try {
            const list = await getCategories()
            setCategories(list)
        } catch (e) {
            console.error('Error loading categories:', e)
        }
    }

    if (!open) return null

    const handleSubmit = async (e) => {e.preventDefault(), setSaving(true), setError('')
        try {
            const payload = {
                name: name || placeholders.name,
                date: date || '',
                value: value ? Number(value) : placeholders.value,
                category_id: Number(categoryId)
            }
            await updatePayment(paymentId, payload), onClose(), window.location.reload()
        } catch (err) {
            setError('Error updating payment.')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-lg bg-ocean-surface border border-ocean-border rounded-md shadow-[0_0_10px_var(--color-ocean-primary)] flex flex-col">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 p-4 border-b border-ocean-border bg-ocean-bg/50 md:min-h-18">
                    <h3 className="text-ocean-title font-bold text-xl tracking-wide">Update Payment</h3>
                    <button className="p-2 text-ocean-text cursor-pointer transition-all duration-200 transform hover:scale-105 hover:shadow-[0_0_8px_var(--color-ocean-primary)]" onClick={onClose}>
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <p className="px-4 py-2 text-sm text-ocean-text">
                    Update only the fields you want to change. Others can remain as they are.
                </p>

                <form onSubmit={handleSubmit} className="p-4 space-y-4 flex-1">
                    <div>
                        <label className="block text-sm text-ocean-text mb-1">Name</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} placeholder={placeholders.name} className="w-full h-10 px-3 bg-ocean-bg border border-ocean-border text-ocean-title rounded-md"/>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm text-ocean-text mb-1">Date</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full h-10 px-3 bg-ocean-bg border border-ocean-border text-ocean-title rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-ocean-text mb-1">Value</label>
                            <input type="number"step="0.01" value={value} onChange={(e) => setValue(e.target.value)} placeholder={String(placeholders.value ?? '')} className="w-full h-10 px-3 bg-ocean-bg border border-ocean-border text-ocean-title rounded-md"/>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-ocean-text mb-1">Category</label>
                        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full h-10 px-3 bg-ocean-bg border border-ocean-border text-ocean-text rounded-md">
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {error && <p className="text-red-400 text-sm">{error}</p>}

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 h-10 bg-ocean-bg border border-ocean-border text-ocean-text rounded-md cursor-pointer transition-all duration-200 transform hover:scale-105 hover:shadow-[0_0_8px_var(--color-ocean-primary)]">
                            Cancel
                        </button>
                        <button type="submit" disabled={saving} className="flex-1 h-10 bg-ocean-primary text-ocean-bg font-semibold rounded-md cursor-pointer transition-all duration-200 transform hover:scale-105 hover:shadow-[0_0_8px_var(--color-ocean-edit)] flex items-center justify-center gap-2">
                            {saving ? 'Saving...' : (<><Pencil className="w-5 h-5" /><span>Update</span></>)}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
