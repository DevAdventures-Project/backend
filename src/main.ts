import {
  ClassSerializerInterceptor,
  LogLevel,
  ValidationPipe,
} from "@nestjs/common";
import { NestFactory, Reflector } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const allLogLevels: LogLevel[] = [
    "verbose",
    "debug",
    "log",
    "warn",
    "error",
    "fatal",
  ];
  const levels = allLogLevels.slice(
    allLogLevels.indexOf((process.env.NESTJS_LOG_LEVEL || "debug") as LogLevel),
    allLogLevels.length,
  );

  const app = await NestFactory.create(AppModule, { logger: levels });

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const config = new DocumentBuilder()
    .setTitle("API")
    .setDescription("Documentation de l'API")
    .setVersion("1.1")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  app.enableCors({
    origin: "*",
    methods: "GET,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type, Authorization",
  });
  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application running at ${await app.getUrl()}`);
}
bootstrap();
