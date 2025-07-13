import { backendApi } from "../axios-backend-api";
import { FindAllUsersResponseDto } from "./models/dtos/find-all-users-response.dto";

export default async function findAllUsers(): Promise<FindAllUsersResponseDto> {
    return backendApi.get<FindAllUsersResponseDto>('/users')
        .then(response => response.data);
}