import { useState, useEffect, useRef, use } from "react"
import { Search, Loader2, ChevronDown, Check} from "lucide-react"
import { searchPayments, searchPaymentsByCategory, getCategories } from "../api"

export default function SearchBar({ onResults }) {
	const [searchTerm, setSearchTerm] = useState("")
	const[selectedCategory, setSelectedCategory] = useState('')
	const [categories, setCategories] = useState([])
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const data = await getCategories()
				setCategories(data)
			} catch (e) {
				console.error("Error:", e)
			}
		}
		fetchCategories()
	}, [])

	const handleSearch = async () => {
		setLoading(true)
		const minDelay = new Promise((resolve) => setTimeout(resolve, 700))

		try {
			let searchPromise
			if (selectedCategory) {
				searchPromise = searchPaymentsByCategory(selectedCategory, searchTerm)
			}else{
				searchPromise = await searchPayments(searchTerm)
			}
			const [results] = await Promise.all([searchPromise, minDelay])
			onResults?.(results)
		} catch (e) {
			console.error("Search error:", e)
		} finally {
			setLoading(false)
		}
	}

	const btnBase = "h-11 w-11 bg-ocean-primary text-white font-semibold text-sm rounded-lg flex items-center justify-center shrink-0 cursor-pointer transition-all duration-200 transform"
	const btnState = "hover:scale-105 hover:shadow-[0_0_8px_var(--color-ocean-primary)] active:scale-95 disabled:opacity-50 disabled:active:scale-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-ocean-primary"
	const buttonClass = `${btnBase} ${btnState}`


	return (
		<section className="relative mb-6 overflow-visible">
			<div> 
				<div className="flex flex-col md:flex-row gap-3 items-stretch">
					<input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
						placeholder="Search payments..."
						className="w-full md:flex-1 h-11 px-4 py-2 bg-ocean-bg border border-ocean-border text-ocean-title placeholer-ocean-text/60 rounded-lg focus:outline-none focus:border-ocean-primary focus ring-ocean-primary/20 transition-all duration-200"
					/>
					<div className="flex flex-row gap-3 w-full md:w-auto shrink-0">
						<CategoryDropdown categories={categories} value={selectedCategory} onChange={setSelectedCategory} />
						<button onClick={handleSearch} disabled={loading} className={buttonClass}>
							{loading ? ( <Loader2 className="animate-spin h-5 w-5"/> ) : ( 
								<> 
									<Search className="h-5 w-5"/>
								</>
							)}
						</button>
					</div>
				</div>
			</div>
		</section>
	)
}

function CategoryDropdown({ categories, value, onChange }) {
	const[open, setOpen] = useState(false)
	const containerRef = useRef(null)
	
	useEffect(() => {
		const onClickOutside = (e) => {
			if (containerRef.current && !containerRef.current.contains(e.target)) { setOpen(false) }
		}
		window.addEventListener('click', onClickOutside)
		return () => window.removeEventListener('click', onClickOutside) 
	}, [])

	const selectedLabel = value || 'All categories'

	const baseClasses = "w-full h-11 px-4 py-2 bg-ocean-bg border text-ocean-text rounded-lg flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-ocean-primary/20 transition-all duration-200"
	const stateClasses = open ? "border-ocean-primary ring-2 ring-ocean-primary/20" : "border-ocean-border hover:border-ocean-primary/50"
	const buttonClass = `${baseClasses} ${stateClasses}`
	const textClass = `truncate font-medium ${value ? 'text-ocean-primary' : 'text-ocean-text'}`
	const iconClass = `w-4 h-4 text-ocean-text transition-transform duration-200 ${open ? 'rotate-180 text-ocean-primary' : ''}`

	return(
		<div ref={containerRef} className="relative w-full md:w-56">
			<button type="button" onClick={() => setOpen((prev) => !prev)} aria-haspopup="listbox" aria-expanded={open} className={buttonClass}>
				<span className={textClass}>
					{selectedLabel}
				</span>
				<ChevronDown className={iconClass}/>
			</button>

			{open && (
				<div className="absolute z-59 mt-2 w-full bg-ocean-surface/90 backdrop-blur-xl border border-ocean-border rounded-lg animate-in slide-in-from-top duration-200 shadown-xl ring-1 ring-black/5">
					<ul role="listbox" className="max-h-60 overflow-auto py-1 custom-scrollbar m-0 p-0 list-none">
						<DropdownItem active={value === ''} label="All categories" onClick={() => { onChange(''), setOpen(false)}} />
						{categories.map((cat) => (
							<DropdownItem key={cat.id} active={value === cat.name} label={cat.name} onClick={() => {onChange(cat.name), setOpen(false)}}/>
						))}
					</ul>
				</div>
			)}
		</div>
	)
}

function DropdownItem({ label, active, onClick }) {
	const baseClasses = "w-full text-left px-4 py-2.5 text-sm transition-all duration-150 border-l-2 block"
	const stateClasses = active ? "border-ocean-primary bg-ocean-primary/10 text-ocean-primary font-semibold" : "border-transparent text-ocean-text hover:text-ocean-title hover:bg-ocean-bg"
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