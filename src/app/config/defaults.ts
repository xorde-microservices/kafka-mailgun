import { v4 as uuidv4 } from 'uuid';

export const capitalize = (str: string, separator = '-') =>
	str
		.split(separator)
		.map((m) => m.charAt(0).toUpperCase() + m.slice(1))
		.join(' ');

export const appDefaults = {
	APP_NAME: process.env.npm_package_name ? capitalize(process.env.npm_package_name) : 'Service',
	APP_CODE: 'KFKTGM',
	APP_PORT: 3113,
	APP_PREFIX: '/',
	APP_ID: uuidv4(),
	APP_VERSION: process.env.npm_package_version ?? 'unknown',
	API_METHOD_NAME: 'api_key',
	APP_API_KEY: uuidv4(),

	/* swagger */
	APP_SWAGGER_ENABLE: false,
	APP_SWAGGER_STATS_ENABLE: false,
	APP_SWAGGER_PATH: '/api-docs',
};
