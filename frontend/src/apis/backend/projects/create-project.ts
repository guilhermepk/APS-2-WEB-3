import { backendApi } from "../axios-backend-api";
import { CreateProjectDto } from "./models/dtos/create-project.dto";

export default async function createProject(data: CreateProjectDto): Promise<void> {
    await backendApi.post<undefined, undefined, CreateProjectDto>('/projects', data);
}