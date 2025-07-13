import { FindAllUsersResponseDto } from "./models/dtos/find-all-users-response.dto";
import fakeFindAllUsersResponse from './fake-find-all-users-response.json';
import { sleep } from "@/common/functions/sleep";


export default async function findAllUsers(): Promise<FindAllUsersResponseDto> {
    sleep(1000 * 2);
    return fakeFindAllUsersResponse;
}