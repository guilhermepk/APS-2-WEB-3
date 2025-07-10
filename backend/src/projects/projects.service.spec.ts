import { Test, TestingModule } from "@nestjs/testing";
import { ProjectsTypeOrmRepository } from "./projects.repository";
import { ProjectsService } from "./projects.service";
import { ProjectEntity } from "./models/entities/project.entity";
import { CreateProjectDto } from "./models/dtos/create-project.dto";
import { FindAllProjectsResponseDto } from "./models/dtos/find-all-projects-response.dto";

describe('ProjectsService', () => {
    let service: ProjectsService;
    let repository: ProjectsTypeOrmRepository;

    const mockRepository = {
        create: jest.fn(),
        findAll: jest.fn()
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProjectsService,
                { provide: ProjectsTypeOrmRepository, useValue: mockRepository }
            ]
        }).compile();

        service = module.get<ProjectsService>(ProjectsService);
        repository = module.get<ProjectsTypeOrmRepository>(ProjectsTypeOrmRepository);

        jest.clearAllMocks();
    });

    describe('create', () => {
        it('deveria criar um projeto e retornar a entidade', async () => {
            const dto: CreateProjectDto = { name: 'Projeto teste', description: 'Descrição' };
            const projectEntity: ProjectEntity = {
                id: 1,
                name: dto.name,
                description: dto.description,
                usersProjects: [],
                tasks: []
            };

            mockRepository.create.mockResolvedValue(projectEntity);

            const result = await service.create(dto);

            expect(mockRepository.create).toHaveBeenCalledWith(expect.any(ProjectEntity));
            expect(result).toEqual(projectEntity);
        });

        it('deve lançar uma exceção HTTP 500 tratada quando o quando o repository falhar', async () => {
            const dto: CreateProjectDto = { name: 'Projeto teste', description: 'Descrição' };
            mockRepository.create.mockRejectedValue(new Error('DB error'));

            await expect(service.create(dto)).rejects.toThrow('Erro ao criar projeto');
        });
    });

    describe('find-all', () => {
        it('deveria encontrar todos os projetos (2)', async () => {
            const projectsInDatabase: Array<{
                id: number,
                name: string,
                description: string,
                usersProjects: Array<{
                    user: { id: number, name: string }
                }>
            }> = [
                    {
                        id: 1,
                        name: 'Projeto 1',
                        description: 'Descrição 1',
                        usersProjects: [{ user: { id: 1, name: 'Usuário 1' } }]
                    },
                    {
                        id: 2,
                        name: 'Projeto 2',
                        description: 'Descrição 2',
                        usersProjects: [{ user: { id: 2, name: 'Usuário 2' } }, { user: { id: 3, name: 'Usuário 3' } }]
                    }
                ];

            mockRepository.findAll.mockResolvedValue(projectsInDatabase);

            const result = await service.findAll();

            const expectedResult: FindAllProjectsResponseDto = [
                {
                    id: 1,
                    name: 'Projeto 1',
                    description: 'Descrição 1',
                    users: [{ id: 1, name: 'Usuário 1' }]
                },
                {
                    id: 2,
                    name: 'Projeto 2',
                    description: 'Descrição 2',
                    users: [{ id: 2, name: 'Usuário 2' }, { id: 3, name: 'Usuário 3' }]
                }
            ];

            expect(mockRepository.findAll).toHaveBeenCalled();
            expect(result).toEqual(expectedResult);
        });
    });
});
