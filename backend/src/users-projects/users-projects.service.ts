import { Injectable } from "@nestjs/common";
import { UserProjectEntity } from "./models/entities/user-project";
import { tryCatch } from "src/common/functions/try-catch.function";
import { UsersProjectsTypeOrmRepository } from "./repositories/users-projects.repository";
import { UserEntity } from "src/users/models/entities/user.entity";
import { ProjectEntity } from "src/projects/models/entities/project.entity";
import { EntityManager } from "typeorm";

@Injectable()
export class UsersProjectsService {
    constructor(
        private readonly repository: UsersProjectsTypeOrmRepository
    ) { }

    async create(user: UserEntity, project: ProjectEntity, entityManager?: EntityManager): Promise<UserProjectEntity> {
        return await tryCatch(async () => {
            const userProject = new UserProjectEntity(user, project);

            return await this.repository.create(userProject, entityManager);
        }, `Erro ao criar relação entre projeto e usuário`);
    }
}