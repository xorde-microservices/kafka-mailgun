import { BaseService, EServiceStatus } from '../../../common/base.service';

export interface IMonitoredServiceInvoker {
	name: string;
	statusInvoker: BaseService;
}

export interface IMonitoredServiceStatus {
	name: string;
	status: EServiceStatus;
}

export type MonitoredServicesInvokers = IMonitoredServiceInvoker[];

export type MonitoredServiceStatuses = IMonitoredServiceStatus[];
