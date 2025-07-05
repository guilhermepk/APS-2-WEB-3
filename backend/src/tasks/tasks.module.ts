import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TaskEntity } from "./models/entities/task.entity";
import { TasksController } from "./tasks.controller";
import { TasksTypeOrmRepository } from "./tasks.repository";
import { TasksService } from "./tasks.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([TaskEntity]),
    ],
    controllers: [
        TasksController
    ],
    providers: [
        TasksTypeOrmRepository,
        TasksService
    ],
})
export class TasksModule { }