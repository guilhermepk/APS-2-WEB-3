import { BadRequestException, Body, Controller, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { ProjectsService } from "./projects.service";
import { ProjectEntity } from "./models/entities/project.entity";
import { CreateProjectDto } from "./models/dtos/create-project.dto";

@Controller('projects')
export class ProjectsController {
    constructor(
        private readonly service: ProjectsService
    ) { }

    @Post()
    async create(@Body() body: CreateProjectDto) {
        return await this.service.create(body);
    }

    @Get()
    async findAll(): Promise<ProjectEntity[]> {
        return await this.service.findAll();
    }

    @Get(':id')
    async findById(
        @Param(
            'id',
            new ParseIntPipe({
                exceptionFactory: () => new BadRequestException(`O parâmetro 'id' deve ser um número inteiro positivo`)
            })
        ) id: number
    ): Promise<ProjectEntity> {
        return await this.service.findById(id);
    }
}