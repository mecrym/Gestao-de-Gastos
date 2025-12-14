import { useEffect, useState, useRef } from 'react'
import { X, Pencil, ChevronDown, Check, Trash2 } from 'lucide-react'
import { getCategories, getCategoryById, updateCategory, deleteCategory } from '../api'
import { HexColorPicker } from 'react-colorful'

export default function ModalUpdateC({ open, onClose }) {
    const [categories, setCategories] = useState([])
    const [selectedCategoryId, setSelectedCategoryId] = useState('')
    const [selectedCategoryName, setSelectedCategoryName] = useState('')

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [color, setColor] = useState('')
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [placeholders, setPlaceholders] = useState({})

    const [openDropdown, setOpenDropdown] = useState(false)
    const dropdownRef = useRef(null)

    useEffect(() => {
        if (open) {
            loadCategories(), resetFields()
        }
    }, [open])

    useEffect(() => {
        const onClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpenDropdown(false)
            }
        }
        window.addEventListener('click', onClickOutside)
        return () => window.removeEventListener('click', onClickOutside)
    }, [])

    const loadCategories = async () => {
        try {
            const list = await getCategories()
            setCategories(list || [])
        } catch (e) {
            console.error('Error loading categories:', e)
            setError('Internal error, please try again later.')
        }
    }

    const handleChooseCategory = async (id) => {
        const cat = categories.find((c) => String(c.id) === String(id))
            setSelectedCategoryId(String(id))
            setSelectedCategoryName(cat?.name || '')
            setOpenDropdown(false)

        if (!id) {
            resetFields()
            return
        }

        try {
            const category = await getCategoryById(id)
            setPlaceholders({
                name: category.name,
                description: category.description,
                color: category.color
            }), setName(''), setDescription(''), setColor(category.color || '#2b6cb0'), setError('')
        } catch (e) {
            console.error('Error loading category:', e)
            setError('Internal error, please try again later.')
        }
    }

    const resetFields = () => {setSelectedCategoryId(''), setSelectedCategoryName(''), setName(''), setDescription(''), setColor(''), setPlaceholders({}), setError('')}

    if (!open) return null

    const handleSubmit = async (e) => {
        e.preventDefault(), setSaving(true), setError('')

        if (!selectedCategoryId) {
            setError('You must select a category first.'), setSaving(false)
            return
        }

        try {
            const payload = {
                name: name || placeholders.name,
                description: description || placeholders.description,
                color: color || placeholders.color || '#2b6cb0'
            }
            await updateCategory(selectedCategoryId, payload), onClose(), resetFields()
            window.location.reload()
        } catch (err) {
            console.error('Update error:', err)
            setError('Internal error, please try again later.')
        } finally {
            setSaving(false)
        }
    }

    const handleClose = () => {onClose(), resetFields()}

    const handleDelete = async () => {
        if (!selectedCategoryId) {
            setError('You must select a category first.')
            return
        }
        const confirmed = window.confirm('Are you sure you want to delete this category?')
        if (confirmed) {
            try {
                await deleteCategory(selectedCategoryId)
                onClose()
                resetFields()
                window.location.reload()
            } catch (e) {
                console.error('Delete error:', e)
                setError('Internal error, please try again later.')
            }
        }
    }

    const presetColors = [
        '#2b6cb0', '#e53e3e', '#38a169', '#d69e2e',
        '#805ad5', '#dd6b20', '#319795', '#718096'
    ]

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
            <div className="flex justify-center my-16 px-4">
                <div className="relative w-full max-w-md bg-ocean-surface border border-ocean-border rounded-md shadow-xl">

                    <div className="flex items-center justify-between px-4 py-3 border-b border-ocean-border">
                        <h3 className="text-ocean-title font-semibold">Update Category</h3>
                        <button className="p-2 text-ocean-text hover:text-ocean-primary transition-colors" onClick={handleClose}>
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <p className="px-4 py-2 text-sm text-ocean-text">
                        Select a category and update only the fields you want to change.
                    </p>

                    <form onSubmit={handleSubmit} className="p-4 space-y-4">
                        <div className="relative" ref={dropdownRef}>
                            <label className="block text-sm text-ocean-text mb-1">Choose Category *</label>
                            <button type="button" nClick={() => setOpenDropdown((prev) => !prev)} className="w-full h-10 px-3 bg-ocean-bg border border-ocean-border text-ocean-text rounded-md flex items-center justify-between">
                                <span className="truncate">
                                    {selectedCategoryName || 'Select a category'}
                                </span>
                                <ChevronDown className="w-4 h-4 text-ocean-text" />
                            </button>

                            {openDropdown && (
                                <div className="absolute left-0 right-0 mt-2 bg-ocean-bg border border-ocean-border rounded-md shadow-xl">
                                    <ul className="max-h-36 overflow-y-auto py-1 m-0 list-none">
                                        {categories.map((c) => {
                                            const active = String(c.id) === String(selectedCategoryId)
                                            return (
                                                <li key={c.id}>
                                                    <button type="button" onClick={() => handleChooseCategory(c.id)} className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between ${active ? 'bg-ocean-primary/10 text-ocean-primary' : 'text-ocean-text'}`}>
                                                        <span className="truncate">{c.name}</span>
                                                        {active && <Check className="w-4 h-4 text-ocean-primary" />}
                                                    </button>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm text-ocean-text mb-1">Name</label>
                            <input value={name} onChange={(e) => setName(e.target.value)} placeholder={placeholders.name || ''}className="w-full h-10 px-3 bg-ocean-bg border border-ocean-border text-ocean-title rounded-md"/>
                        </div>

                        <div>
                            <label className="block text-sm text-ocean-text mb-1">Description</label>
                            <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder={placeholders.description || ''} className="w-full h-10 px-3 bg-ocean-bg border border-ocean-border text-ocean-title rounded-md"/>
                        </div>

                        <div>
                            <label className="block text-sm text-ocean-text mb-2">Select a color below</label>
                            <div className="flex gap-6 justify-center">
                                <HexColorPicker color={color || '#2b6cb0'} onChange={setColor} />
                                <div className="grid grid-cols-2 gap-3 self-center">
                                    {presetColors.map((c) => {
                                        const isSelected = c === color
                                        return (
                                            <button key={c} type="button" onClick={() => setColor(c)} className={`w-10 h-10 rounded-md border border-ocean-border transition-all duration-200 ${isSelected ? 'shadow-lg scale-110' : ''}`}
                                                style={{
                                                    backgroundColor: c,
                                                    boxShadow: isSelected ? `0 0 10px ${c}` : 'none'
                                                }}/>
                                        )
                                    })}
                                </div>

                            </div>

                            <div className="mt-3 flex items-center gap-2 justify-center">
                                <span className="text-sm text-ocean-text">Selected:</span>
                                <span className="inline-block w-6 h-6 rounded-md border border-ocean-border" style={{ backgroundColor: color || '#2b6cb0' }}/>
                                <span className="text-sm text-ocean-title">{color || '#2b6cb0'}</span>
                            </div>
                        </div>

                        {error && <p className="text-red-400 text-sm">{error}</p>}

                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={handleDelete} className="flex-1 h-10 bg-ocean-delete text-white font-semibold rounded-md hover:opacity-90">
                                <Trash2 className="w-5 h-5 inline-block mr-1" /> Delete
                            </button>
                            <button type="submit" disabled={saving} className="flex-1 h-10 bg-ocean-primary text-ocean-bg font-semibold rounded-md hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2">
                                {saving ? 'Saving...' : (<><Pencil className="w-5 h-5" /><span>Update</span></>)}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}