import { Injectable } from "@nestjs/common";
import { UsersTypeOrmRepository } from "./user.repository";
import { UserEntity } from "./models/entities/user.entity";
import { tryCatch } from "src/common/functions/try-catch.function";

@Injectable()
export class UsersService {
    constructor(
        private readonly repository: UsersTypeOrmRepository
    ) { }

    async findAll(): Promise<Array<UserEntity>> {
        return await tryCatch(async () => {
            return await this.repository.findAll();
        }, `Erro ao buscar todos os usuários`);
    }
}