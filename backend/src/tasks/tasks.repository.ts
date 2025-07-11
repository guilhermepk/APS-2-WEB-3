import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TaskEntity } from "./models/entities/task.entity";
import { Repository } from "typeorm";

@Injectable()
export class TasksTypeOrmRepository {
    constructor(
        @InjectRepository(TaskEntity)
        private readonly repository: Repository<TaskEntity>
    ) { }

    async create(task: TaskEntity): Promise<TaskEntity> {
        return await this.repository.save(task);
    }

    async findAll(completed?: boolean): Promise<TaskEntity[]> {
        return await this.repository.find({
            relations: {
                project: true,
            },
            where: { completed },
        });
    }
}