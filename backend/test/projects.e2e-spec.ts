import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { CreateProjectDto } from '../src/projects/models/dtos/create-project.dto';
import * as request from 'supertest';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

describe('ProjectsController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = moduleFixture.createNestApplication();

        app.useGlobalPipes(new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true
        }));

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('create', () => {
        it('/projects (POST) - deveria criar projeto com dados válidos', async () => {
            const dto: CreateProjectDto = { name: 'Projeto E2E', description: "Descrição" }
            const response = await request(app.getHttpServer())
                .post('/projects')
                .send(dto)
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body.name).toBe(dto.name);
            expect(response.body.description).toBe(dto.description);
        });

        it('/projects (POST) - deveria retornar erro com o body vazio', async () => {
            const dto = {};

            const response = await request(app.getHttpServer())
                .post('/projects')
                .send(dto)
                .expect(400);

            expect(response.body.message).toContain("'name' deve ser uma string");
            expect(response.body.message).toContain("'name' não pode estar vazio");
        });

        it(`/projects (POST) - deveria retornar erro de campo 'name' muito grande`, async () => {
            const dto = { name: 'Projeto', description: true };

            const response = await request(app.getHttpServer())
                .post('/projects')
                .send(dto)
                .expect(400);

            expect(response.body.message).toContain("'description' deve ser uma string");
        });

        it(`/projects (POST) - deveria retornar erro de campo 'description' com tipo inválido`, async () => {
            const dto = { name: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum' };

            const response = await request(app.getHttpServer())
                .post('/projects')
                .send(dto)
                .expect(400);

            expect(response.body.message).toContain("'name' deve ter no máximo 100 caracteres");
        });
    })

});