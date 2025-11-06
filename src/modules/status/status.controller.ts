import { BaseController } from '../../common/base.controller';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StatusService } from './status.service';
import { StatusResponseDto } from './dto/status.dto';
import { APIQuerySecretAuth } from './guards/secret';
import { QuerySecretGuard } from './guards/secret';

const CONTROLLER = 'status';

@ApiTags(CONTROLLER)
@Controller(CONTROLLER)
export class StatusController extends BaseController {
	constructor(private readonly service: StatusService) {
		super();
	}

	@ApiOperation({ summary: 'Shows current service status' })
	@ApiOkResponse({ type: StatusResponseDto })
	@UseGuards(QuerySecretGuard)
	@Get('')
	@APIQuerySecretAuth()
	async getStatus(): Promise<StatusResponseDto> {
		return this.service.status();
	}
}
