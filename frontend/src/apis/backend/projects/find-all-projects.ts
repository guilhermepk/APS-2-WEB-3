import iziToast from 'izitoast';
import { backendApi } from '../axios-backend-api';
import { FindAllProjectsResponseDto } from './models/dtos/find-all-projects-response.dto';

export default async function findAllProjects(): Promise<FindAllProjectsResponseDto> {
    return backendApi.get<FindAllProjectsResponseDto>(
        '/projects',
        {
            customErrorInterceptor: (error: any) => {
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

