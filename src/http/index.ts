import axios, { AxiosError } /*, {AxiosRequestConfig, AxiosResponse}*/ from "axios";
import AuthResponse from "../types/response/AuthResponse";
import ErrorMessage from "../types/response/ErrorMessage";

export const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    withCredentials: true,
    baseURL: API_URL
});

api.interceptors.request.use(
    (config) => {
        config.headers!.Authorization = `Bearer ${localStorage.getItem('token')}`;
        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },

    async (error) => { //error: AxiosError
        const originalRequest = error.config;
        if (error.response!.status === 401 && error.config && !error.config._isRetry) { // Обновление токенов по refresh токену
            originalRequest._isRetry = true; // Флаг на то что мы уже пытались обновиь токен, и если пытались, то выводим пользователь не авторизован. (Без этого флага будет бесконечная петля)
            try {
                const response = await axios.get<AuthResponse>(`${API_URL}/auth/refresh`, {withCredentials: true});
                localStorage.setItem('token', response.data.accessToken);
                return api.request(originalRequest);
            }
            catch (err) {
                console.log(err);
            }
        }

        /* !!!!!!!!!!!!!!!!!!!!!!!!!!   !!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
        const err: AxiosError<ErrorMessage> = error;
        console.log(err);
        return Promise.reject(err);
    }

)

export default api;