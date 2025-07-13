import { backendApi } from "../axios-backend-api";
import { CreateProjectDto } from "./models/dtos/create-project.dto";

export default async function createProject(name: string, description?: string): Promise<void> {
    const body: CreateProjectDto = { name, description };

    await backendApi.post<undefined, undefined, CreateProjectDto>('/projects', body);
}