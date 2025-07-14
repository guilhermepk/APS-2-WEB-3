import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { ProjectsTypeOrmRepository } from "./projects.repository";
import { ProjectEntity } from "./models/entities/project.entity";
import { tryCatch } from "src/common/functions/try-catch.function";
import { CreateProjectDto } from "./models/dtos/create-project.dto";
import { UpdateProjectDto } from "./models/dtos/update-project.dto";
import { FindAllProjectsResponseDto } from "./models/dtos/find-all-projects-response.dto";
import { FindProjectByIdResponseDto } from "./models/dtos/find-project-by-id-response.dto";
import { UsersService } from "src/users/users.service";

@Injectable()
export class ProjectsService {
    constructor(
        private readonly repository: ProjectsTypeOrmRepository,
        private readonly usersService: UsersService
    ) { }

    async create(data: CreateProjectDto): Promise<ProjectEntity> {
        return await tryCatch(async () => {
            const { name, description, userIds } = data;

            const project = new ProjectEntity(name, description);

            const savedProject = await this.repository.create(project);

            return savedProject;
        }, `Erro ao criar projeto`);
    }

    async findAll(): Promise<FindAllProjectsResponseDto> {
        return await tryCatch(async () => {
            const foundProjects = await this.repository.findAll();

            if (foundProjects?.length < 1) throw new NotFoundException(`Nenhum projeto encontrado`);

            return foundProjects.map(project => ({
                ...project,
                users: project.usersProjects.map(userProject => userProject.user),
                usersProjects: undefined
            }));
        }, `Erro ao buscar todos os projetos`);
    }

    async findById(id: number): Promise<FindProjectByIdResponseDto> {
        return await tryCatch(async () => {
            const foundProject = await this.repository.findById(id);

            if (!foundProject) throw new NotFoundException(`Projeto ${id} não encontrado`);

            return {
                ...foundProject,
                users: foundProject.usersProjects.map(userProject => userProject.user),
                usersProjects: undefined
            };
        }, `Erro ao buscar projeto ${id}`);
    }

    async update(id: number, data: UpdateProjectDto): Promise<{ message: 'Projeto atualizado com sucesso!' }> {
        return await tryCatch(async () => {
            if (Object.values(data).length < 1) throw new BadRequestException(`Envie ao menos uma informação para ser atualizada`);

            const foundProject = await this.findById(id);

            const updatedData = Object.assign(foundProject, data);

            const newProject = new ProjectEntity(updatedData.name, updatedData.description);
            newProject.id = foundProject.id;

            const result = await this.repository.update(newProject);

            if (result.affected < 1) throw new UnprocessableEntityException(`Não foi possível realizar a atualização dos valores`);
            if (result.affected > 1) throw new InternalServerErrorException(`Atualização afetou múltiplos registros (${result.affected} registros). Esperado: apenas 1.`);

            return { message: 'Projeto atualizado com sucesso!' };
        }, `Erro ao atualizar projeto ${id}`);
    }

    async delete(id: number): Promise<{ message: string }> {
        return await tryCatch(async () => {
            const foundProject: ProjectEntity = await this.findById(id) as any;

            const result = await this.repository.delete(foundProject);

            if (result.affected < 1) throw new UnprocessableEntityException(`Não foi possível remover o projeto ${foundProject.name}`);
            if (result.affected > 1) throw new InternalServerErrorException(`Remoção afetou múltiplos registros (${result.affected}). Esperado: apenas 1.`);

            return { message: `Projeto ${foundProject.name} deletado com sucesso.` };
        }, `Erro ao deletar projeto ${id}`);
    }
}