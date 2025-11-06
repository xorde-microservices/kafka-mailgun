import * as Joi from 'joi';
import { dbDefaults } from './defaults';

export const dbConfigSchema = {
	DB_HOST: Joi.string().required(),
	DB_PORT: Joi.string().default(dbDefaults.DB_PORT),
	DB_SCHEMA: Joi.string().default(dbDefaults.DB_SCHEMA),
	DB_NAME: Joi.string().required(),
	DB_USERNAME: Joi.string().required(),
	DB_PASSWORD: Joi.string().required(),
	DB_LOGGING: Joi.boolean().default(dbDefaults.DB_LOGGING),
	DB_MODE: Joi.string().optional(),
	DB_TIMEOUT: Joi.number().optional(),
};
