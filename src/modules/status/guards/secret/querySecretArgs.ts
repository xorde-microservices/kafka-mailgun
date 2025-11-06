import { ApiProperty } from '@nestjs/swagger';
import { statusConfig } from '../../config/config';
import { statusDefaults } from '../../config/defaults';

/**
 * Query secret arguments metadata
 */
export class QuerySecretArgs {
	@ApiProperty({
		default: '',
		required: statusConfig().secret != statusDefaults.secret,
		description: 'Optional configurable secret to access status endpoints',
	})
	secret: string;
}
