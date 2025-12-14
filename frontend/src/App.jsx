import React, {useState, useEffect } from 'react'
import api from './api'
import Navbar from './components/Navbar'


function App() {

	return (
		<div className='min-h-screen bg-slate-950 text-white overflow-hidden'>
			<Navbar />
		</div>
	)
}

export default App
