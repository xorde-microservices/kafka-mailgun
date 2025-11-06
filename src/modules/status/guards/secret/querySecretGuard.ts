import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { statusConfig } from '../../config/config';
import { statusDefaults } from '../../config/defaults';

/**
 * Query secret guard to be used as @UseGuards(QuerySecretGuard)
 */
@Injectable()
export class QuerySecretGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		const query = context.switchToHttp().getRequest().query;

		return statusConfig().secret == statusDefaults.secret || statusConfig().secret == query.secret;
	}
}
