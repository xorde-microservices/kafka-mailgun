import { Injectable } from '@nestjs/common';
import { BaseService, EServiceStatus } from '../../common/base.service';
import { StatusResponseDto } from './dto/status.dto';
import { EStatusState } from './enum/state.enum';
import { appConfig } from '../../app/config/config';
import { ModulesContainer } from '@nestjs/core';
import { MonitoredServicesInvokers, MonitoredServiceStatuses } from './interfaces/monitoredService.interface';
import { statusConfig } from './config/config';
import { statusDefaults } from './config/defaults';

const GET_STATUS_FUNC_NAME = 'getStatus';

@Injectable()
export class StatusService extends BaseService {
	private services: MonitoredServicesInvokers = [];

	constructor(readonly modulesContainer: ModulesContainer) {
		super();
	}

	/**
	 * Initializes module:
	 * - Finds services that have monitoring function `getStatus` present and supported;
	 */
	onModuleInit() {
		/* Get all loaded modules: */
		const modules = [...this.modulesContainer.values()];

		for (const module of modules) {
			/* Enumerate providers to access instance of the service: */
			module.providers.forEach((value) => {
				if (value.instance && typeof value.instance[GET_STATUS_FUNC_NAME] === 'function') {
					/* Ignore services which return getStatus as NOTSUPPORTED: */

					if (value.instance[GET_STATUS_FUNC_NAME]() !== EServiceStatus.NOTSUPPORTED) {
						this.logger.log(`Initializing status monitoring for ${value.name}`);

						this.services.push({
							name: value.name,
							statusInvoker: value.instance as BaseService,
						});
					}
				}
			});
		}

		if (statusConfig().secret != statusDefaults.secret) {
			this.logger.log('Status endpoints are protected by secret');
		}
	}

	/**
	 * Returns MonitoredServiceStatuses object.
	 */
	invokeMonitoredServices(): MonitoredServiceStatuses {
		return this.services.map((m) => {
			return {
				name: m.name,
				status: m.statusInvoker[GET_STATUS_FUNC_NAME](),
			};
		});
	}

	/**
	 * Returns StatusResponseDto object.
	 */
	status(): StatusResponseDto {
		return {
			state: EStatusState.NORMAL,
			memory: process.memoryUsage().heapUsed,
			id: appConfig().app.id,
			uptime: Math.floor(process.uptime()),
			services: this.invokeMonitoredServices(),
		};
	}
}
