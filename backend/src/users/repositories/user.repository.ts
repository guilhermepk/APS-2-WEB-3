import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../models/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UsersTypeOrmRepository {
    constructor(
        @InjectRepository(UserEntity)
        private readonly repository: Repository<UserEntity>
    ) { }

    async create(user: UserEntity): Promise<UserEntity> {
        return await this.repository.save(user);
    }

    async findById(id: number): Promise<UserEntity> {
        return await this.repository.findOne({ where: { id } });
    }

    async findAll(): Promise<Array<UserEntity>> {
        return await this.repository.find();
    }
}