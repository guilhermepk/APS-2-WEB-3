import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserProjectEntity } from "../models/entities/user-project";
import { EntityManager, Repository } from "typeorm";

@Injectable()
export class UsersProjectsTypeOrmRepository {
    constructor(
        @InjectRepository(UserProjectEntity)
        private readonly repository: Repository<UserProjectEntity>
    ) { }

    async create(userProject: UserProjectEntity, entityManager?: EntityManager): Promise<UserProjectEntity> {
        if (entityManager) return entityManager.save(userProject);
        else return await this.repository.save(userProject);
    }
}