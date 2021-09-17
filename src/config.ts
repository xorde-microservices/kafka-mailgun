import { KafkaOptions, Transport } from '@nestjs/microservices';

const sslAuthConfig: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: 'client' + Math.random(),
      brokers: [process.env.KAFKA_BROKER], // seed broker
      ssl: true, // enable ssl
      sasl: {
        mechanism: 'plain', // authentication mechanism over ssl
        username: process.env.CONFLUENT_API_KEY, // username for authentication
        password: process.env.CONFLUENT_API_SECRET, // password for authentication
      },
      connectionTimeout: 3000,
      requestTimeout: 25000,
      retry: {
        initialRetryTime: 100,
        retries: 3,
      },
    },
    consumer: {
      groupId: 'consumer' + Math.random(),
    },
  },
};

const plainAuthConfig: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId:
          (process.env.KAFKA_CLIENT_ID  || 'default-client-id').replace(
              '%random%',
              Math.floor(Math.random() * 10e9).toString(),
          ),
      brokers: [process.env.KAFKA_BROKER],
    },
    consumer: {
      groupId:
          (process.env.KAFKA_CONSUMER_GROUP_ID || 'default-consumer-group-id').replace(
              '%random%',
              Math.floor(Math.random() * 10e9).toString(),
          ),
    },
  },
};

export const KafkaConfig: KafkaOptions =
  process.env.CONFLUENT_ENABLE == 'true' ? sslAuthConfig : plainAuthConfig;
