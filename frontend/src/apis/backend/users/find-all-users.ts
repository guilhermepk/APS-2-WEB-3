import { backendApi } from "../axios-backend-api";
import { FindAllUsersResponseDto } from "./models/dtos/find-all-users-response.dto";

export default async function findAllUsers(): Promise<FindAllUsersResponseDto> {
    return backendApi.get<FindAllUsersResponseDto>(
        '/users',
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