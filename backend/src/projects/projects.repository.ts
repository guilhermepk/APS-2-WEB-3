import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProjectEntity } from "./models/entities/project.entity";

@Injectable()
export class ProjectsTypeOrmRepository {
    constructor(
        @InjectRepository(ProjectEntity)
        private readonly repository: Repository<ProjectEntity>
    ) { }

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
}