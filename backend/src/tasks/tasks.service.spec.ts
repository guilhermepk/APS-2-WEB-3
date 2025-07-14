import { Test, TestingModule } from "@nestjs/testing";
import { TasksService } from "./tasks.service";
import { TasksTypeOrmRepository } from "./tasks.repository";
import { CreateTaskDto } from "./models/dtos/create-task.dto";
import { ProjectsService } from "src/projects/projects.service";
import { BadRequestException, InternalServerErrorException, NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { UpdateTaskDto } from "./models/dtos/update-task.dto";
import { UpdateResult } from "typeorm";

describe('TasksService', () => {
    let service: TasksService;

    const mockRepository = {
        create: jest.fn(),
        findById: jest.fn(),
        findAll: jest.fn(),
        update: jest.fn()
    }

    const projectService = {
        findById: jest.fn()
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TasksService,
                { provide: TasksTypeOrmRepository, useValue: mockRepository },
                { provide: ProjectsService, useValue: projectService }
            ]
        }).compile();

        service = module.get<TasksService>(TasksService);

        jest.clearAllMocks();
    });

    describe('create', () => {
        it('deveria criar uma tarefa', async () => {
            const dto: CreateTaskDto = { description: 'Tarefa 1', completed: false, projectId: 1 }

            const taskInDatabase = { id: 1, description: 'Tarefa 1', completed: false }

            mockRepository.create.mockResolvedValue(taskInDatabase);
            projectService.findById.mockResolvedValue({ id: 1, name: 'Projeto 1', description: null });

            const result = await service.create(dto);

            expect(mockRepository.create).toHaveBeenCalledTimes(1);
            expect(result).toEqual(taskInDatabase);
        });

        it('deveria estourar NotFoundException pro ID do projeto', async () => {
            const dto: CreateTaskDto = { description: 'Tarefa 1', completed: false, projectId: 1 }

            const taskInDatabase = { id: 1, description: 'Tarefa 1', completed: false }

            mockRepository.create.mockResolvedValue(taskInDatabase);
            projectService.findById.mockRejectedValue(new NotFoundException());

            try {
                await service.create(dto);
                fail('Deveria ter estourado NotFoundException');
            } catch (error) {
                expect(error).toBeInstanceOf(NotFoundException);
            }
        });

        it('deveria estourar um InternalServerErrorException personalizado quando o repositório falhasse', async () => {
            projectService.findById.mockResolvedValue({ id: 1, name: 'Projeto 1', description: null });
            mockRepository.create.mockRejectedValue(new Error('DB error'));

            const dto: CreateTaskDto = { description: 'Tarefa 1', completed: false, projectId: 1 }

            try {
                await service.create(dto);
                fail('Um InternalServerErrorException personalizado deveria ter estourado');
            } catch (error) {
                expect(error).toBeInstanceOf(InternalServerErrorException);
                expect(error.message).toEqual('Erro ao criar tarefa. DB error');
            }
        });
    });

    describe('findById', () => {
        it('deveria encontrar uma tarefa pelo ID', async () => {
            const taskInDatabase = { id: 1, description: 'Tarefa 1', completed: false }

            mockRepository.findById.mockResolvedValue(taskInDatabase);

            const result = await service.findById(1);

            expect(mockRepository.findById).toHaveBeenCalledTimes(1);
            expect(result).toEqual(taskInDatabase);
        });

        it('deveria estourar NotFoundException', async () => {
            mockRepository.findById.mockResolvedValue(null);

            try {
                await service.findById(1);
                fail('Deveria ter estourado NotFoundException');
            } catch (error) {
                expect(error).toBeInstanceOf(NotFoundException);
                expect(error.message).toEqual('Nenhuma tarefa encontrada com id 1');
            }
        });

        it('deveria estourar um InternalServerErrorException personalizado quando o repositório falhasse', async () => {
            mockRepository.findById.mockRejectedValue(new Error('DB error'));

            try {
                await service.findById(1);
                fail('Um InternalServerErrorException personalizado deveria ter estourado');
            } catch (error) {
                expect(error).toBeInstanceOf(InternalServerErrorException);
                expect(error.message).toEqual('Erro ao buscar tarefa 1. DB error');
            }
        });
    });

    describe('findAll', () => {
        it('deveria encontrar todas as tarefas', async () => {
            const tasksInDatabase = [
                { id: 1, description: 'Tarefa 1', completed: true },
                { id: 2, description: 'Tarefa 2', completed: true },
                { id: 3, description: 'Tarefa 3', completed: true },
            ];

            mockRepository.findAll.mockResolvedValue(tasksInDatabase);

            const result = await service.findAll();

            expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
            expect(result).toEqual(tasksInDatabase);
        });

        it('deveria estourar NotFoundException', async () => {
            mockRepository.findAll.mockResolvedValue([]);

            try {
                await service.findAll();
                fail('Deveria ter estourado NotFoundException');
            } catch (error) {
                expect(error).toBeInstanceOf(NotFoundException);
                expect(error.message).toEqual('Nenhuma tarefa encontrada');
            }
        });

        it('deveria estourar um InternalServerErrorException personalizado quando o repositório falhasse', async () => {
            mockRepository.findAll.mockRejectedValue(new Error('DB error'));

            try {
                await service.findAll();
                fail('Um InternalServerErrorException personalizado deveria ter estourado');
            } catch (error) {
                expect(error).toBeInstanceOf(InternalServerErrorException);
                expect(error.message).toEqual('Erro ao buscar todas as tarefas. DB error');
            }
        });
    });

    describe('update', () => {
        it('deveria atualizar as informações com sucesso', async () => {
            const dto: UpdateTaskDto = { completed: true, description: 'Nova descrição', projectId: 2 }

            const taskInDatabase = { id: 1, description: 'Tarefa 1', completed: false }

            mockRepository.findById.mockResolvedValue(taskInDatabase);
            projectService.findById.mockResolvedValue({ id: 2, name: 'Projeto 2', description: null });
            mockRepository.update.mockResolvedValue({ affected: 1 });

            const result = await service.update(1, dto);

            expect(mockRepository.findById).toHaveBeenCalledTimes(1);
            expect(projectService.findById).toHaveBeenCalledTimes(1);
            expect(result.message).toEqual('Tarefa atualizada com sucesso');
        });

        it('deveria estourar BadRequestException para um DTO vazio', async () => {
            try {
                await service.update(1, {});
                fail('Deveria ter estourado BadRequestException');
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestException);
                expect(error.message).toEqual('Envie ao menos uma informação para ser atualizada');
            }
        });

        it('deveria estourar NotFoundException para o ID da task', async () => {
            const dto: UpdateTaskDto = { completed: true, description: 'Nova descrição', projectId: 2 }

            mockRepository.findById.mockResolvedValue(null);

            try {
                await service.update(1, dto);
                fail('Deveria ter estourado NotFoundException');
            } catch (error) {
                expect(error).toBeInstanceOf(NotFoundException);
                expect(error.message).toEqual('Nenhuma tarefa encontrada com id 1');
            }
        });

        it('deveria estourar NotFoundException para o ID do novo projeto', async () => {
            const dto: UpdateTaskDto = { completed: true, description: 'Nova descrição', projectId: 2 }

            const taskInDatabase = { id: 1, description: 'Tarefa 1', completed: false }

            mockRepository.findById.mockResolvedValue(taskInDatabase);
            projectService.findById.mockRejectedValue(new NotFoundException());

            try {
                await service.update(1, dto);
                fail('Deveria ter estourado NotFoundException');
            } catch (error) {
                expect(error).toBeInstanceOf(NotFoundException);
            }
        });

        it('deveria estourar UnprocessableEntityException quando menos do que 1 registro fosse afetado pelo update', async () => {
            const dto: UpdateTaskDto = { completed: true, description: 'Nova descrição', projectId: 2 }

            const taskInDatabase = { id: 1, description: 'Tarefa 1', completed: false }

            mockRepository.findById.mockResolvedValue(taskInDatabase);
            projectService.findById.mockResolvedValue({ id: 2, name: 'Projeto 2', description: null });
            mockRepository.update.mockResolvedValue({ affected: 0 });

            try {
                await service.update(1, dto);
                fail('Deveria ter estourado UnprocessableEntityException');
            } catch (error) {
                expect(error).toBeInstanceOf(UnprocessableEntityException);
                expect(error.message).toEqual('Não foi possível atualizar a tarefa');
            }
        });

        it('deveria estourar um InternalServerError personalizado quando múltiplos registros fossem afetados pelo update', async () => {
            const dto: UpdateTaskDto = { completed: true, description: 'Nova descrição', projectId: 2 }

            const taskInDatabase = { id: 1, description: 'Tarefa 1', completed: false }

            mockRepository.findById.mockResolvedValue(taskInDatabase);
            projectService.findById.mockResolvedValue({ id: 2, name: 'Projeto 2', description: null });
            mockRepository.update.mockResolvedValue({ affected: 2 });

            try {
                await service.update(1, dto);
                fail('Um InternalServerErrorPersonalizado deveria ter estourado');
            } catch (error) {
                expect(error).toBeInstanceOf(InternalServerErrorException);
                expect(error.message).toEqual('Múltiplos registros afetados (2 registros). Esperado: apenas 1.');
            }
        });
    });
});