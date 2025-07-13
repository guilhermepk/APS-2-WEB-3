import { UserProjectEntity } from "src/users-projetcs/models/entities/user-project";
import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'users' })
export class UserEntity {
    constructor(name: string) {
        this.name = name;
    }

    static readonly NAME_MAX_LENGTH = 100;

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: UserEntity.NAME_MAX_LENGTH, nullable: false })
    name: string;

    // --{ RELATIONS }--

    @OneToMany(() => UserProjectEntity, userProject => userProject.user)
    usersProjects: UserProjectEntity[];
}