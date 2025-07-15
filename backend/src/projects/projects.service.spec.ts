import { Test, TestingModule } from "@nestjs/testing";
import { ProjectsTypeOrmRepository } from "./repositories/projects.repository";
import { ProjectsService } from "./projects.service";
import { ProjectEntity } from "./models/entities/project.entity";
import { CreateProjectDto } from "./models/dtos/create-project.dto";
import { FindAllProjectsResponseDto } from "./models/dtos/find-all-projects-response.dto";
import { BadRequestException, InternalServerErrorException, NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { DeleteResult, EntityManager, UpdateResult } from "typeorm";
import { UsersService } from "src/users/users.service";
import { UsersProjectsService } from "src/users-projects/users-projects.service";

describe('ProjectsService', () => {
    let service: ProjectsService;

    const mockRepository = {
        create: jest.fn(),
        findAll: jest.fn(),
        findById: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
    }

    const usersService = {
        findById: jest.fn()
    }

    const usersProjectsService = {
        create: jest.fn()
    }

    const entityManager = {
        transaction: jest.fn()
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProjectsService,
                { provide: ProjectsTypeOrmRepository, useValue: mockRepository },
                { provide: UsersService, useValue: usersService },
                { provide: UsersProjectsService, useValue: usersProjectsService },
                { provide: EntityManager, useValue: entityManager },
            ]
        }).compile();

        service = module.get<ProjectsService>(ProjectsService);

        jest.clearAllMocks();
    });

    describe('create', () => {
        it('deveria criar um projeto e retornar a entidade', async () => {
            const dto: CreateProjectDto = { name: 'Projeto teste', description: 'Descrição', userIds: [1, 2, 3] };
            const projectInDatabase = {
                id: 1,
                name: 'Projeto teste',
                description: 'Descrição'
            };

            const transactionManager = {
                save: jest.fn()
            }

            entityManager.transaction.mockImplementation(async (cb: (manager: any) => Promise<any> | any) => {
                return await cb(transactionManager);
            });

            mockRepository.create.mockResolvedValue(projectInDatabase);

            usersService.findById
                .mockResolvedValueOnce({ id: 1, name: 'Usuário 1' })
                .mockResolvedValueOnce({ id: 2, name: 'Usuário 2' })
                .mockResolvedValueOnce({ id: 3, name: 'Usuário 3' });

            usersProjectsService.create
                .mockReturnValueOnce({ id: 1 })
                .mockReturnValueOnce({ id: 2 })
                .mockReturnValueOnce({ id: 3 });

            const result = await service.create(dto);

            expect(entityManager.transaction).toHaveBeenCalledTimes(1);

            expect(usersService.findById).toHaveBeenNthCalledWith(1, 1);
            expect(usersService.findById).toHaveBeenNthCalledWith(2, 2);
            expect(usersService.findById).toHaveBeenNthCalledWith(3, 3);
            expect(usersService.findById).toHaveBeenCalledTimes(3);

            expect(usersProjectsService.create).toHaveBeenNthCalledWith(1, { id: 1, name: 'Usuário 1' }, { id: 1, name: 'Projeto teste', description: 'Descrição' }, transactionManager);
            expect(usersProjectsService.create).toHaveBeenNthCalledWith(2, { id: 2, name: 'Usuário 2' }, { id: 1, name: 'Projeto teste', description: 'Descrição' }, transactionManager);
            expect(usersProjectsService.create).toHaveBeenNthCalledWith(3, { id: 3, name: 'Usuário 3' }, { id: 1, name: 'Projeto teste', description: 'Descrição' }, transactionManager);
            expect(usersProjectsService.create).toHaveBeenCalledTimes(3);

            expect(mockRepository.create).toHaveBeenCalledWith(expect.any(ProjectEntity), transactionManager);
            expect(result).toEqual(projectInDatabase);
        });

        it('deveria lançar um InternalServerErrorException personalizado quando o repositório falhasse', async () => {
            const dto: CreateProjectDto = { name: 'Projeto teste', description: 'Descrição', userIds: [1] };
            mockRepository.create.mockRejectedValue(new Error('DB error'));

            try {
                await service.create(dto);
                fail('Um InternalServerErrorException personalizado deveria ter sido estourado');
            } catch (error) {
                expect(error).toBeInstanceOf(InternalServerErrorException);
                expect(error.message).toEqual('Erro ao criar projeto. DB error');
            }
        });
    });

    describe('findAll', () => {
        it('deveria encontrar todos os projetos previstos', async () => {
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

        it('deveria estourar NotFoundException', async () => {
            mockRepository.findAll.mockResolvedValue([]);

            await expect(service.findAll()).rejects.toThrow(new NotFoundException('Nenhum projeto encontrado'));
        });

        it('deveria estourar um InternalServerErrorException personalizado quando o repositório falhasse', async () => {
            mockRepository.findAll.mockRejectedValue(new Error('DB error'));

            try {
                await service.findAll();
                fail('Um InternalServerErrorException personalizado deveria ter sido estourado');
            } catch (error) {
                expect(mockRepository.findAll).toHaveBeenCalled();

                expect(error).toBeInstanceOf(InternalServerErrorException);
                expect(error.message).toEqual('Erro ao buscar todos os projetos. DB error');
            }
        });
    });

    describe('findById', () => {
        it('deveria encontrar um projeto', async () => {
            const projectInDatabase = {
                id: 1,
                name: 'Projeto 1',
                description: 'Descrição 1',
                usersProjects: [
                    { id: 1, user: { id: 1, name: 'Usuário 1' } },
                    { id: 2, user: { id: 2, name: 'Usuário 2' } }
                ],
                tasks: [
                    { id: 1, descriptions: 'Tarefa 1', completed: true },
                    { id: 2, descriptions: 'Tarefa 2', completed: false }
                ]
            };

            mockRepository.findById.mockResolvedValue(projectInDatabase);

            const result = await service.findById(1);

            expect(mockRepository.findById).toHaveBeenCalledWith(1);
            expect(result).toEqual({
                id: 1,
                name: 'Projeto 1',
                description: 'Descrição 1',
                users: [
                    { id: 1, name: 'Usuário 1' },
                    { id: 2, name: 'Usuário 2' }
                ],
                tasks: [
                    { id: 1, descriptions: 'Tarefa 1', completed: true },
                    { id: 2, descriptions: 'Tarefa 2', completed: false }
                ]
            });
        });

        it('deveria estourar NotFoundException', async () => {
            mockRepository.findById.mockResolvedValue(null);

            try {
                await service.findById(1);

                fail('NotFoundException deveria ter sido estourado');
            } catch (error) {
                expect(mockRepository.findById).toHaveBeenCalledWith(1);

                expect(error).toBeInstanceOf(NotFoundException);
                expect(error.message).toEqual('Projeto 1 não encontrado');
            }
        });

        it('deveria estourar um InternalServerErrorException personalizado', async () => {
            mockRepository.findById.mockRejectedValue(new Error('DB error'));

            try {
                await service.findById(1);
            } catch (error) {
                expect(error).toBeInstanceOf(InternalServerErrorException);
                expect(error.message).toEqual('Erro ao buscar projeto 1. DB error');
            }
        });
    });

    describe('update', () => {
        it('deveria atualizar as informações no banco de dados', async () => {
            const projectInDatabase = {
                id: 1,
                name: 'Projeto 1',
                description: 'Descrição 1',
                usersProjects: [
                    { id: 1, user: { id: 1, name: 'Usuário 1' } },
                    { id: 2, user: { id: 2, name: 'Usuário 2' } }
                ],
                tasks: [
                    { id: 1, descriptions: 'Tarefa 1', completed: true },
                    { id: 2, descriptions: 'Tarefa 2', completed: false }
                ]
            };
            mockRepository.findById.mockResolvedValue(projectInDatabase);

            const updateResult = new UpdateResult();
            updateResult.affected = 1;
            mockRepository.update.mockResolvedValue(updateResult);

            const result = await service.update(1, { name: 'Novo nome', description: 'Nova descrição' });

            expect(mockRepository.update).toHaveBeenCalledTimes(1);
            expect(result).toEqual({ message: 'Projeto atualizado com sucesso!' });
        });

        it('deveria estourar BadRequestException quando recebesse um dto vazio', async () => {
            try {
                await service.update(1, {});
                fail('Um BadRequestException ter sido estourado');
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestException);
                expect(error.message).toEqual('Envie ao menos uma informação para ser atualizada');
            }
        });

        it('deveria estourar UnprocessableEntityException quando menos de 1 entidade fosse afetada pelo update', async () => {
            const projectInDatabase = {
                id: 1,
                name: 'Projeto 1',
                description: 'Descrição 1',
                usersProjects: [
                    { id: 1, user: { id: 1, name: 'Usuário 1' } },
                    { id: 2, user: { id: 2, name: 'Usuário 2' } }
                ],
                tasks: [
                    { id: 1, descriptions: 'Tarefa 1', completed: true },
                    { id: 2, descriptions: 'Tarefa 2', completed: false }
                ]
            };
            mockRepository.findById.mockResolvedValue(projectInDatabase);

            const updateResult = new UpdateResult();
            updateResult.affected = 0;
            mockRepository.update.mockResolvedValue(updateResult);

            try {
                await service.update(1, { name: 'Novo nome', description: 'Nova descrição' });
                fail('UnprocessableEntityException deveria ter sido estourado');
            } catch (error) {
                expect(error).toBeInstanceOf(UnprocessableEntityException);
                expect(error.message).toEqual('Não foi possível realizar a atualização dos valores');
            }
        });

        it('deveria estourar InternalServerErrorException quando mais do que 1 entidade fosse afetada pelo update', async () => {
            const projectInDatabase = {
                id: 1,
                name: 'Projeto 1',
                description: 'Descrição 1',
                usersProjects: [
                    { id: 1, user: { id: 1, name: 'Usuário 1' } },
                    { id: 2, user: { id: 2, name: 'Usuário 2' } }
                ],
                tasks: [
                    { id: 1, descriptions: 'Tarefa 1', completed: true },
                    { id: 2, descriptions: 'Tarefa 2', completed: false }
                ]
            };
            mockRepository.findById.mockResolvedValue(projectInDatabase);

            const updateResult = new UpdateResult();
            updateResult.affected = 2
            mockRepository.update.mockResolvedValue(updateResult);

            try {
                await service.update(1, { name: 'Novo nome', description: 'Nova descrição' });
                fail('InternalServerErrorException deveria ter sido estourado');
            } catch (error) {
                expect(error).toBeInstanceOf(InternalServerErrorException);
                expect(error.message).toEqual('Atualização afetou múltiplos registros (2 registros). Esperado: apenas 1.');
            }
        });
    });

    describe('delete', () => {
        it('deveria deletar um projeto da base de dados', async () => {
            const projectInDatabase = {
                id: 1,
                name: 'TCC',
                description: 'Descrição 1',
                usersProjects: [
                    { id: 1, user: { id: 1, name: 'Usuário 1' } },
                    { id: 2, user: { id: 2, name: 'Usuário 2' } }
                ],
                tasks: [
                    { id: 1, descriptions: 'Tarefa 1', completed: true },
                    { id: 2, descriptions: 'Tarefa 2', completed: false }
                ]
            };
            mockRepository.findById.mockResolvedValue(projectInDatabase);

            const deleteResult = new DeleteResult();
            deleteResult.affected = 1
            mockRepository.delete.mockResolvedValue(deleteResult);

            const result = await service.delete(1);

            expect(mockRepository.delete).toHaveBeenCalledTimes(1);
            expect(result).toEqual({ message: `Projeto TCC deletado com sucesso.` });
        });

        it('deveria estourar UnprocessableEntityException quando menos do que 1 entidade fosse afetada pelo delete', async () => {
            const projectInDatabase = {
                id: 1,
                name: 'Projeto 1',
                description: 'Descrição 1',
                usersProjects: [
                    { id: 1, user: { id: 1, name: 'Usuário 1' } },
                    { id: 2, user: { id: 2, name: 'Usuário 2' } }
                ],
                tasks: [
                    { id: 1, descriptions: 'Tarefa 1', completed: true },
                    { id: 2, descriptions: 'Tarefa 2', completed: false }
                ]
            };
            mockRepository.findById.mockResolvedValue(projectInDatabase);

            const deleteResult = new DeleteResult();
            deleteResult.affected = 0
            mockRepository.delete.mockResolvedValue(deleteResult);

            try {
                await service.delete(1);
                fail('UnprocessableEntityException deveria ter sido estourado');
            } catch (error) {
                expect(error).toBeInstanceOf(UnprocessableEntityException);
                expect(error.message).toEqual('Não foi possível remover o projeto Projeto 1');
            }
        });

        it('deveria estourar InternalServerErrorException quando mais do que 1 entidade fosse afetada pelo delete', async () => {
            const projectInDatabase = {
                id: 1,
                name: 'Projeto 1',
                description: 'Descrição 1',
                usersProjects: [
                    { id: 1, user: { id: 1, name: 'Usuário 1' } },
                    { id: 2, user: { id: 2, name: 'Usuário 2' } }
                ],
                tasks: [
                    { id: 1, descriptions: 'Tarefa 1', completed: true },
                    { id: 2, descriptions: 'Tarefa 2', completed: false }
                ]
            };
            mockRepository.findById.mockResolvedValue(projectInDatabase);

            const deleteResult = new DeleteResult();
            deleteResult.affected = 2
            mockRepository.delete.mockResolvedValue(deleteResult);

            try {
                await service.delete(1);
                fail('InternalServerErrorException deveria ter sido estourado');
            } catch (error) {
                expect(error).toBeInstanceOf(InternalServerErrorException);
                expect(error.message).toEqual('Remoção afetou múltiplos registros (2 registros). Esperado: apenas 1.');
            }
        });
    });
});
