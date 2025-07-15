export type CreateProjectDto = {
    name: string;
    description?: string;
    userIds: number[];
}