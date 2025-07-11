import { BadRequestException, Body, Controller, Get, ParseBoolPipe, ParseEnumPipe, Post, Query } from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { CreateTaskDto } from "./models/dtos/create-task.dto";

@Controller('tasks')
export class TasksController {
    constructor(
        private readonly service: TasksService
    ) { }

    @Post()
    async create(
        @Body() body: CreateTaskDto
    ) {
        return await this.service.create(body);
    }

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