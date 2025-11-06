/**
 * @format
 * Copyright (C) Xorde Technologies
 * All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Xander Tovski, 2019-2020
 **/

import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-headerapikey';
import { appDefaults } from '../config/defaults';
import { appConfig } from '../config/config';

@Injectable()
export class HeaderApiKeyStrategy extends PassportStrategy(Strategy, appDefaults.API_METHOD_NAME) {
	private readonly logger = new Logger(this.constructor.name);

	constructor() {
		super({ header: appDefaults.API_METHOD_NAME, prefix: '' }, true, async (apiKey, done) => {
			return this.validate(apiKey, done);
		});
	}

	// eslint-disable-next-line @typescript-eslint/ban-types
	public validate = (apiKey: string, done: (error: Error, data) => {}) => {
		if (appConfig().app.apikey === apiKey) {
			done(null, true);
		} else {
			this.logger.error(`Wrong API key: ${apiKey}`);
		}
		done(new UnauthorizedException(), null);
	};
}
