import { Module } from '@nestjs/common';
import { StatusService } from './status.service';
import { StatusController } from './status.controller';
import { ConfigModule } from '@nestjs/config';
import { statusEnvSchema } from './config/schema';
import { statusConfig } from './config/config';

@Module({
	imports: [ConfigModule.forRoot({ validationSchema: statusEnvSchema, isGlobal: true, load: [statusConfig] })],
	controllers: [StatusController],
	providers: [StatusService],
	exports: [StatusService],
})
export class StatusModule {}
