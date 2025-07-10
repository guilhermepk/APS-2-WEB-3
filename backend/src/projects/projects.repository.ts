import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { ProjectEntity } from "./models/entities/project.entity";

@Injectable()
export class ProjectsTypeOrmRepository {
    constructor(
        @InjectRepository(ProjectEntity)
        private readonly repository: Repository<ProjectEntity>
    ) { }

    async create(project: ProjectEntity): Promise<ProjectEntity> {
        return await this.repository.save(project);
    }

    async findAll(): Promise<ProjectEntity[] | null> {
        return this.repository.find({
            relations: {
                usersProjects: {
                    user: true
                }
            }
        });
    }

    async findById(id: number): Promise<ProjectEntity | null> {
        return this.repository.findOne({
            where: { id }
        });
    }

    async update(updatedProject: ProjectEntity): Promise<UpdateResult> {
        return await this.repository.update(updatedProject.id, updatedProject);
    }

    async delete(project: ProjectEntity): Promise<DeleteResult> {
        return await this.repository.delete({ id: project.id });
    }
}