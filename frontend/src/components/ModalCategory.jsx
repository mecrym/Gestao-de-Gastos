import { useState } from 'react'
import { X, Check } from 'lucide-react'
import { createCategory } from '../api'
import { HexColorPicker } from 'react-colorful'

export default function ModalCategory({ open, onClose, onCreated, origin = 'home' }) {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [color, setColor] = useState('#2b6cb0')
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    if (!open) return null

    const handleSubmit = async (e) => { e.preventDefault(), setSaving(true), setError('')

        if (!name.trim()) {
            setError('The field *Name* is required.'), setSaving(false)
            return
        }

        try {
            const payload = { name, description, color }
            const category = await createCategory(payload)
            onCreated?.(category)

            if (origin === 'home') {
                setName(''), setDescription(''), setColor('#2b6cb0')
            }

            onClose()
        } catch (err) {
            if (err.status === 400) {
                setError(err.message || 'Invalid data, please check the fields.')
            } else {
                setError('Internal error, our team will fix this.')
            }
        } finally {
            setSaving(false)
        }
    }

    const presetColors = [
        '#2b6cb0', '#e53e3e', '#38a169', '#d69e2e', 
        '#805ad5', '#dd6b20', '#319795', '#718096'
    ]

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="flex justify-center my-16 px-4">
                <div className="relative w-full max-w-md bg-ocean-surface border border-ocean-border rounded-md shadow-[0_0_10px_var(--color-ocean-primary)] flex flex-col">

                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 p-4 border-b border-ocean-border bg-ocean-bg/50 md:min-h-18">
                        <h3 className="text-ocean-title font-bold text-xl tracking-wide">Create Category</h3>
                        <button className="p-2 text-ocean-text cursor-pointer transition-all duration-200 transform hover:scale-105 hover:shadow-[0_0_8px_var(--color-ocean-primary)]" onClick={onClose}>
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-4 space-y-4 flex-1">
                        <div>
                            <label className="block text-sm text-ocean-text mb-1">Name *</label>
                            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full h-10 px-3 bg-ocean-bg border border-ocean-border text-ocean-title rounded-md" placeholder="Category name"/>
                        </div>

                        <div>
                            <label className="block text-sm text-ocean-text mb-1">Description</label>
                            <input value={description} onChange={(e) => setDescription(e.target.value)} className="w-full h-10 px-3 bg-ocean-bg border border-ocean-border text-ocean-title rounded-md" placeholder="Optional description"/>
                        </div>

                        <div>
                            <label className="block text-sm text-ocean-text mb-2">Select a color below</label>
                            <div className="flex gap-6 justify-center">
                                <HexColorPicker color={color} onChange={setColor} />
                                <div className="grid grid-cols-2 gap-3 self-center">
                                    {presetColors.map((c) => {
                                        const isSelected = c.toLowerCase() === color.toLowerCase()
                                        return (
                                            <button key={c} type="button" onClick={() => setColor(c)} className={`w-10 h-10 rounded-md border border-ocean-border transition-all duration-200 ${isSelected ? 'scale-110' : ''}`} aria-label={`Select color ${c}`}
                                                style={{
                                                    backgroundColor: c,
                                                    boxShadow: isSelected ? `0 0 10px ${c}` : 'none'
                                                }} 
                                            />
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="mt-3 flex items-center gap-2 justify-center">
                                <span className="text-sm text-ocean-text">Selected:</span>
                                <span className="inline-block w-6 h-6 rounded-md border border-ocean-border transition-all duration-200"
                                    style={{
                                        backgroundColor: color,
                                        boxShadow: `0 0 8px ${color}`
                                    }}
                                />
                                <span className="text-sm text-ocean-title">{color}</span>
                            </div>
                        </div>

                        {error && <p className="text-red-400 text-sm">{error}</p>}

                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={onClose} className="flex-1 h-10 bg-ocean-bg border border-ocean-border text-ocean-text rounded-md cursor-pointer transition-all duration-200 transform hover:scale-105 hover:shadow-[0_0_8px_var(--color-ocean-primary)]" >
                                Cancel
                            </button>
                            <button type="submit" disabled={saving} className="flex-1 h-10 bg-ocean-primary text-ocean-bg font-semibold rounded-md cursor-pointer transition-all duration-200 transform hover:scale-105 hover:shadow-[0_0_8px_var(--color-ocean-edit)] flex items-center justify-center gap-2">
                                {saving ? 'Saving...' : (<><Check className="w-5 h-5" /><span>Create</span></>)}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
