import { Module } from "@nestjs/common";
import { UserProjectEntity } from "./models/entities/user-project";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserProjectEntity])
    ]
})
export class UsersProjectsModule { }