import { Test, TestingModule } from "@nestjs/testing";
import { TasksService } from "./tasks.service";
import { TasksTypeOrmRepository } from "./tasks.repository";
import { CreateTaskDto } from "./models/dtos/create-task.dto";
import { ProjectsService } from "src/projects/projects.service";
import { InternalServerErrorException } from "@nestjs/common";

describe('TasksService', () => {
    let service: TasksService;

    const mockRepository = {
        create: jest.fn()
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
});