import axios from 'axios';

// Configuração base do axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para tratar erros globalmente (opcional)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erro na API:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ==================== CATEGORIAS ====================

/**
 * Busca todas as categorias
 * GET /categories/
 */
export const getCategories = async (skip = 0, limit = 100) => {
  try {
    const response = await api.get('/categories/', {
      params: { skip, limit }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Busca uma categoria específica
 * GET /categories/{category_id}
 */
export const getCategoryById = async (categoryId) => {
  try {
    const response = await api.get(`/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Cria uma nova categoria
 * POST /categories/
 * @param {Object} categoryData - { name, description?, color? }
 */
export const createCategory = async (categoryData) => {
  try {
    const response = await api.post('/categories/', categoryData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Atualiza uma categoria existente
 * PUT /categories/{category_id}
 */
export const updateCategory = async (categoryId, categoryData) => {
  try {
    const response = await api.put(`/categories/${categoryId}`, categoryData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Deleta uma categoria
 * DELETE /categories/{category_id}
 */
export const deleteCategory = async (categoryId) => {
  try {
    await api.delete(`/categories/${categoryId}`);
    return true;
  } catch (error) {
    throw error;
  }
};

/**
 * Busca categorias por nome
 * GET /search/categories/?name=texto
 */
export const searchCategories = async (name = null) => {
  try {
    const response = await api.get('/search/categories/', {
      params: { name }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ==================== PAGAMENTOS ====================

/**
 * Busca todos os pagamentos
 * GET /payments/
 */
export const getPayments = async (skip = 0, limit = 200) => {
  try {
    const response = await api.get('/payments/', {
      params: { skip, limit }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Busca um pagamento específico
 * GET /payments/{payment_id}
 */
export const getPaymentById = async (paymentId) => {
  try {
    const response = await api.get(`/payments/${paymentId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Cria um novo pagamento
 * POST /payments/
 * @param {Object} paymentData - { name, date, value, category_id, is_recurring? }
 */
export const createPayment = async (paymentData) => {
  try {
    const response = await api.post('/payments/', paymentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Atualiza um pagamento existente
 * PUT /payments/{payment_id}
 */
export const updatePayment = async (paymentId, paymentData) => {
  try {
    const response = await api.put(`/payments/${paymentId}`, paymentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Deleta um pagamento
 * DELETE /payments/{payment_id}
 */
export const deletePayment = async (paymentId) => {
  try {
    await api.delete(`/payments/${paymentId}`);
    return true;
  } catch (error) {
    throw error;
  }
};

/**
 * Busca pagamentos por nome
 * GET /search/payments/?name=texto
 */
export const searchPayments = async (name = null) => {
  try {
    const response = await api.get('/search/payments/', {
      params: { name }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Busca pagamentos por nome de categoria
 * GET /search/payments-by-category/?name=texto
 */
export const searchPaymentsByCategory = async (categoryName = null) => {
  try {
    const response = await api.get('/search/payments-by-category/', {
      params: { name: categoryName }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;