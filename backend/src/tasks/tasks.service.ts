import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { TasksTypeOrmRepository } from "./tasks.repository";
import { tryCatch } from "src/common/functions/try-catch.function";
import { TaskEntity } from "./models/entities/task.entity";
import { CreateTaskDto } from "./models/dtos/create-task.dto";
import { ProjectsService } from "src/projects/projects.service";
import { ProjectEntity } from "src/projects/models/entities/project.entity";
import { UpdateTaskDto } from "./models/dtos/update-task.dto";
import { FindAllTasksResponseDto } from "./models/dtos/find-all-tasks-response.dto";

@Injectable()
export class TasksService {
    constructor(
        private readonly repository: TasksTypeOrmRepository,
        private readonly projectsService: ProjectsService
    ) { }

    async create(data: CreateTaskDto): Promise<TaskEntity> {
        return await tryCatch(async () => {
            const { description, projectId, completed } = data;

            const foundProject: ProjectEntity = await this.projectsService.findById(projectId) as any;

            const task = new TaskEntity(description, foundProject, completed);

            return await this.repository.create(task);
        }, `Erro ao criar tarefa`);
    }

    async findById(id: number): Promise<TaskEntity> {
        return await tryCatch(async () => {
            const foundTask = await this.repository.findById(id);

            if (!foundTask) throw new NotFoundException(`Nenhuma tarefa encontrada com id ${id}`);

            return foundTask;
        }, `Erro ao buscar tarefa ${id}`);
    }

    async findAll(completed?: boolean): Promise<FindAllTasksResponseDto> {
        return await tryCatch(async () => {
            const foundTasks = await this.repository.findAll(completed);

            if (foundTasks?.length < 1) throw new NotFoundException(`Nenhuma tarefa encontrada`);

            return foundTasks;
        }, `Erro ao buscar todas as tarefas`);
    }

    async update(id: number, data: UpdateTaskDto): Promise<{ message: 'Tarefa atualizada com sucesso' }> {
        return await tryCatch(async () => {
            if (Object.values(data).length < 1) throw new BadRequestException(`Envie ao menos uma informação para ser atualizada`);

            const foundTask = await this.findById(id);

            const newData = { ...Object.assign(foundTask, data), projectId: undefined };
            if (data.projectId) newData.project = await this.projectsService.findById(data.projectId) as any;

            const result = await this.repository.update(newData);

            if (result.affected < 1) throw new UnprocessableEntityException(`Não foi possível atualizar a tarefa`);
            if (result.affected > 1) throw new InternalServerErrorException(`Múltiplos registros afetados (${result.affected} registros). Esperado: apenas 1.`);

            return { message: 'Tarefa atualizada com sucesso' };
        }, `Erro ao atualizar tarefa ${id}`);
    }
}