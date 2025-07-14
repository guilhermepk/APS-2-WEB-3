import { Test, TestingModule } from "@nestjs/testing";
import { TasksService } from "./tasks.service";
import { TasksTypeOrmRepository } from "./tasks.repository";
import { CreateTaskDto } from "./models/dtos/create-task.dto";
import { ProjectsService } from "src/projects/projects.service";

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
            expect(result.message).toEqual('Tarefa criada com sucesso!');
        });
    });
});