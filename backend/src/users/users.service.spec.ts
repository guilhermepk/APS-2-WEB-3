import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { UsersTypeOrmRepository } from "./user.repository";
import { NotFoundException } from "@nestjs/common";

describe('UsersService', () => {
    let service: UsersService;

    const mockRepository = {
        create: jest.fn(),
        findById: jest.fn(),
        findAll: jest.fn()
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

    describe('findById', () => {
        it('deveria encontrar um usuário', async () => {
            const userInDatabase = { id: 1, name: 'Usuário 1' };
            mockRepository.findById.mockResolvedValue(userInDatabase);

            const result = await service.findById(1);

            expect(mockRepository.findById).toHaveBeenNthCalledWith(1, 1);
            expect(mockRepository.findById).toHaveBeenCalledTimes(1);

            expect(result).toEqual(userInDatabase);
        });

        it('deveria estourar NotFoundException', async () => {
            mockRepository.findById.mockResolvedValue(null);

            try {
                await service.findById(1);
                fail('Deveria ter estourado NotFoundException');
            } catch (error) {
                expect(error).toBeInstanceOf(NotFoundException);
                expect(error.message).toEqual('Nenhum usuário encontrado com ID 1');
            }

            expect(mockRepository.findById).toHaveBeenNthCalledWith(1, 1);
            expect(mockRepository.findById).toHaveBeenCalledTimes(1);
        });
    });

    describe('findAll', () => {
        it('deveria encontrar todos os usuários (3 usuários)', async () => {
            const usersInDatabase = [
                { id: 1, name: 'Usuário 1' },
                { id: 2, name: 'Usuário 2' },
                { id: 3, name: 'Usuário 3' }
            ];

            mockRepository.findAll.mockResolvedValue(usersInDatabase);

            const result = await service.findAll();

            expect(mockRepository.findAll).toHaveBeenCalledTimes(1);

            expect(result).toEqual(usersInDatabase);
        });

        it('deveria estourar NotFoundException', async () => {
            mockRepository.findAll.mockResolvedValue([]);

            try {
                await service.findAll();
            } catch (error) {
                expect(error).toBeInstanceOf(NotFoundException);
                expect(error.message).toEqual('Nenhum usuário encontrado');
            }

            expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
        });
    });
});