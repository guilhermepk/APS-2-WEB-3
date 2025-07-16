import { backendApi } from "../axios-backend-api";
import { CreateTaskResponseDto } from "./models/dtos/create-task-response.dto";
import { CreateTaskDto } from "./models/dtos/create-task.dto";

export default async function createTask(data: CreateTaskDto): Promise<CreateTaskResponseDto> {
    return await backendApi.post<CreateTaskResponseDto>(`tasks`, data)
        .then(response => response.data);
}