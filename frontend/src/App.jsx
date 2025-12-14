import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import SearchBar from './components/SearchBar'
import { getPayments } from './api'
import DonutChart from './components/DonutChart'

import ModalCategory from './components/ModalCategory'
import ModalPayment from './components/ModalPayment'
import ModalUpdateP from './components/ModalUpdateP'
import ModalUpdateC from './components/ModalUpdateC'
import Transactions from './components/Transactions'

function App() {
	const [payments, setPayments] = useState([])
	const [showPaymentModal, setShowPaymentModal] = useState(false)
	const [showCategoryModal, setShowCategoryModal] = useState(false)
	const [showUpdateCategoryModal, setShowUpdateCategoryModal] = useState(false)
	const [categoryModalOrigin, setCategoryModalOrigin] = useState('home')

	const [showUpdateModal, setShowUpdateModal] = useState(false)
	const [selectedPaymentId, setSelectedPaymentId] = useState(null)

	useEffect(() => {loadData()}, [])

	const loadData = async () => {
		try {
			const data = await getPayments()
			setPayments(data)
		} catch (error) {
			console.error('Initial load error:', error)
		}
	}

	const handleSearchResults = (results) => { if (results) {setPayments(results)}}

	const handleCategoryCreated = (category) => {
		if (categoryModalOrigin === 'payment') { setShowCategoryModal(false), setShowPaymentModal(true)
		} else {
			setShowCategoryModal(false)
		}
	}

	const handlePaymentCreated = () => { setShowPaymentModal(false), loadData()}

	const handleOpenUpdate = (paymentId) => {setSelectedPaymentId(paymentId), setShowUpdateModal(true)}

	return (
		<div className="min-h-screen bg-ocean-bg text-white overflow-hidden">
			<Navbar />
			<main className="pt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
					<div className="lg:col-span-2">
						<SearchBar 
							onResults={handleSearchResults} 
							className="transition-all duration-200 transform hover:scale-105 hover:shadow-[0_0_8px_var(--color-ocean-primary)] cursor-pointer text-sm font-medium rounded-md" 
						/>
					</div>
					<div>
						<div className="grid grid-cols-3 gap-3 w-full">
							<button className="h-11 px-4 bg-ocean-primary text-ocean-bg font-semibold text-sm rounded-md cursor-pointer transition-all duration-200 transform hover:scale-105 hover:shadow-[0_0_8px_var(--color-ocean-primary)]" onClick={() => setShowPaymentModal(true)} >
								New Payment
							</button>

							<button className="h-11 px-4 bg-ocean-bg border border-ocean-border text-ocean-text font-semibold text-sm rounded-md cursor-pointer transition-all duration-200 transform hover:scale-105 hover:shadow-[0_0_8px_var(--color-ocean-primary)]" onClick={() => {
									setCategoryModalOrigin('home')
									setShowCategoryModal(true)
								}}>
								New Category
							</button>

							<button
								className="h-11 px-4 bg-ocean-bg border border-ocean-border text-ocean-text font-semibold text-sm rounded-md cursor-pointer transition-all duration-200 transform hover:scale-105 hover:shadow-[0_0_8px_var(--color-ocean-primary)]" onClick={() => setShowUpdateCategoryModal(true)}>
								Edit Category
							</button>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
					<div className="lg:col-span-2 flex flex-col h-full">
						<Transactions payments={payments} onEditPayment={handleOpenUpdate} />
					</div>

					<div className="bg-ocean-surface border border-ocean-border rounded-md overflow-hidden shadow-[0_0_10px_var(--color-ocean-primary)] flex flex-col h-full">
						<div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 p-4 border-b border-ocean-border bg-ocean-bg/50 md:min-h-19">
							<h2 className="font-bold text-ocean-title text-center md:text-left text-xl tracking-wide">
								Summary
							</h2>
						</div>

						<div className="p-4 space-y-4 flex-1">
							<DonutChart />
						</div>
					</div>
				</div>


			</main>

			<ModalPayment open={showPaymentModal} onClose={() => setShowPaymentModal(false)} onCreated={handlePaymentCreated} onOpenCategoryModal={() => {setShowPaymentModal(false), setCategoryModalOrigin('payment'), setShowCategoryModal(true)}}/>
			<ModalCategory open={showCategoryModal} onClose={() => setShowCategoryModal(false)} onCreated={handleCategoryCreated} origin={categoryModalOrigin}/>
			<ModalUpdateP open={showUpdateModal} onClose={() => setShowUpdateModal(false)} paymentId={selectedPaymentId} />
			<ModalUpdateC open={showUpdateCategoryModal} onClose={() => setShowUpdateCategoryModal(false)} />
		</div>
	)
}

export default App
