import axios from 'axios'

const api = axios.create({
	baseURL: 'http://localhost:8000',
	headers: {'Content-Type': 'aplication/json',
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

export const createCategory = async(CatedoryData) => {
	const response = await api.put(`/categories/${categoryId}`, categoryData)
	return response.data
}

export const updateCategory = async(categoryId, categoryData) => {
	const response = await api.put(`/categories/${categoryId}`, categoryData)
	return response.data
}

export const deleteCategory = async = async(categoryId) => {
	const response = await api.delete(`/categories/${categoryId}`)
	return response.data
}

export default api;