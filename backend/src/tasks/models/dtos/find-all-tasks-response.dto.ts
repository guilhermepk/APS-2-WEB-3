export type FindAllTasksResponseDto = Array<{
    id: number,
    description: string,
    completed: boolean,
    project: {
        id: number,
        name: string
    }
}>