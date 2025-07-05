import { Injectable, NotFoundException } from "@nestjs/common";
import { ProjectsTypeOrmRepository } from "./projects.repository";
import { ProjectEntity } from "./models/entities/project.entity";
import { tryCatch } from "src/common/functions/try-catch.function";

@Injectable()
export class ProjectsService {
    constructor(
        private readonly repository: ProjectsTypeOrmRepository
    ) { }

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