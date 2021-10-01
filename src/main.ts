import * as dotenv from 'dotenv';
dotenv.config();

/*
    Check for missing configuration variables:
 */
const missingVariables = [];
if (
  !['MAILGUN_API_KEY', 'MAILGUN_DOMAIN', 'KAFKA_BROKER', 'KAFKA_TOPIC'].every(
    (v) => {
      const ok = Object.keys(process.env).filter((k) => k == v).length > 0;
      if (!ok) {
        missingVariables.push(v);
      }
      return ok;
    },
  )
) {
  throw new Error(
    `Missing environment variable(s): ${missingVariables.join(',')}`,
  );
}

import { NestFactory } from '@nestjs/core';
import { MailModule } from './mail/mail.module';
import { KafkaConfig } from './config';

async function bootstrap() {
  const app = await NestFactory.create(MailModule, {
    logger:
      process.env.NODE_ENV === 'development'
        ? ['log', 'debug', 'error', 'verbose', 'warn']
        : ['log', 'error', 'warn'],
  });
  app.connectMicroservice(KafkaConfig);

  // start and bind microservice asynchronously to app
  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
