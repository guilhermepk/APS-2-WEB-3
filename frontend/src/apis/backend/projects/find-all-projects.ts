import { backendApi } from '../axios-backend-api';
import { FindAllProjectsResponseDto } from './models/dtos/find-all-projects-response.dto';

export default async function findAllProjects(): Promise<FindAllProjectsResponseDto> {
    return backendApi.get<FindAllProjectsResponseDto>('/projects')
        .then(response => response.data);
}