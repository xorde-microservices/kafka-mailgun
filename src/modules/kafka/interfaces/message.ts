import { IHeaders } from 'kafkajs';

export interface MessagePayload {
	topic: string;
	partition: number;
	message: KafkaMessageExt;
	userchannel?: string;
	subchannel?: string;
}

export type KafkaMessageExt = {
	key?: any;
	value: any;
	timestamp?: string;
	size?: number;
	attributes?: number;
	offset?: string;
	headers?: IHeaders;
};
