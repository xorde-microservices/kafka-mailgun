import { LogLevel } from '@nestjs/common/services/logger.service';

/** Returns an array of log levels for corresponding log level */
export const loggerLevel = (level: string): LogLevel[] => {
	const levels: LogLevel[] = ['error', 'log', 'warn', 'verbose', 'debug'];
	if (!level) return levels;
	return levels.slice(
		Math.max(
			0,
			levels.findIndex((f) => f == level),
		),
	);
};
