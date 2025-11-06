import { Logger } from '@nestjs/common';

export enum EServiceStatus {
	OPERATIONAL = 'OPERATIONAL',
	INTERMEDIARY = 'INTERMEDIARY',
	FAILED = 'FAILED',
	NOTSUPPORTED = 'NOTSUPPORTED',
}

export class BaseService {
	protected readonly logger = new Logger(this.constructor.name);

	getStatus(): EServiceStatus {
		return EServiceStatus.NOTSUPPORTED;
	}
}
