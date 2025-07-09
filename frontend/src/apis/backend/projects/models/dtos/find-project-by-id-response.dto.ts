export type FindProjectByIdResponseDto = {
    id: number,
    name: string,
    description: string | null,
    tasks: Array<{
        id: number,
        description: string,
        completed: boolean,
    }>
}