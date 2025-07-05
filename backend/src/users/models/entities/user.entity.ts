import { UsersProjectsEntity } from "src/users-projetcs/models/entities/users-projetcs.entity";
import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'users' })
export class UserEntity {
    static readonly NAME_MAX_LENGTH = 100;

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: UserEntity.NAME_MAX_LENGTH, nullable: false })
    name: string;

    // --{ RELATIONS }--

    @OneToMany(() => UsersProjectsEntity, userProject => userProject.user)
    usersProjects: UsersProjectsEntity[];
}