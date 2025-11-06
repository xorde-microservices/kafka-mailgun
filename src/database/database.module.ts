import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from './config/config';

@Module({
	imports: [TypeOrmModule.forRoot(dbConfig().db)],
})
export class DatabaseModule {}
