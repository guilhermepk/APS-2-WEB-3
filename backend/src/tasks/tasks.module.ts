import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TaskEntity } from "./models/entities/task.entity";
import { TasksController } from "./tasks.controller";
import { TasksTypeOrmRepository } from "./repositories/tasks.repository";
import { TasksService } from "./tasks.service";
import { ProjectsModule } from "src/projects/projects.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([TaskEntity]),
        ProjectsModule
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