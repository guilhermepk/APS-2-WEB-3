import { Test, TestingModule } from "@nestjs/testing";
import { UsersProjectsService } from "./users-projects.service";
import { UsersProjectsTypeOrmRepository } from "./users-projects.repository";
import { UserEntity } from "src/users/models/entities/user.entity";
import { ProjectEntity } from "src/projects/models/entities/project.entity";

describe('UsersProjectsService', () => {
    let service: UsersProjectsService;

    const mockRepository = {
        create: jest.fn()
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersProjectsService,
                { provide: UsersProjectsTypeOrmRepository, useValue: mockRepository }
            ]
        }).compile();

        service = module.get<UsersProjectsService>(UsersProjectsService);

        jest.clearAllMocks();
    });

    describe('create', () => {
        it('deveria criar uma relação entre um usuário e um projeto', async () => {
            const userProjectInDatabase = { id: 1 };
            mockRepository.create.mockResolvedValue(userProjectInDatabase);

            const user = new UserEntity('Usuário 1');
            const project = new ProjectEntity('Projeto 1', 'Descrição');

            const result = await service.create(user, project);

            expect(result).toEqual(userProjectInDatabase);
        });
    });
});