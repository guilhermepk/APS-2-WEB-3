import { backendApi } from "../axios-backend-api";
import { FindAllTasksResponseDto } from "./models/dtos/find-all-tasks-response.dto";

export default async function findAllTasks(): Promise<FindAllTasksResponseDto> {
    return backendApi.get<FindAllTasksResponseDto>(
        'tasks',
        {
            customErrorInterceptor: async (error: any) => {
                const iziToast = (await import("izitoast")).default;
                if (error.response?.status === 404) {
                    return Promise.resolve({ data: [] });
                } else {
                    iziToast.error({
                        title: 'Erro',
                        message: error.response?.data?.message || error.message || 'Erro desconhecido',
                        position: 'topRight',
                    });
                }
            }
        }
    ).then(response => response.data);
}