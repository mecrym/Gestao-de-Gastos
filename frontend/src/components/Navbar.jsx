import React, { useState } from 'react'
import { Menu, X, BarChart3 } from 'lucide-react'

export default function Navbar() {
    const [mobileMenuIsOpen, setMobileMenuIsOpen] = useState(false)
    const blockClick = (e) => { e.preventDefault() }

    const items = [
        { label: 'Dashboard' },
        { label: 'Reports' },
        { label: 'Budgets' },
        { label: 'Goals' },
        { label: 'Settings' }
    ]

    return (
        <nav className="fixed top-0 w-full z-50 bg-ocean-bg/90 backdrop-blur-sm border-b border-ocean-border shadow-[0_4px_12px_var(--color-ocean-primary)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-14 sm:h-16 md:h-20">
                    <div className="flex items-center space-x-3">
                        <BarChart3 className="text-ocean-primary h-8 sm:h-10 md:h-12" />
                        <span className="block text-ocean-title font-bold text-lg sm:text-xl md:text-2xl tracking-wide">
                            Finance Control
                        </span>
                    </div>

                    <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
                        {items.map((item) => (
                            <a key={item.label} href="#" onClick={blockClick} className="relative group text-ocean-text hover:text-ocean-title text-sm lg:text-base transition-colors cursor-not-allowed">
                                {item.label}
                                <span className="hidden md:block pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 whitespace-nowrap rounded-md bg-ocean-surface text-ocean-text text-xs px-2 py-1 border border-ocean-border opacity-0 group-hover:opacity-100 transition-opacity">
                                    Feature under construction
                                </span>
                            </a>
                        ))}
                    </div>

                    <button className="md:hidden p-2 text-ocean-text hover:text-ocean-title transition-colors cursor-pointer" onClick={() => setMobileMenuIsOpen((prev) => !prev)}aria-label="Toggle menu">
                        {mobileMenuIsOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {mobileMenuIsOpen && (
                <div className="md:hidden bg-ocean-bg/90 backdrop-blur-lg border-t border-ocean-border animate-in slide-in-from-top duration-300">
                    <div className="px-4 pt-2 pb-4 space-y-1">
                        {items.map((item) => (
                            <a key={item.label} href="#" onClick={blockClick} className="block px-3 py-2 text-base font-medium text-ocean-text rounded-md transition-colors cursor-not-allowed hover:bg-ocean-surface hover:text-ocean-title">
                                {item.label}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    )
}
