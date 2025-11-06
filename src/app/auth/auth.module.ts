/**
 * @format
 * Copyright (C) Xorde Technologies
 * All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Xander Tovski, 2019-2020
 **/

import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { HeaderApiKeyStrategy } from './api-key.strategy';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [PassportModule, ConfigModule],
	providers: [HeaderApiKeyStrategy],
})
export class AuthModule {}
