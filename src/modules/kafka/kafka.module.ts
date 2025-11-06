import { Module } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { ConfigModule } from '@nestjs/config';
import { kafkaEnvSchema } from './config/schema';
import { kafkaConfig } from './config/config';

@Module({
	imports: [ConfigModule.forRoot({ validationSchema: kafkaEnvSchema, isGlobal: true, load: [kafkaConfig] })],
	providers: [KafkaService],
	exports: [KafkaService],
})
export class KafkaModule {}
