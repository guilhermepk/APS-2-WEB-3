import axios from "axios";
import iziToast from "izitoast";

declare module 'axios' {
    export interface AxiosRequestConfig {
        customResponseInterceptor?: (response: AxiosResponse<any, any>) => void;
        customErrorInterceptor?: (error: any) => void
    }
}

export const backendApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

backendApi.interceptors.response.use(
    (response) => {
        if (!response.config?.customResponseInterceptor) {
            iziToast.success({
                title: 'Sucesso',
                message: response.data?.message || 'Requisição concluída com sucesso',
                position: 'topRight',
            });
        } else {
            response.config.customResponseInterceptor(response);
        }

        return response;
    },
    (error) => {
        if (error.config?.customErrorInterceptor) {
            const result = error.config.customErrorInterceptor(error);
            if (result) return result;
        }

        iziToast.error({
            title: 'Erro',
            message: error.response?.data?.message || error.message || 'Erro desconhecido',
            position: 'topRight',
        });

        return Promise.reject(error);
    }
);
