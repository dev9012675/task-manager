import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { SeederService } from './modules/seeder/seeder.service';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  const seederService = app.get(SeederService);
  await seederService.seed();
  app.use(cookieParser());
  app.enableCors({ origin: `*` });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
