import { Module } from "@nestjs/common";
import { UsersProjectsEntity } from "./models/entities/users-projetcs.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [
        TypeOrmModule.forFeature([UsersProjectsEntity])
    ]
})
export class UsersProjectsModule { }