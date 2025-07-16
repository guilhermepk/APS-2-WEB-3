import { backendApi } from "../axios-backend-api";

export default async function deleteTask(id: number) {
    return await backendApi.delete(`tasks/${id}`);
}