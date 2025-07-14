import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as cors from "cors";
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger("Gerenciador de projetos");

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
  }));

  let currentRoute = null;
  let currentRequest = null;
  app.use((req, _, next) => {
    currentRoute = req.path;
    currentRequest = req;
    next();
  });

  app.use(cors({
    origin: function (origin, callback) {
      const whiteList = process.env.CORS_WHITELIST ? process.env.CORS_WHITELIST.split(', ') : [];
      if (whiteList.includes(origin) || !origin) {
        if (process.env.PRODUCTION === 'false') logger.debug(`Origem permitida através do CORS. Origem ${origin} na rota ${currentRoute}`);

        callback(null, true)
      } else {
        logger.error(`Origem não permitida através do CORS. Origem ${origin} na rota ${currentRoute}`);
        console.log('request', currentRequest)
      }
    },
    methods: [
      "GET",
      "POST",
      "PATCH",
      "DELETE"
    ],
    credentials: true,
  }));

  const port = process.env.PORT ?? 3000;

  await app.listen(port);

  logger.log(`Backend de ${process.env.PRODUCTION === 'true' ? 'produção' : 'desenvolvimento'} rodando na porta ${port}`);
}
bootstrap();
