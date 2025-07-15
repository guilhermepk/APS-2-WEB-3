import { Test, TestingModule } from "@nestjs/testing";
import { ProjectsTypeOrmRepository } from "./projects.repository";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ProjectEntity } from "../models/entities/project.entity";
import { DeleteResult, UpdateResult } from "typeorm";

describe('ProjectsTypeOrmRepository', () => {
    let customRepository: ProjectsTypeOrmRepository;
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
                ProjectsTypeOrmRepository,
                {
                    provide: getRepositoryToken(ProjectEntity),
                    useValue: mockRepository
                }
            ]
        }).compile();

        customRepository = module.get<ProjectsTypeOrmRepository>(ProjectsTypeOrmRepository);

        jest.clearAllMocks();
    });

    describe('create', () => {
        it('deveria criar um projeto no banco de dados', async () => {
            const projectInDatabase = { id: 1, name: 'Projeto 1', description: 'Descrição 1' };
            mockRepository.save.mockResolvedValue(projectInDatabase);

            const project = new ProjectEntity('Projeto 1', 'Descrição 1');
            const result = await customRepository.create(project);

            expect(mockRepository.save).toHaveBeenCalledWith(project);
            expect(mockRepository.save).toHaveBeenCalledTimes(1);

            expect(result).toEqual(projectInDatabase);
        });

        it('deveria criar um projeto no banco de dados com o entityManager da transaction', async () => {
            const transactionManager = { save: jest.fn() } as any;

            const projectInDatabase = { id: 1, name: 'Projeto 1', description: 'Descrição 1' };
            transactionManager.save.mockResolvedValue(projectInDatabase);

            const project = new ProjectEntity('Projeto 1', 'Descrição 1');

            const result = await customRepository.create(project, transactionManager);

            expect(transactionManager.save).toHaveBeenCalledWith(project);
            expect(transactionManager.save).toHaveBeenCalledTimes(1);

            expect(result).toEqual(projectInDatabase);
        });
    });

    describe('findById', () => {
        it('deveria encontrar um projeto no banco de dados', async () => {
            const projectInDatabase = { id: 1, name: 'Projeto 1', description: 'Descrição 1' };
            mockRepository.findOne.mockResolvedValue(projectInDatabase);

            const result = await customRepository.findById(1);

            expect(mockRepository.findOne).toHaveBeenCalledWith({
                relations: {
                    usersProjects: {
                        user: true
                    },
                    tasks: true
                },
                where: { id: 1 }
            });
            expect(mockRepository.findOne).toHaveBeenCalledTimes(1);

            expect(result).toEqual(projectInDatabase);
        });
    });

    describe('findAll', () => {
        it('deveria encontrar todos os projetos (3 projetos) no banco de dados', async () => {
            const projectsInDatabase = [
                { id: 1, name: 'Projeto 1', description: 'Descrição 1' },
                { id: 2, name: 'Projeto 2', description: 'Descrição 2' },
                { id: 3, name: 'Projeto 3', description: 'Descrição 3' },
            ];

            mockRepository.find.mockResolvedValue(projectsInDatabase);

            const result = await customRepository.findAll();

            expect(mockRepository.find).toHaveBeenCalledWith({
                relations: {
                    usersProjects: {
                        user: true
                    }
                }
            });
            expect(mockRepository.find).toHaveBeenCalledTimes(1);

            expect(result).toEqual(projectsInDatabase);
        });
    });

    describe('update', () => {
        it('deveria atualizar as informações de um projeto no banco de dados', async () => {
            const updateResult = new UpdateResult();
            updateResult.affected = 1;

            mockRepository.update.mockResolvedValue(updateResult);

            const project = { id: 1, name: 'Projeto 1', description: 'Descrição 1' } as ProjectEntity;

            const result = await customRepository.update(project);

            expect(mockRepository.update).toHaveBeenCalledWith(1, project);
            expect(mockRepository.update).toHaveBeenCalledTimes(1);

            expect(result).toEqual(updateResult);
        });
    });

    describe('delete', () => {
        it('deveria deletar uma tarefa no banco de dados', async () => {
            const deleteResult = new DeleteResult();
            deleteResult.affected = 1;

            mockRepository.delete.mockResolvedValue(deleteResult);

            const project = { id: 1, name: 'Projeto 1', description: 'Descrição 1' } as ProjectEntity;

            const result = await customRepository.delete(project);

            expect(mockRepository.delete).toHaveBeenCalledWith({ id: 1 });
            expect(mockRepository.delete).toHaveBeenCalledTimes(1);

            expect(result).toEqual(deleteResult);
        });
    });
});