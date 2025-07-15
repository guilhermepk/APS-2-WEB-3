export type FindAllProjectsResponseDto = Array<{
    id: number,
    name: string,
    description?: string,
    users: Array<{
        id: number,
        name: string
    }>
}>