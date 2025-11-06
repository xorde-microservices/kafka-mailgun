import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { KafkaModule } from '../modules/kafka/kafka.module';
import { DatabaseModule } from '../database/database.module';
import { appEnvSchema } from './config/schema';
import { appConfig, appSwaggerConfig } from './config/config';
import { StatusModule } from '../modules/status/status.module';
import { TelegramModule } from "../modules/telegram/telegram.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			validationSchema: appEnvSchema,
			isGlobal: true,
			load: [appConfig, appSwaggerConfig],
		}),
		AuthModule,
		StatusModule,
		DatabaseModule,
		// KafkaModule,
		TelegramModule,
	],
	providers: [AppService],
	exports: [AppService],
	controllers: [AppController],
})
export class AppModule {}
