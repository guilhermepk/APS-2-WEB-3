import { Injectable, NotFoundException } from "@nestjs/common";
import { TasksTypeOrmRepository } from "./tasks.repository";
import { tryCatch } from "src/common/functions/try-catch.function";
import { TaskEntity } from "./models/entities/task.entity";
import { CreateTaskDto } from "./models/dtos/create-task.dto";
import { ProjectsService } from "src/projects/projects.service";
import { ProjectEntity } from "src/projects/models/entities/project.entity";

@Injectable()
export class TasksService {
    constructor(
        private readonly repository: TasksTypeOrmRepository,
        private readonly projectsService: ProjectsService
    ) { }

    async create(data: CreateTaskDto): Promise<{ message: 'Tarefa criada com sucesso!' }> {
        return await tryCatch(async () => {
            const { description, projectId, completed } = data;

            const foundProject: ProjectEntity = await this.projectsService.findById(projectId);

            const task = new TaskEntity(description, foundProject, completed);

            await this.repository.create(task);

            return { message: 'Tarefa criada com sucesso!' };
        }, `Erro ao criar tarefa`);
    }

    async findAll(completed: boolean): Promise<TaskEntity[]> {
        return await tryCatch(async () => {
            const foundTasks = await this.repository.findAll(completed);

            if (!foundTasks) throw new NotFoundException(`Nenhuma tarefa encontrada`);

            return foundTasks;
        }, `Erro ao buscar todas as tarefas`);
    }
}