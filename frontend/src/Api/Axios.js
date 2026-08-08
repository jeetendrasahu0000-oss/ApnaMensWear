import axios from 'axios'


console.log(import.meta.env.VITE_BASE_URL);



const api = axios.create(
    {
        // baseURL : import.meta.VITE_BASE_URL,
        baseURL:"http://192.168.29.224:5000/api",
        // baseURL:"http://10.43.145.47:5000/api",
        withCredentials:true,
        headers:{
            "Content-Type" : "application/json"
        }
    }
)

export default api;