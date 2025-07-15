import { Test, TestingModule } from "@nestjs/testing";
import { TasksTypeOrmRepository } from "./tasks.repository";
import { getRepositoryToken } from "@nestjs/typeorm";
import { TaskEntity } from "../models/entities/task.entity";
import { ProjectEntity } from "src/projects/models/entities/project.entity";
import { DeleteResult, UpdateResult } from "typeorm";

describe('TasksTypeOrmRepository', () => {
    let customRepository: TasksTypeOrmRepository;
    let mockRepository: {
        save: jest.Mock,
        find: jest.Mock,
        findOne: jest.Mock,
        update: jest.Mock,
        delete: jest.Mock,
    };

    beforeEach(async () => {
        mockRepository = {
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TasksTypeOrmRepository,
                {
                    provide: getRepositoryToken(TaskEntity),
                    useValue: mockRepository
                }
            ]
        }).compile();

        customRepository = module.get<TasksTypeOrmRepository>(TasksTypeOrmRepository);

        jest.clearAllMocks();
    });

    describe('create', () => {
        it('deveria criar uma tarefa no banco de dados', async () => {
            const taskInDatabase = { id: 1, description: 'Tarefa 1', completed: false };
            mockRepository.save.mockResolvedValue(taskInDatabase);

            const project = new ProjectEntity('Projeto 1');
            const task = new TaskEntity('Tarefa 1', project, false);

            const result = await customRepository.create(task);

            expect(mockRepository.save).toHaveBeenCalledWith(task);
            expect(mockRepository.save).toHaveBeenCalledTimes(1);

            expect(result).toEqual(taskInDatabase);
        });
    });

    describe('findById', () => {
        it('deveria encontrar uma tarefa no banco de dados', async () => {
            const taskInDatabase = { id: 1, description: 'Tarefa 1', completed: false };
            mockRepository.findOne.mockResolvedValue(taskInDatabase);

            const result = await customRepository.findById(1);

            expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(mockRepository.findOne).toHaveBeenCalledTimes(1);

            expect(result).toEqual(taskInDatabase);
        });
    });

    describe('findAll', () => {
        it('deveria encontrar todos as tarefas (3 tarefas) no banco de dados', async () => {
            const tasksInDatabase = [
                { id: 1, description: 'Tarefa 1', completed: false },
                { id: 2, description: 'Tarefa 2', completed: true },
                { id: 3, description: 'Tarefa 3', completed: false },
            ];

            mockRepository.find.mockResolvedValue(tasksInDatabase);

            const result = await customRepository.findAll(false);

            expect(mockRepository.find).toHaveBeenCalledWith({
                relations: {
                    project: true
                },
                where: { completed: false },
                order: {
                    completed: 'ASC'
                }
            });
            expect(mockRepository.find).toHaveBeenCalledTimes(1);

            expect(result).toEqual(tasksInDatabase);
        });
    });

    describe('update', () => {
        it('deveria atualizar as informações de uma tarefa no banco de dados', async () => {
            const updateResult = new UpdateResult();
            updateResult.affected = 1;

            mockRepository.update.mockResolvedValue(updateResult);

            const task = { id: 1, description: 'Tarefa 1', completed: false } as TaskEntity;

            const result = await customRepository.update(task);

            expect(mockRepository.update).toHaveBeenCalledWith(1, task);
            expect(mockRepository.update).toHaveBeenCalledTimes(1);

            expect(result).toEqual(updateResult);
        });
    });

    describe('delete', () => {
        it('deveria deletar uma tarefa no banco de dados', async () => {
            const deleteResult = new DeleteResult();
            deleteResult.affected = 1;

            mockRepository.delete.mockResolvedValue(deleteResult);

            const task = { id: 1, description: 'Tarefa 1', completed: false } as TaskEntity;

            const result = await customRepository.delete(task);

            expect(mockRepository.delete).toHaveBeenCalledWith(1);
            expect(mockRepository.delete).toHaveBeenCalledTimes(1);

            expect(result).toEqual(deleteResult);
        });
    });
});