import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

interface IDbConfig {
	db: TypeOrmModuleOptions;
}

const csvContains = (s: string, t: string): boolean => typeof s != 'string' ? false : s.split(',').includes(t);

export const dbConfig = (): IDbConfig => {
	return {
		db: {
			dropSchema: csvContains(process.env.DB_MODE, 'drop'),
			logging: process.env.DB_LOGGING === 'true',
			maxQueryExecutionTime: Number(process.env.DB_TIMEOUT) || 2000,
			ssl: csvContains(process.env.DB_MODE, 'ssl'),
			synchronize: csvContains(process.env.DB_MODE, 'sync'),
			entities: [join(__dirname, '**', '*.entity.ts')],
			autoLoadEntities: true,
			type: 'postgres',
			host: process.env.DB_HOST,
			port: Number(process.env.DB_PORT),
			schema: process.env.DB_SCHEMA,
			database: process.env.DB_NAME,
			username: process.env.DB_USERNAME,
			password: process.env.DB_PASSWORD,
		},
	};
};
