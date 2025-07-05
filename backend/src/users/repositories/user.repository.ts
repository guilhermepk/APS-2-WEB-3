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


}