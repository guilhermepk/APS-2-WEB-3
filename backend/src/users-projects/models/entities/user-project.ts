import { ProjectEntity } from "src/projects/models/entities/project.entity";
import { UserEntity } from "src/users/models/entities/user.entity";
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'users-projects' })
export class UserProjectEntity {
    constructor(user: UserEntity, project: ProjectEntity) {
        this.user = user;
        this.project = project;
    }

    @PrimaryGeneratedColumn()
    id: number;

    // --{ RELATIONS }--

    @JoinColumn({ name: 'fk_project' })
    @ManyToOne(() => ProjectEntity, project => project.usersProjects, { nullable: false, onDelete: "CASCADE" })
    project: ProjectEntity;

    @JoinColumn({ name: 'fk_user' })
    @ManyToOne(() => UserEntity, user => user.usersProjects, { nullable: false })
    user: UserEntity;
}