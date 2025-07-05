import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProjectEntity } from "./models/entities/project.entity";
import { ProjectsController } from "./projects.controller";
import { ProjectsTypeOrmRepository } from "./projects.repository";
import { ProjectsService } from "./projects.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([ProjectEntity])
    ],
    controllers: [
        ProjectsController
    ],
    providers: [
        ProjectsTypeOrmRepository,
        ProjectsService
    ],
})
export class ProjectsModule { }