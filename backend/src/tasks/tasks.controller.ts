import { BadRequestException, Controller, Get, ParseBoolPipe, ParseEnumPipe, Query } from "@nestjs/common";
import { TasksService } from "./tasks.service";

@Controller('tasks')
export class TasksController {
    constructor(
        private readonly service: TasksService
    ) { }

    @Get()
    async findAll(
        @Query(
            'completed',
            new ParseBoolPipe({
                exceptionFactory: () => new BadRequestException(`O parâmetro 'completed' deve ser um booleano`)
            })
        ) completed?: boolean
    ) {
        return await this.service.findAll(completed);
    }
}