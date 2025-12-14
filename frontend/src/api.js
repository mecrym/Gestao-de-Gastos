import axios from 'axios'

const api = axios.create({
	baseURL: 'http://localhost:8000',
	headers: {'Content-Type': 'application/json',
	}
})

api.interceptors.response.use(
	(response) => response,
	(e) => {
		if (e.response) {
			const {status, data} = e.response
			return Promise.reject({status, message: `Error: ${data?.detail || e.message}`})
		}
		return Promise.reject({ status:500, message:`Error: ${e.message}`})
	}
)

export const getCategories = async(skip = 0, limit = 100) =>{
	const response = await api.get('/categories/', {params: {skip, limit}})
	return response.data
}

export const getCategoryById = async(categoryId) => {
	const response = await api.get(`/categories/${categoryId}`)
	return response.data
}

export const createCategory = async(categoryData) => {
	const response = await api.post('/categories/', categoryData)
	return response.data
}

export const updateCategory = async(categoryId, categoryData) => {
	const response = await api.put(`/categories/${categoryId}`, categoryData)
	return response.data
}

export const deleteCategory = async(categoryId) => {
	const response = await api.delete(`/categories/${categoryId}`)
	return response.data
}

export const searchCategory = async(name = null) => {
	const response = await api.get('/search/categories/', {params: {name}})
	return response.data
}

{/**payments */}
export const getPayments = async(skip = 0, limit = 200) => {
	const response = await api.get('/payments/', {params: {skip, limit}})
	return response.data
}

export const getPaymentById = async(paymentId) => {
	const response = await api.get(`/payments/${paymentId}`)
	return response.data
}

export const createPayment = async(paymentData) => {
	const response = await api.post('/payments/', paymentData)
	return response.data
}

export const updatePayment = async(paymentId, paymentData) => {
	const response = await api.put(`/payments/${paymentId}`, paymentData)
	return response.data
}

export const deletePayment = async(paymentId) => {
	const response = await api.delete(`/payments/${paymentId}`)
	return response.status === 204
}

export const searchPayments = async(name = null) => {
	const response = await api.get('/search/payments/', {params: {name}})
	return response.data
}

export const searchPaymentsByCategory = async(categoryName, searchTerm = null) => {
	const response = await api.get('/search/payments-by-category/', {params: {name: categoryName, search: searchTerm}})
	return response.data
} 

export default api