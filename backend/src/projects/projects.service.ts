import { Injectable, NotFoundException } from "@nestjs/common";
import { ProjectsTypeOrmRepository } from "./projects.repository";
import { ProjectEntity } from "./models/entities/project.entity";
import { tryCatch } from "src/common/functions/try-catch.function";
import { CreateProjectDto } from "./models/dtos/create-project.dto";

@Injectable()
export class ProjectsService {
    constructor(
        private readonly repository: ProjectsTypeOrmRepository
    ) { }

    async create(data: CreateProjectDto): Promise<ProjectEntity> {
        return await tryCatch(async () => {
            const { name, description } = data;

            const project = new ProjectEntity(name, description);

            return await this.repository.create(project);
        }, `Erro ao criar projeto`);
    }

    async findAll(): Promise<ProjectEntity[]> {
        return await tryCatch(async () => {
            const foundProjects = await this.repository.findAll();

            if (!foundProjects) throw new NotFoundException(`Nenhum projeto encontrado`);

            return foundProjects.map(project => ({
                ...project,
                users: project.usersProjects.map(userProject => userProject.user),
                usersProjects: undefined
            }));
        }, `Erro ao buscar todos os projetos`);
    }

    async findById(id: number): Promise<ProjectEntity> {
        return await tryCatch(async () => {
            const foundProject = await this.repository.findById(id);

            if (!foundProject) throw new NotFoundException(`Projeto ${id} não encontrado`);

            return foundProject
        }, `Erro ao buscar projeto ${id}`);
    }
}