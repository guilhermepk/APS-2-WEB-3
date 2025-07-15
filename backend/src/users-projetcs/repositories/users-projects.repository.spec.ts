import { Test, TestingModule } from "@nestjs/testing";
import { UsersProjectsTypeOrmRepository } from "./users-projects.repository";
import { Repository } from "typeorm";
import { UserProjectEntity } from "../models/entities/user-project";
import { UserEntity } from "src/users/models/entities/user.entity";
import { ProjectEntity } from "src/projects/models/entities/project.entity";
import { getRepositoryToken } from "@nestjs/typeorm";

describe('UsersProjectsTypeOrmRepository', () => {
    let customRepository: UsersProjectsTypeOrmRepository;
    let mockRepository: jest.Mocked<Repository<UserProjectEntity>>;

    beforeEach(async () => {
        mockRepository = {
            save: jest.fn()
        } as any;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersProjectsTypeOrmRepository,
                {
                    provide: getRepositoryToken(UserProjectEntity),
                    useValue: mockRepository
                }
            ]
        }).compile();

        customRepository = module.get<UsersProjectsTypeOrmRepository>(UsersProjectsTypeOrmRepository);

        jest.clearAllMocks();
    });

    describe('create', () => {
        it('deveria salvar uma relação entre um projeto e um usuário no banco de dados', async () => {
            const userProjectInDatabase = { id: 1 } as UserProjectEntity;

            mockRepository.save.mockResolvedValue(userProjectInDatabase);

            const user = new UserEntity('Usuário 1');
            const project = new ProjectEntity('Projeto 1', 'Descrição 1');
            const userProject = new UserProjectEntity(user, project);

            const result = await customRepository.create(userProject);

            expect(mockRepository.save).toHaveBeenCalledWith(userProject);
            expect(mockRepository.save).toHaveBeenCalledTimes(1);
            expect(result).toEqual(userProjectInDatabase);
        });

        it('deveria salvar uma relação entre um projeto e um usuário no banco de dados, utilizando o entityManager da transaction', async () => {
            const userProjectInDatabase = { id: 1 } as UserProjectEntity;

            const transactionManager = {
                save: jest.fn()
            } as any;
            transactionManager.save.mockResolvedValue(userProjectInDatabase);

            const user = new UserEntity('Usuário 1');
            const project = new ProjectEntity('Projeto 1', 'Descrição 1');
            const userProject = new UserProjectEntity(user, project);


            const result = await customRepository.create(userProject, transactionManager);

            expect(transactionManager.save).toHaveBeenCalledWith(userProject);
            expect(transactionManager.save).toHaveBeenCalledTimes(1);
            expect(result).toEqual(userProjectInDatabase);
        });
    });
});
