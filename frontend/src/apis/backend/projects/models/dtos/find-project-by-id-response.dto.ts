export type FindProjectByIdResponseDto = {
    id: number,
    name: string,
    description?: string,
    tasks: Array<{
        id: number,
        description: string,
        completed: boolean,
    }>,
    users: Array<{
        id: number,
        name: string
    }>
}