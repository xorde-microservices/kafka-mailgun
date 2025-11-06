import { Logger } from '@nestjs/common';

export class BaseController {
	protected readonly logger = new Logger(this.constructor.name);
}
