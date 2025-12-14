import React, { useState, useMemo, useRef, useEffect } from 'react'
import { ChevronDown, Check, Pencil, Trash2 } from 'lucide-react'
import { getCategories, deletePayment } from '../api'

function Transactions({ payments, onDeleted, onEditPayment }) {
    const [sortOption, setSortOption] = useState('alphabetical')
    const [open, setOpen] = useState(false)
    const [categoryById, setCategoryById] = useState({})
    const containerRef = useRef(null)

    useEffect(() => {
        const onClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false)
            }
        }
        window.addEventListener('click', onClickOutside)
        return () => window.removeEventListener('click', onClickOutside)
    }, [])

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const categories = await getCategories(0, 1000)
                const map = {}
                for (const cat of categories) {
                    map[cat.id] = { name: cat.name, color: cat.color }
                }
                setCategoryById(map)
            } catch (e) {
                console.error('Categories load error:', e)
                setCategoryById({})
            }
        }
        loadCategories()
    }, [])

    const sortedPayments = useMemo(() => {
        const copy = [...payments]
        if (sortOption === 'lowest') return copy.sort((a, b) => a.value - b.value)
        if (sortOption === 'highest') return copy.sort((a, b) => b.value - a.value)
        return copy.sort((a, b) => a.name.localeCompare(b.name))
    }, [payments, sortOption])

    const options = [
        { value: 'alphabetical', label: 'Filter' },
        { value: 'lowest', label: 'Lowest Value' },
        { value: 'highest', label: 'Highest Value' }
    ]
    const selectedLabel = options.find((opt) => opt.value === sortOption)?.label || 'Filter'

    const handleDelete = async (id) => {
        const confirmed = window.confirm('Are you sure you want to delete this payment?')
        if (confirmed) {
            try {
                const ok = await deletePayment(id)
                if (ok && typeof onDeleted === 'function') {
                    onDeleted(id)
                }
                window.location.reload()
            } catch (e) {
                console.error('Delete error:', e)
            }
        }
    }

    const handleEditClick = (id) => {
        if (typeof onEditPayment === 'function') {
            onEditPayment(id)
        } else {
            console.warn('onEditPayment prop is not provided to Transactions')
        }
    }

    const capitalize = (text) => {
        if (!text) return ''
        return text.charAt(0).toUpperCase() + text.slice(1)
    }

    return (
        <div className="bg-ocean-surface border border-ocean-border rounded-md overflow-hidden shadow-[0_0_10px_var(--color-ocean-primary)]">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 p-4 border-b border-ocean-border bg-ocean-bg/50 md:min-h-18">
                <h2 className="font-bold text-ocean-title text-center md:text-left text-xl tracking-wide">
                    Payment Records
                </h2>
                <div ref={containerRef} className="relative w-full md:w-56">
                    <button type="button" onClick={() => setOpen((prev) => !prev)} aria-haspopup="listbox" aria-expanded={open} className="w-full h-11 px-4 py-2 bg-ocean-bg border text-ocean-text rounded-md flex items-center justify-between cursor-pointer transition-all duration-200 transform hover:scale-105 hover:shadow-[0_0_8px_var(--color-ocean-primary)]">
                        <span className="truncate font-medium">{selectedLabel}</span>
                        <ChevronDown className="w-4 h-4 text-ocean-text" />
                    </button>

                    {open && (
                        <div className="absolute mt-2 w-full bg-ocean-surface/90 backdrop-blur-xl border border-ocean-border rounded-md shadow-xl ring-1 ring-black/5">
                            <ul role="listbox" className="max-h-60 overflow-auto py-1 m-0 p-0 list-none">
                                {options.map((opt) => (
                                    <DropdownItem key={opt.value} active={sortOption === opt.value} label={opt.label} onClick={() => { setSortOption(opt.value), setOpen(false) }}/>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-4">
                {sortedPayments.length === 0 ? (<p className="text-ocean-text text-center py-8">No records found.</p>) : 
                (
                    <div>
                        {sortedPayments.map((payment) => {
                            const category = categoryById[payment.category_id]
                            const categoryColor = category?.color || '#cbd5e1'
                            const categoryName = capitalize(category?.name || 'No category')

                            return (
                                <div key={payment.id} className="grid grid-cols-10 items-center py-3 px-2 border-b border-ocean-border" >
                                    <div className="h-full" style={{ backgroundColor: categoryColor }} />
                                    <div className="col-span-8 px-3">
                                        <div className="flex justify-between">
                                            <p className="text-ocean-title font-semibold text-base">
                                                {capitalize(payment.name)}
                                            </p>
                                            <p className="text-sm text-ocean-text">{payment.date}</p>
                                        </div>
                                        <div className="flex justify-between items-center mt-1">
                                            <span className="text-ocean-primary font-bold text-lg">
                                                R$ {Number(payment.value).toFixed(2)}
                                            </span>
                                            <p className="text-sm text-ocean-primary font-medium">{categoryName}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 items-center justify-center">
                                        <button className="w-9 h-9 border rounded-md flex items-center justify-center text-ocean-edit border-ocean-edit cursor-pointer transition-all duration-200 transform hover:scale-105 hover:shadow-[0_0_8px_var(--color-ocean-edit)]" title="Update" onClick={() => handleEditClick(payment.id)}>
                                            <Pencil className="w-5 h-5" />
                                        </button>
                                        <button className="w-9 h-9 border rounded-md flex items-center justify-center text-ocean-delete border-ocean-delete cursor-pointer transition-all duration-200 transform hover:scale-105 hover:shadow-[0_0_8px_var(--color-ocean-delete)]" title="Delete" onClick={() => handleDelete(payment.id)}>
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

function DropdownItem({ label, active, onClick }) {
    const baseClasses = 'w-full text-left px-4 py-2.5 text-sm border-l-2 block cursor-pointer transition-all duration-200 transform hover:scale-105 hover:shadow-[0_0_8px_var(--color-ocean-primary)]'
    const stateClasses = active ? 'border-ocean-primary bg-ocean-primary/10 text-ocean-primary font-semibold' : 'border-transparent text-ocean-text hover:text-ocean-title hover:bg-ocean-bg'
    const buttonClass = `${baseClasses} ${stateClasses}`

    return (
        <li role="option" aria-selected={active} className="m-0 p-0">
            <button type="button" onClick={onClick} className={buttonClass}>
                <div className="flex items-center justify-between">
                    <span className="truncate">{label}</span>
                    {active && <Check className="w-4 h-4 text-ocean-primary" />}
                </div>
            </button>
        </li>
    )
}

export default Transactions
