import { backendApi } from "../axios-backend-api";
import { FindAllTasksResponseDto } from "./models/dtos/find-all-tasks-response.dto";

export default async function findAllTasks(): Promise<FindAllTasksResponseDto> {
    return backendApi.get<FindAllTasksResponseDto>('tasks')
        .then(response => response.data);
}