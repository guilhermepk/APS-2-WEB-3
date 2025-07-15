import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { UsersTypeOrmRepository } from "./user.repository";

describe('UsersService', () => {
    let service: UsersService;

    const mockRepository = {
        create: jest.fn()
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                { provide: UsersTypeOrmRepository, useValue: mockRepository }
            ]
        }).compile();

        service = module.get<UsersService>(UsersService);

        jest.clearAllMocks();
    });

    describe('create', () => {
        it('deveria criar um usuário e retornar a entidade', async () => {
            const dto = { name: 'Usuário 1' };

            const userInDatabase = { id: 1, name: 'Usuário 1' };
            mockRepository.create.mockResolvedValue(userInDatabase);

            const result = await service.create(dto);

            expect(mockRepository.create).toHaveBeenNthCalledWith(1, { name: 'Usuário 1' });
            expect(mockRepository.create).toHaveBeenCalledTimes(1);

            expect(result).toEqual(userInDatabase);
        });
    });
});