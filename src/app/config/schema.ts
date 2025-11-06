import * as Joi from 'joi';
import { appDefaults } from './defaults';

export const appConfigSchema = {
	APP_NAME: Joi.string().empty(['']).default(appDefaults.APP_NAME),
	APP_CODE: Joi.string().allow('').default(appDefaults.APP_CODE),
	APP_PORT: Joi.number().allow('').default(appDefaults.APP_PORT),
	APP_PREFIX: Joi.string().allow('').default(appDefaults.APP_PREFIX),
	APP_ID: Joi.string().allow('').default(appDefaults.APP_ID),
	APP_VERSION: Joi.string().empty('').default(appDefaults.APP_VERSION),
	APP_API_KEY: Joi.string().empty('').default(appDefaults.APP_API_KEY),
	APP_SWAGGER_PATH: Joi.string().allow('').default(appDefaults.APP_SWAGGER_PATH),
	APP_SWAGGER_ENABLE: Joi.boolean().allow('').default(appDefaults.APP_SWAGGER_ENABLE),
	APP_SWAGGER_STATS_ENABLE: Joi.boolean().allow('').default(appDefaults.APP_SWAGGER_STATS_ENABLE),
};

/* Environment variables validation schema */
export const appEnvSchema = Joi.object(appConfigSchema);
