import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserProjectEntity } from "./models/entities/user-project";
import { Repository } from "typeorm";

@Injectable()
export class UsersProjectsTypeOrmRepository {
    constructor(
        @InjectRepository(UserProjectEntity)
        private readonly repository: Repository<UserProjectEntity>
    ) { }

    async create(userProject: UserProjectEntity): Promise<UserProjectEntity> {
        return await this.repository.save(userProject);
    }
}