import { Injectable } from '@nestjs/common';
import { Consumer, Kafka, logCreator, LogEntry, logLevel, Producer, ProducerRecord } from 'kafkajs';
import * as R from 'rambda';
import { v } from '../../common/log.utils';
import { EventService } from '../../common/event.service';
import { KafkaMessageExt, MessagePayload } from './interfaces/message';
import { kafkaConfig } from './config/config';
import { appConfig } from '../../app/config/config';
import { EServiceStatus } from '../../common/base.service';

enum EKafkaStatus {
	DISCONNECTED,
	CONNECTING,
	CONNECTED,
	ERROR,
}

class KafkaStatus {
	consumer: EKafkaStatus = EKafkaStatus.DISCONNECTED;
	producer: EKafkaStatus = EKafkaStatus.DISCONNECTED;
}

@Injectable()
export class KafkaService extends EventService {
	private readonly config = kafkaConfig().kafka;
	private topics: string[];
	private kafka: Kafka;
	private kafkaStatus: KafkaStatus = new KafkaStatus();
	private consumer: Consumer;
	private producer: Producer;

	private logCreator: logCreator = (level: logLevel) => {
		switch (level) {
			case logLevel.ERROR:
				return (entry: LogEntry) => {
					this.logger.error(`${entry.label} [Kafka:${entry.namespace}] ${entry.log.message}`);
				};
			default:
				return (entry: LogEntry) => {
					this.logger.verbose(`${entry.label} [Kafka:${entry.namespace}] ${entry.log.message}`);
				};
		}
	};

	/* Modification of standard emitter to allow user to subscribe to all events emitted by subscribing to "*" */
	emit(type, ...args) {
		super.emit('*', ...args);
		return super.emit(type, ...args) || super.emit('', ...args);
	}

	/* Modification of standard subscriber to allow user to subscribe to kafka topic based on event name */
	on(eventName: string | symbol, listener: (...args: any[]) => void): this {
		super.on(eventName, listener);
		if (typeof eventName == 'string' && eventName != '*') {
			this.subscribe([eventName]);
		}
		return this;
	}

	constructor() {
		super();
		this.logger.log('Configuration: ' + v(this.topics));

		this.kafka = new Kafka({
			logCreator: this.logCreator as logCreator,
			...this.config.client,
		});

		this.consumer = this.kafka.consumer({
			...this.config.consumer,
		});

		this.consumer.on('consumer.connect', () => (this.kafkaStatus.consumer = EKafkaStatus.CONNECTED));
		this.consumer.on('consumer.crash', () => (this.kafkaStatus.consumer = EKafkaStatus.ERROR));
		this.consumer.on('consumer.disconnect', () => (this.kafkaStatus.consumer = EKafkaStatus.DISCONNECTED));

		this.producer = this.kafka.producer();

		this.producer.on('producer.connect', () => (this.kafkaStatus.producer = EKafkaStatus.CONNECTED));
		this.producer.on('producer.disconnect', () => (this.kafkaStatus.producer = EKafkaStatus.DISCONNECTED));
	}

	async onModuleInit() {
		try {
			this.kafkaStatus.producer = EKafkaStatus.CONNECTING;
			await this.producer.connect();
			this.kafkaStatus.producer = EKafkaStatus.CONNECTED;
		} catch (e) {
			this.kafkaStatus.producer = EKafkaStatus.ERROR;
			this.logger.error(e);
		}

		try {
			this.kafkaStatus.consumer = EKafkaStatus.CONNECTING;
			await this.consumer.connect();
			this.kafkaStatus.consumer = EKafkaStatus.CONNECTED;
			await this.consumer.run({
				eachMessage: async (payload: MessagePayload) => this.handleMessage(payload),
			});
		} catch (e) {
			this.kafkaStatus.consumer = EKafkaStatus.ERROR;
			this.logger.error(e);
		}
	}

	async subscribe(topics: string[]) {
		if (this.consumer) {
			try {
				for (const topic of topics) {
					if (!this.topics.includes(topic)) {
						await this.consumer.subscribe({
							topic,
						});
						this.topics.push(topic);
					}
				}
			} catch (e) {
				this.logger.error(e);
			}
			return true;
		} else {
			return false;
		}
	}

	private handleMessage(payload: MessagePayload) {
		/* Convert value buffer type to object type or string type */
		try {
			payload.message.value = JSON.parse(payload.message.value.toString());
		} catch (e) {
			payload.message.value = payload.message.value ? payload.message.value.toString() : null;
		}

		/* Convert key buffer type to object type or string type: */
		try {
			payload.message.key = JSON.parse(payload.message.key.toString());
		} catch (e) {
			payload.message.key = payload.message.key ? payload.message.key.toString() : null;
		}

		this.logger.verbose('Message: ' + v(R.pick(['topic', 'key', 'timestamp'], payload)));

		this.emit(payload.topic.toString(), payload);
	}

	/* Send a message to Kafka topic */
	async send(topic: string, message: KafkaMessageExt) {
		message.key = message.key ? Buffer.from(JSON.stringify(message.key)) : null;
		message.value = Buffer.from(JSON.stringify(message.value));
		message.headers = { ...message.headers, src: appConfig().app.code };

		const record: ProducerRecord = {
			topic,
			messages: [message],
		};
		await this.producer.send(record);
		return message;
	}

	getStatus(): EServiceStatus {
		return this.kafkaStatus.consumer == EKafkaStatus.CONNECTED && this.kafkaStatus.producer == EKafkaStatus.CONNECTED
			? EServiceStatus.OPERATIONAL
			: this.kafkaStatus.consumer == EKafkaStatus.ERROR || this.kafkaStatus.producer == EKafkaStatus.ERROR
			? EServiceStatus.FAILED
			: EServiceStatus.INTERMEDIARY;
	}
}
