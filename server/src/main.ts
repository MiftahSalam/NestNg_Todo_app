import 'dotenv/config'

import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { getDbConnectionOptions, runDbMigrations } from '@shared/utils'
import * as helmet from 'helmet'
import * as rateLimit from 'express-rate-limit'

const port = process.env.PORT

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    // AppModule.forRoot(await getDbConnectionOptions(process.env.NODE_ENV)),
  )

  app.use(helmet())
  app.enableCors()
  app.use(
    new rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
    }),
  )
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )
  await runDbMigrations()
  await app.listen(port)

  Logger.log(`Server started running on http://localhost:${port}`, 'Bootstrap')
}
bootstrap()
