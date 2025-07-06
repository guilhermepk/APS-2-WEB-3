import { FindAllProjectsResponseDto } from './models/dtos/find-all-projects-response.dto';
import fakeFindAllProjectsResponse from './fake-find-all-projects-response.json';
import { sleep } from '@/common/functions/sleep';

export default async function findAllProjects(): Promise<FindAllProjectsResponseDto> {
    await sleep(1000 * 2);
    return fakeFindAllProjectsResponse;
}