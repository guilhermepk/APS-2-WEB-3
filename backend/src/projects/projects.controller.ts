import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { ProjectsService } from "./projects.service";
import { ProjectEntity } from "./models/entities/project.entity";
import { CreateProjectDto } from "./models/dtos/create-project.dto";
import { UpdateProjectDto } from "./models/dtos/update-project.dto";
import { FindAllProjectsResponseDto } from "./models/dtos/find-all-projects-response.dto";
import { FindProjectByIdResponseDto } from "./models/dtos/find-project-by-id-response.dto";

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
    async findAll(): Promise<FindAllProjectsResponseDto> {
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
    ): Promise<FindProjectByIdResponseDto> {
        return await this.service.findById(id);
    }

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateProjectDto
    ) {
        return await this.service.update(id, body);
    }

    @Delete(':id')
    async delete(
        @Param('id', ParseIntPipe) id: number
    ) {
        return await this.service.delete(id);
    }
}