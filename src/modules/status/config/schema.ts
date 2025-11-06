import * as Joi from 'joi';
import { statusDefaults } from './defaults';

export const statusConfigSchema = {
	STATUS_SECRET: Joi.string().allow('').default(statusDefaults.secret),
};

export const statusEnvSchema = Joi.object(statusConfigSchema);
