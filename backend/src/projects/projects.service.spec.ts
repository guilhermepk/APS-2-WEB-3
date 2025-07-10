import { Test, TestingModule } from "@nestjs/testing";
import { ProjectsTypeOrmRepository } from "./projects.repository";
import { ProjectsService } from "./projects.service";
import { ProjectEntity } from "./models/entities/project.entity";
import { CreateProjectDto } from "./models/dtos/create-project.dto";

describe('ProjectsService', () => {
    let service: ProjectsService;
    let repository: ProjectsTypeOrmRepository;

    const mockRepository = {
        create: jest.fn()
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
            const projectEntity: ProjectEntity = new ProjectEntity(dto.name, dto.description);

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
});
