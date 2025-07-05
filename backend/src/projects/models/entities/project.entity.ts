import { TaskEntity } from "src/tasks/models/entities/task.entity";
import { UsersProjectsEntity } from "src/users-projetcs/models/entities/users-projetcs.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'projetcs' })
export class ProjectEntity {
    static readonly NAME_MAX_LENGTH = 100;

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: ProjectEntity.NAME_MAX_LENGTH, nullable: false })
    name: string;

    @Column({ type: "varchar" })
    description: string;

    // --{ RELATIONS }--

    @OneToMany(() => UsersProjectsEntity, userProject => userProject.project)
    usersProjects: UsersProjectsEntity[];

    @OneToMany(() => TaskEntity, task => task.project)
    tasks: TaskEntity[];
}