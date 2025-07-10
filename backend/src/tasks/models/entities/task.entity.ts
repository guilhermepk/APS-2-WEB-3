import { ProjectEntity } from "src/projects/models/entities/project.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'tasks' })
export class TaskEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", nullable: false })
    description: string;

    @Column({ type: 'boolean' })
    completed: boolean;

    // --{ RELATIONS }--

    @JoinColumn({ name: 'fk_project' })
    @ManyToOne(() => ProjectEntity, project => project.tasks, { nullable: false })
    project: ProjectEntity;
}