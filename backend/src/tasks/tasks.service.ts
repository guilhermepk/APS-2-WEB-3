import { Injectable, NotFoundException } from "@nestjs/common";
import { TasksTypeOrmRepository } from "./tasks.repository";
import { tryCatch } from "src/common/functions/try-catch.function";
import { TaskEntity } from "./models/entities/task.entity";

@Injectable()
export class TasksService {
    constructor(
        private readonly repository: TasksTypeOrmRepository
    ) { }

    async findAll(completed: boolean): Promise<TaskEntity[]> {
        return await tryCatch(async () => {
            const foundTasks = await this.repository.findAll(completed);

            if (!foundTasks) throw new NotFoundException(`Nenhuma tarefa encontrada`);

            return foundTasks;
        }, `Erro ao buscar todas as tarefas`);
    }
}