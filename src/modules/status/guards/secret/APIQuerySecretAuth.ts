import { SecurityRequirementObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { extendMetadata } from '@nestjs/swagger/dist/utils/extend-metadata.util';
import { DECORATORS } from '@nestjs/swagger/dist/constants';
import { isString } from '@nestjs/common/utils/shared.utils';
import { isUndefined, negate, pickBy } from 'lodash';
import { QuerySecretArgs } from './querySecretArgs';

/**
 * Query secret auth OpenAPI decorator. Adds OpenAPI Security and Parameters required
 * @param name
 * @param requirements
 * @constructor
 */
export const APIQuerySecretAuth = (
	name: string | SecurityRequirementObject = 'secretQuery',
	requirements: string[] = ['type:apiKey', 'in:query', 'name:secret'],
): ClassDecorator & MethodDecorator => {
	let metadata: SecurityRequirementObject[];

	if (isString(name)) {
		metadata = [{ [name]: requirements }];
	} else {
		metadata = [name];
	}

	return (target: object, key?: string | symbol, descriptor?: TypedPropertyDescriptor<any>): any => {
		if (descriptor) {
			/* Add OpenAPI security metadata */
			metadata = extendMetadata(metadata, DECORATORS.API_SECURITY, descriptor.value);
			Reflect.defineMetadata(DECORATORS.API_SECURITY, metadata, descriptor.value);

			/* Add OpenAPI  */
			const parameters = Reflect.getMetadata(DECORATORS.API_PARAMETERS, descriptor.value) || [];
			Reflect.defineMetadata(
				DECORATORS.API_PARAMETERS,
				[
					...parameters,
					{
						...pickBy({ name: 'secret', type: QuerySecretArgs, in: 'path' }, negate(isUndefined)),
					},
				],
				descriptor.value,
			);

			return descriptor;
		}

		metadata = extendMetadata(metadata, DECORATORS.API_SECURITY, target);
		Reflect.defineMetadata(DECORATORS.API_SECURITY, metadata, target);

		return target;
	};
};
