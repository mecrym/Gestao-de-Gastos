import React, { useState } from 'react'
import { Menu, X, Wallet } from 'lucide-react'

export default function Navbar() {
        const [mobileMenuIsOpen, setMobileMenuIsOpen] = useState(false)

    const scrollToSection = (e, id) => {
        e.preventDefault();
        setMobileMenuIsOpen(false)

        const element = document.getElementById(id)
        if (element) {
            const headerOffset = 80
            const elementPosition = element.getBoundingClientRect().top
            const offsetPosition = elementPosition + window.scrollY - headerOffset

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            })
        }
    }

    return (
        <nav className="fixed top-0 w-full z-50 transition-all duration-300 bg-ocean-bg backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-14 sm:h-16 md:h-20">
                    <div className="flex items-center space-x-2 group cursor-pointer">
                        <Wallet className="text-ocean-title h-6 sm:h-8"/>
                    </div>
                    <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
                        {/**after u build the calendar page, u need to put the right links here */}
                        {/**don't forget to change the name */}
                        <a href="#" onClick={(e) => scrollToSection(e, '#')} className="text-ocean-text hover:text-ocean-title text-sm lg:text-base transition-colors">
                            Calendar Page
                        </a>
                    </div>
                    <button className="md:hidden p-2 text-ocean-text hover:text-ocean-title transition-colors cursor-pointer" onClick={() => setMobileMenuIsOpen((prev) => !prev)} area-label = "Toggle menu">
                        {mobileMenuIsOpen ? <X className="h-6 w-6"/> : <Menu className="h-6 w-6"/>}
                    </button>
                </div>
            </div>
            {mobileMenuIsOpen && (
                <div className="md:hidden bg-ocean-bg backdrop-blur-lg border-t border-ocean-border animate-in slide-in-from-top duration-300">
                    <div className="px-4 pt-2 pb-4 space-y-1">
                        <a href="#" onClick={(e) => scrollToSection(e, '#')} className="block px-3 py-2 text-base font-medium text-ocean-text hover:text-white hover:bg-ocean-surface rounded-md">
                            Calendar Page
                        </a>
                    </div>
                </div>
            )}
        </nav>
    )
}