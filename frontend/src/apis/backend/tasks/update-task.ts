import { backendApi } from "../axios-backend-api";
import { UpdateTaskDto } from "./models/dtos/update-task.dto";

export default async function updateTask(taskId: number, data: UpdateTaskDto) {
    return await backendApi.patch(`/tasks/${taskId}`, data);
}