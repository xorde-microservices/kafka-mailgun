import { ApiProperty } from '@nestjs/swagger';
import { EStatusState } from '../enum/state.enum';
import { MonitoredServiceStatuses } from '../interfaces/monitoredService.interface';

export class StatusResponseDto {
	@ApiProperty({ enum: EStatusState, enumName: 'Status State', example: EStatusState.NORMAL })
	state: EStatusState;

	@ApiProperty({ description: 'Unique identifier of the instance' })
	id: string;

	@ApiProperty({ description: 'Heap memory allocation in bytes' })
	memory: number;

	@ApiProperty({ description: 'Uptime in seconds' })
	uptime: number;

	@ApiProperty()
	services: MonitoredServiceStatuses;
}
