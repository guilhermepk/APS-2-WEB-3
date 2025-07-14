import { Injectable, NotFoundException } from "@nestjs/common";
import { UsersTypeOrmRepository } from "./user.repository";
import { UserEntity } from "./models/entities/user.entity";
import { tryCatch } from "src/common/functions/try-catch.function";
import { CreateUserDto } from "./models/dtos/create-user.dto";

@Injectable()
export class UsersService {
    constructor(
        private readonly repository: UsersTypeOrmRepository
    ) { }

    async create(data: CreateUserDto): Promise<UserEntity> {
        return await tryCatch(async () => {
            const { name } = data;

            const user = new UserEntity(name);

            return await this.repository.create(user);
        }, `Erro ao criar usuário`);
    }

    async findById(id: number): Promise<UserEntity> {
        return await tryCatch(async () => {
            const foundUser = await this.repository.findById(id);

            if (!foundUser) throw new NotFoundException(`Nenhum usuário encontrado com ID ${id}`);

            return foundUser;
        }, `Erro ao buscar usuário ${id}`);
    }

    async findAll(): Promise<Array<UserEntity>> {
        return await tryCatch(async () => {
            return await this.repository.findAll();
        }, `Erro ao buscar todos os usuários`);
    }
}