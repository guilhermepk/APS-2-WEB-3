import { backendApi } from "../axios-backend-api";
import { FindProjectByIdResponseDto } from "./models/dtos/find-project-by-id-response.dto";

export default async function findProjectById(id: number): Promise<FindProjectByIdResponseDto> {
    return await backendApi.get<FindProjectByIdResponseDto>(`/projects/${id}`)
        .then(response => response.data);
}