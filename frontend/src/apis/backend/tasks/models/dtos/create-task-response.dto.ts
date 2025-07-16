export type CreateTaskResponseDto = {
    id: number,
    description: string,
    completed: boolean,
    project: {
        id: number,
        name: string,
        description?: string
    }
}