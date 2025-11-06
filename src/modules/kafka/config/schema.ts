import * as Joi from 'joi';
import { kafkaDefaults } from './defaults';

export const kafkaConfigSchema = {
	KAFKA_SSL: Joi.boolean().allow('').default(kafkaDefaults.KAFKA_SSL),
	KAFKA_CLIENT_ID: Joi.string().allow(''),
	KAFKA_GROUP_ID: Joi.string().allow('').default(kafkaDefaults.KAFKA_GROUP_ID),
	KAFKA_USERNAME: Joi.string().allow(''),
	KAFKA_PASSWORD: Joi.string().allow(''),
	KAFKA_BROKERS: Joi.string().required(),
};

export const kafkaEnvSchema = Joi.object(kafkaConfigSchema);
