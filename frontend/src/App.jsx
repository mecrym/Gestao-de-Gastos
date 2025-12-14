import React, {useState, useEffect } from 'react'
import api from './api'
import Navbar from './components/Navbar'
import CategoryList from './components/CategoryList'
import SearchBar from './components/SearchBar'


function App() {

	return (
		<div className='min-h-screen bg-ocean-bg text-white overflow-hidden'>
			<Navbar />
			<main className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    <div className="lg:col-span-2 border border-red-500">
                        <SearchBar />
                    </div>

                    <div className="border border-red-500">

                    </div>

                </div>
            </main>
		</div>
	)
}

export default App
