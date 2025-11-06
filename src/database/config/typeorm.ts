import * as dotenv from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { dbConfig } from './config';

dotenv.config();

// typeorm config:
const typeorm: TypeOrmModuleOptions = {
	...dbConfig().db,
	entities: ['src/**/*.entity.ts'],
	migrations: ['src/database/migrations/*{.ts,.js}'],
	autoLoadEntities: true,
	cli: {
		migrationsDir: 'src/database/migrations',
	},
};

// https://github.com/typeorm/typeorm/issues/4068#issuecomment-655963645
module.exports = typeorm;
