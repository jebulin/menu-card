import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import * as helmet from 'helmet';
import { json, urlencoded } from 'express';
import { ValidationPipe } from '@nestjs/common';
import * as basicAuth from 'express-basic-auth';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.use(morgan('combined'));

  // app.use(helmet());

  app.setGlobalPrefix("/api");
  app.use(json({limit:'50mb'}));
  app.use(urlencoded({extended:true, limit:'50mb'}));


  app.useGlobalPipes(new ValidationPipe({transform:true}));

  app.use(['/docs', "/docs-json"], basicAuth({
    challenge:true,
    users:{
      'jebulin': "1234"
    },
  }));

  const config = new DocumentBuilder().addBearerAuth()
  .setTitle("Menu card")
  .setDescription('menu.api')
  .setVersion('v1.0.0')
  .addTag('menu card')
  .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  await app.listen(3000, ()=> console.log("menu API Service"));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
}
bootstrap();
