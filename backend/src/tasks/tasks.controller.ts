import { BadRequestException, Body, Controller, Get, Param, ParseBoolPipe, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { CreateTaskDto } from "./models/dtos/create-task.dto";
import { UpdateTaskDto } from "./models/dtos/update-task.dto";

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

    @Get(':id')
    async findById(
        @Param('id', ParseIntPipe) id: number
    ) {
        return await this.service.findById(id);
    }

    @Get()
    async findAll(
        @Query(
            'completed',
            new ParseBoolPipe({
                optional: true,
                exceptionFactory: () => new BadRequestException(`O parâmetro 'completed' deve ser um booleano`)
            })
        ) completed?: boolean
    ) {
        return await this.service.findAll(completed);
    }

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateTaskDto
    ) {
        return await this.service.update(id, body);
    }
}