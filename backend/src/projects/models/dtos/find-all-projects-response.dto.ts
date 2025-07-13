export type FindAllProjectsResponseDto = Array<{
    id: number,
    name: string,
    description: string | null,
    users: Array<{
        id: number,
        name: string
    }>
}>