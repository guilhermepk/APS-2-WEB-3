import { backendApi } from "../axios-backend-api";
import { UpdateProjectDto } from "./models/dtos/update-project.dto";

export default async function updateProject(id: number, data: UpdateProjectDto): Promise<void> {
    await backendApi.patch<undefined, undefined, UpdateProjectDto>(`/projects/${id}`, data);
}