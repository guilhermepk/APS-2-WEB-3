import { Controller, Get } from "@nestjs/common";
import { TasksService } from "../tasks.service";

@Controller('tasks')
export class TasksController {
    constructor(
        private readonly service: TasksService
    ) { }

    @Get()
    async findAll() {
        return await this.service.findAll();
    }
}