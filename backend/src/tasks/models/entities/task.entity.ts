import { ProjectEntity } from "src/projects/models/entities/project.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TaskStatusEnum } from "../enums/task-status.enum";

@Entity({ name: 'tasks' })
export class TaskEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", nullable: false })
    description: string;

    @Column({ type: "enum", default: TaskStatusEnum.PENDING, nullable: false, enum: TaskStatusEnum })
    status: TaskStatusEnum;

    // --{ RELATIONS }--

    @JoinColumn({ name: 'fk_project' })
    @ManyToOne(() => ProjectEntity, project => project.tasks, { nullable: false })
    project: ProjectEntity;
}