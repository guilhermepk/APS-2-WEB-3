import { backendApi } from "../axios-backend-api";

export default async function deleteProject(projectId: number) {
    return await backendApi.delete(`/projects/${projectId}`);
}