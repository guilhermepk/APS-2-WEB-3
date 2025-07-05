import { BadRequestException, Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { ProjectsService } from "./projects.service";
import { ProjectEntity } from "./models/entities/project.entity";

@Controller('projects')
export class ProjectsController {
    constructor(
        private readonly service: ProjectsService
    ) { }

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