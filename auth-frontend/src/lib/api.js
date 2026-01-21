import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({baseURL:API_URL});

api.interceptors.request.use((config)=>{
    const token = localStorage.getItem('token');
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

//posts api
export const postsAPI = {
    getAll: () => api.get('/posts'),
    getById: () => api.getById(`/posts/${id}`),
    create: () => api.post('/posts',data),
    update: () => api.put(`/posts/${id}`,data),
    delete: () => api.delete(`/posts/${id}`),
};

//Users Api for admin only
export const usersAPI = {
    getAll: () => api.get('/users'),
    delete: () => api.delete(`/users/${id}`),
    updateRole: () => api.patch(`/users/${id}/role`,{role}),
}

export default api;