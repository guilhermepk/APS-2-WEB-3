import { BadRequestException, Controller, Get, ParseEnumPipe, Query } from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { TaskStatusEnum } from "./models/enums/task-status.enum";

@Controller('tasks')
export class TasksController {
    constructor(
        private readonly service: TasksService
    ) { }

    @Get()
    async findAll(
        @Query(
            'status',
            new ParseEnumPipe(TaskStatusEnum, {
                exceptionFactory: () => new BadRequestException(`Status inválido. Vallores válidos: ${Object.values(TaskStatusEnum).map(v => `'${v}'`).join(', ')}`)
            })
        ) status?: TaskStatusEnum
    ) {
        return await this.service.findAll(status);
    }
}