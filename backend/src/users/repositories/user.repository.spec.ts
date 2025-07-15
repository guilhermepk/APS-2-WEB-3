import { Repository } from "typeorm";
import { UsersTypeOrmRepository } from "./user.repository";
import { UserEntity } from "../models/entities/user.entity";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

describe('UsersTypeOrmRepository', () => {
    let customRepository: UsersTypeOrmRepository;
    let mockRepository: { save: jest.Mock, findOne: jest.Mock, find: jest.Mock };

    beforeEach(async () => {
        mockRepository = {
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn()
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersTypeOrmRepository,
                {
                    provide: getRepositoryToken(UserEntity),
                    useValue: mockRepository
                }
            ]
        }).compile();

        customRepository = module.get<UsersTypeOrmRepository>(UsersTypeOrmRepository);

        jest.clearAllMocks();
    });

    describe('create', () => {
        it('deveria criar um usuário no banco de dados', async () => {
            const userInDatabase = { id: 1, name: 'Usuário 1' };
            mockRepository.save.mockResolvedValue(userInDatabase);

            const user = new UserEntity('Usuário 1');

            const result = await customRepository.create(user);

            expect(mockRepository.save).toHaveBeenCalledWith(user);
            expect(mockRepository.save).toHaveBeenCalledTimes(1);

            expect(result).toEqual(userInDatabase);
        });
    });

    describe('findById', () => {
        it('deveria encontrar um usuário no banco de dados', async () => {
            const userInDatabase = { id: 1, name: 'Usuário 1' };
            mockRepository.findOne.mockResolvedValue(userInDatabase);

            const result = await customRepository.findById(1);

            expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(mockRepository.findOne).toHaveBeenCalledTimes(1);

            expect(result).toEqual(userInDatabase);
        });
    });

    describe('findAll', () => {
        it('deveria encontrar todos os usuários (3 usuários) no banco de dados', async () => {
            const usersInDatabase = [
                { id: 1, name: 'Usuário 1' },
                { id: 2, name: 'Usuário 2' },
                { id: 3, name: 'Usuário 3' }
            ];
            mockRepository.find.mockResolvedValue(usersInDatabase);

            const result = await customRepository.findAll();

            expect(mockRepository.find).toHaveBeenCalledWith();
            expect(mockRepository.find).toHaveBeenCalledTimes(1);

            expect(result).toEqual(usersInDatabase);
        });
    });
});