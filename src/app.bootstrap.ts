/**
 * @format
 * Copyright (C) Xorde Technologies
 * All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Xander Tovski, 2019-*
 **/

import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app/app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { loggerLevel } from './utils/loggerLevel';
import { toLocalhost } from './utils/toLocalhost';
import { appConfig, appSwaggerConfig } from './app/config/config';
import * as sws from 'swagger-stats';

const logger = new Logger('Bootstrap');

async function appBootstrap() {
	const app = await NestFactory.create(AppModule, {
		logger: loggerLevel(process.env.LOG_LEVEL),
	});

	app.setGlobalPrefix(appConfig().app.prefix);

	// TODO: add configurable CORS option for production
	app.enableCors({ origin: '*' });

	if (appSwaggerConfig().swagger.enable) {
		const document = SwaggerModule.createDocument(app, appSwaggerConfig().swagger.options);
		SwaggerModule.setup(appSwaggerConfig().swagger.path, app, document);
		if (appSwaggerConfig().swagger.enableStats) {
			app.use(sws.getMiddleware({ swaggerSpec: document }));
		}
	}

	await app.listen(appConfig().app.port);

	logger.log(`App: ${toLocalhost(await app.getUrl())}`);
	logger.log(`API Key: ${appConfig().app.apikey}`);

	if (appSwaggerConfig().swagger.enable) {
		logger.log(`Swagger: ${toLocalhost(await app.getUrl()) + appSwaggerConfig().swagger.path}`);
		if (appSwaggerConfig().swagger.enableStats) {
			logger.log(`Swagger Stats: ${toLocalhost(await app.getUrl())}/swagger-stats`);
		}
	}
}

appBootstrap().then(() => logger.log('Initialized'));
