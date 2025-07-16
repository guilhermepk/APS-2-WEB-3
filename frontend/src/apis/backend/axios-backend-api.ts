import axios from "axios";

declare module 'axios' {
    export interface AxiosRequestConfig {
        customResponseInterceptor?: (response: any) => void;
        customErrorInterceptor?: (error: any) => void;
    }
}

export const backendApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

backendApi.interceptors.response.use(
    async (response) => {
        if (typeof window !== "undefined") {
            const iziToast = (await import("izitoast")).default;
            if (!response.config?.customResponseInterceptor) {
                iziToast.success({
                    title: "Sucesso",
                    message: response.data?.message || "Requisição concluída com sucesso",
                    position: "topRight",
                });
            } else {
                response.config.customResponseInterceptor(response);
            }
        }
        return response;
    },
    async (error) => {
        if (typeof window !== "undefined") {
            const iziToast = (await import("izitoast")).default;
            if (error.config?.customErrorInterceptor) {
                const result = error.config.customErrorInterceptor(error);
                if (result) return result;
            }

            iziToast.error({
                title: "Erro",
                message:
                    error.response?.data?.message || error.message || "Erro desconhecido",
                position: "topRight",
            });
        }
        return { data: null };
    }
);
