import { useEffect, useState, useMemo } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { getPayments, getCategories } from '../api'

export default function DonutChart() {
    const [data, setData] = useState([])
    const [error, setError] = useState('')

    useEffect(() => {
        const loadData = async () => {
            try {
                const [payments, categories] = await Promise.all([getPayments(), getCategories()])
                const catMap = new Map(categories.map(c => [String(c.id), { name: c.name, color: c.color }]))

                const totals = {}
                payments.forEach(p => {
                    const id = String(p.category_id)
                    totals[id] = (totals[id] || 0) + Number(p.value || 0)
                })

                const merged = Object.entries(totals)
                    .map(([id, total]) => ({
                        category_id: id,
                        total,
                        name: catMap.get(id)?.name || 'Unknown',
                        color: catMap.get(id)?.color || '#6b7280'
                    })).filter(d => d.total > 0).sort((a, b) => b.total - a.total)

                setData(merged)
            } catch (e) {
                console.error('Erro ao carregar dados do gráfico', e)
                setError('Erro ao carregar dados do gráfico.')
            }
        }
        loadData()
    }, [])

    const totalGeneral = useMemo(() => data.reduce((acc, d) => acc + d.total, 0), [data])

    const formatPercent = (value) => {
        if (!totalGeneral) return '0%'
        const percent = (value / totalGeneral) * 100
        return `${percent.toFixed(1)}%`
    }

    const capitalize = (text) => {
        if (!text) return ''
        return text.charAt(0).toUpperCase() + text.slice(1)
    }

    return (
        <div>
            <div className="mx-auto text-center mb-2" style={{ width: 250 }}>
                <p className="text-ocean-primary font-bold leading-none" style={{ fontSize: '40px' }}>
                    ${totalGeneral.toFixed(2)}
                </p>
            </div>

            <h3 className="text-lg font-semibold text-ocean-title mb-3 text-center">
                Spending by Category
            </h3>

            {error && <p className="text-red-400 text-center">{error}</p>}
            {!error && data.length > 0 && (
                <>
                    <div style={{ width: 250, height: 250 }} className="mx-auto">
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={data} dataKey="total" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2}>
                                    {data.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                                </Pie>
                                <Tooltip formatter={(value) => formatPercent(value)} labelFormatter={(name) => capitalize(name)}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-4 space-y-2">
                        {data.map(d => (
                            <div key={d.category_id} className="flex items-center justify-between px-2 py-1 border-b border-ocean-border" >
                                <div className="flex items-center gap-2">
                                    <span className="inline-block rounded-full" style={{ width: '12px', height: '12px', backgroundColor: d.color }} title={capitalize(d.name)} />
                                    <span className="text-base font-medium text-ocean-title">
                                        {capitalize(d.name)}
                                    </span>
                                </div>
                                <span className="text-base font-semibold text-ocean-text">
                                    ${d.total.toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {!error && data.length === 0 && (
                <p className="text-sm text-ocean-text text-center">No spending data available.</p>
            )}
        </div>
    )
}
