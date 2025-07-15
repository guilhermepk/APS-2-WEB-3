import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TaskEntity } from "../models/entities/task.entity";
import { DeleteResult, Repository, UpdateResult } from "typeorm";

@Injectable()
export class TasksTypeOrmRepository {
    constructor(
        @InjectRepository(TaskEntity)
        private readonly repository: Repository<TaskEntity>
    ) { }

    async create(task: TaskEntity): Promise<TaskEntity> {
        return await this.repository.save(task);
    }

    async findById(id: number): Promise<TaskEntity> {
        return await this.repository.findOne({ where: { id } });
    }

    async findAll(completed?: boolean): Promise<TaskEntity[]> {
        return await this.repository.find({
            relations: {
                project: true,
            },
            where: { completed },
            order: {
                completed: "ASC"
            }
        });
    }

    async update(newData: TaskEntity): Promise<UpdateResult> {
        return await this.repository.update(newData.id, newData);
    }

    async delete(task: TaskEntity): Promise<DeleteResult> {
        return await this.repository.delete(task.id);
    }
}