import { backendApi } from "../axios-backend-api";
import { CreateUserDto } from "./models/dtos/create-user.dto";

export default async function createUser(data: CreateUserDto) {
    return await backendApi.post(`/users`, data)
        .then(response => response.data);
}