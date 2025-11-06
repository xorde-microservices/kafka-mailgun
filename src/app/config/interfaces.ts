import { OpenAPIObject } from '@nestjs/swagger';

export interface IAppConfigOptions {
	name: string;
	version: string;
	code: string;
	port: number;
	prefix: string;
	apikey: string;
	id: string;
}

export type TSwaggerConfigOptions = Omit<OpenAPIObject, 'paths'>;

export interface ISwaggerConfigOptions {
	options: TSwaggerConfigOptions;
	path: string;
	enable: boolean;
	enableStats: boolean;
}

export interface IAppConfig {
	app: IAppConfigOptions;
}

export interface IAppSwaggerConfig {
	swagger: ISwaggerConfigOptions;
}
