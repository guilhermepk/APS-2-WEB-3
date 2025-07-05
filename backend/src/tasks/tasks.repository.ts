import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TaskEntity } from "./models/entities/task.entity";
import { Repository } from "typeorm";
import { TaskStatusEnum } from "./models/enums/task-status.enum";

@Injectable()
export class TasksTypeOrmRepository {
    constructor(
        @InjectRepository(TaskEntity)
        private readonly repository: Repository<TaskEntity>
    ) { }

    async findAll(status?: TaskStatusEnum): Promise<TaskEntity[]> {
        return await this.repository.find({
            relations: {
                project: true,
            },
            where: { status },
        });
    }
}