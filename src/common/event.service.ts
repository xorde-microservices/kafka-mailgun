/**
 * @format
 * Copyright (C) Xorde Technologies
 * All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Xander Tovski, 2019-*
 **/

import { Logger } from '@nestjs/common';
import { EventEmitter } from 'events';

export class EventService extends EventEmitter {
	protected readonly logger = new Logger(this.constructor.name);
}
