import * as dotenv from "dotenv";

dotenv.config();

import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";

import compression = require("compression");
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as express from "express";
import * as helmet from "helmet";
import { WinstonModule } from "nest-winston";
import { origin } from "./cors";
import { instance } from "@/common/logger";

const rawBodyBuffer = (
  req: any,
  _res: any,
  buffer: Buffer,
  encoding: string
) => {
  if (buffer && buffer.length) {
    req.rawBody = buffer.toString(encoding || "utf8");
  }
};

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: WinstonModule.createLogger({ instance })
  });
  app.use(express.json({ verify: rawBodyBuffer, limit: "50mb" }));
  app.use(
    express.urlencoded({ verify: rawBodyBuffer, limit: "50mb", extended: true })
  );
  app.use(compression());
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>("PORT", 0);

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          "content-src": ["'self'", "https:", "data:"],
          "default-src": ["'self'"],
          "base-uri": ["'self'"],
          "block-all-mixed-content": [],
          "font-src": ["'self'", "https:", "data:"],
          "img-src": ["'self'", "data:"],
          "object-src": ["'none'"],
          "script-src": ["'self'"],
          "script-src-attr": ["'none'"],
          "style-src": ["'self'", "https:", "'unsafe-inline'"],
          "upgrade-insecure-requests": [],
          "frame-ancestors": [
            "'self'",
            configService.get<string>("FE_DOMAIN", "")
          ]
        }
      }
    })
  );

  app.enableCors({
    origin: origin(configService)
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true
    })
  );

  const APP_ENV = configService.get<string>("APP_ENV", "");
  if (["local", "development", "qa"].indexOf(APP_ENV) >= 0) {
    const config = new DocumentBuilder()
      .setTitle("scentronix APIs Docs")
      .setDescription("All APIs using for assignment")
      .setVersion("1.0")
      .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup("api", app, document);
  }

  await app.listen(PORT);
}
bootstrap()
  .then(() => console.log("Application started"))
  .catch(console.error);
