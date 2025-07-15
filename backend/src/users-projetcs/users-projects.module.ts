import { Module } from "@nestjs/common";
import { UserProjectEntity } from "./models/entities/user-project";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersProjectsTypeOrmRepository } from "./repositories/users-projects.repository";
import { UsersProjectsService } from "./users-projects.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserProjectEntity])
    ],
    providers: [
        UsersProjectsTypeOrmRepository,
        UsersProjectsService
    ],
    exports: [
        UsersProjectsService
    ]
})
export class UsersProjectsModule { }