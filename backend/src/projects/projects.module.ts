import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProjectEntity } from "./models/entities/project.entity";
import { ProjectsController } from "./projects.controller";
import { ProjectsTypeOrmRepository } from "./projects.repository";
import { ProjectsService } from "./projects.service";
import { UsersModule } from "src/users/users.module";
import { UsersProjectsModule } from "src/users-projects/users-projects.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([ProjectEntity]),
        UsersModule,
        UsersProjectsModule
    ],
    controllers: [
        ProjectsController
    ],
    providers: [
        ProjectsTypeOrmRepository,
        ProjectsService
    ],
    exports: [
        ProjectsService
    ]
})
export class ProjectsModule { }