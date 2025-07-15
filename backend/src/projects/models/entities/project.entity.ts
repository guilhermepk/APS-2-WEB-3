import { TaskEntity } from "src/tasks/models/entities/task.entity";
import { UserProjectEntity } from "src/users-projects/models/entities/user-project";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'projects' })
export class ProjectEntity {
    constructor(name: string, description?: string) {
        this.name = name;
        this.description = description;
    }

    static readonly NAME_MAX_LENGTH = 100;

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: ProjectEntity.NAME_MAX_LENGTH, nullable: false })
    name: string;

    @Column({ type: "varchar", nullable: true })
    description?: string;

    // --{ RELATIONS }--

    @OneToMany(() => UserProjectEntity, userProject => userProject.project)
    usersProjects: UserProjectEntity[];

    @OneToMany(() => TaskEntity, task => task.project)
    tasks: TaskEntity[];
}