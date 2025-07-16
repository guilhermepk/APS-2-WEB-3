export type CreateTaskDto = {
    description: string;
    completed?: boolean;
    projectId: number;
}