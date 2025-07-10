import { UserEntity } from "src/users/models/entities/user.entity";
import { ProjectEntity } from "../entities/project.entity";

export type FindAllProjectsResponseDto = Array<Omit<ProjectEntity, 'usersProjects' | 'tasks'> & { users: Array<Omit<UserEntity, 'usersProjects'>> }>;