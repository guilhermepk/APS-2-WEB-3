import { ProjectEntity } from "src/projects/models/entities/project.entity";
import { UserEntity } from "src/users/models/entities/user.entity";
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'users-projects' })
export class UsersProjectsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    // --{ RELATIONS }--

    @JoinColumn({ name: 'fk_project' })
    @ManyToOne(() => ProjectEntity, project => project.id, { nullable: false })
    project: ProjectEntity;

    @JoinColumn({ name: 'fk_user' })
    @ManyToOne(() => UserEntity, user => user.id, { nullable: false })
    user: UserEntity;
}