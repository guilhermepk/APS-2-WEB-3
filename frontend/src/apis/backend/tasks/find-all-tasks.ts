import { sleep } from "@/common/functions/sleep";
import { FindAllTasksResponseDto } from "./models/dtos/find-all-tasks-response.dto";
import fakeFindAllTasksResponse from './fake-find-all-tasks-response.json';

export default async function findAllTasks(): Promise<FindAllTasksResponseDto> {
    await sleep(1000 * 1);

    return fakeFindAllTasksResponse;
}