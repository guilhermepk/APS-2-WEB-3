import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestApp } from './utils/e2e-setup';
import { CreateUserDto } from 'src/users/models/dtos/create-user.dto';

describe('UsersController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        app = await createTestApp();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('create', () => {
        it('(POST) /users - deveria criar um usuário', async () => {
            const dto: CreateUserDto = { name: 'Usuário 1' };

            const response = await request(app.getHttpServer())
                .post('/users')
                .send(dto)
                .expect(201);

            expect(response.body).toEqual({
                name: 'Usuário 1',
                id: expect.any(Number)
            });
            expect(Number.isInteger(response.body.id)).toBe(true);
            expect(response.body.id).toBeGreaterThan(0);
        });
    });
});
