import { Module } from "@nestjs/common";
import { UserEntity } from "./models/entities/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { UsersTypeOrmRepository } from "./user.repository";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity])
    ],
    providers: [
        UsersTypeOrmRepository,
        UsersService
    ],
    controllers: [
        UsersController
    ],
})
export class UsersModule { }