import { Test, TestingModule } from "@nestjs/testing";
import { TasksService } from "./tasks.service";
import { TasksTypeOrmRepository } from "./tasks.repository";
import { CreateTaskDto } from "./models/dtos/create-task.dto";
import { ProjectsService } from "src/projects/projects.service";
import { InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { TaskEntity } from "./models/entities/task.entity";

describe('TasksService', () => {
    let service: TasksService;

    const mockRepository = {
        create: jest.fn(),
        findById: jest.fn(),
        findAll: jest.fn()
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

            const result = await service.create(dto);

            expect(mockRepository.create).toHaveBeenCalledTimes(1);
            expect(result).toEqual(taskInDatabase);
        });

        it('deveria estourar um InternalServerErrorException personalizado quando o repositório falhasse', async () => {
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
});