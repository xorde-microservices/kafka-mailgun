import { DocumentBuilder } from '@nestjs/swagger';
import { appDefaults } from './defaults';
import { IAppConfig, IAppSwaggerConfig } from './interfaces';

/** Add prefix slash (/) to argument if argument is truthy and missing prefix slash */
const prefixSlash = (path) =>
  path ? (path.charAt(0) !== '/' ? '/' : '') + path : path;

/** App config object */
export const appConfig = (): IAppConfig => ({
  app: {
    name: process.env.APP_NAME,
    version: process.env.APP_VERSION,
    code: process.env.APP_CODE,
    port: Number(process.env.APP_PORT),
    prefix: process.env.APP_PREFIX,
    apikey: process.env.APP_API_KEY,
    id: process.env.APP_ID,
  },
});

/** App Swagger config object */
export const appSwaggerConfig = (): IAppSwaggerConfig => ({
  swagger: {
    options: new DocumentBuilder()
      .setTitle(process.env.APP_NAME + ' API')
      .setDescription(process.env.npm_package_description)
      .setVersion(process.env.APP_VERSION)
      .addApiKey(
        {
          type: 'apiKey',
          name: appDefaults.API_METHOD_NAME,
          in: 'header',
        },
        appDefaults.API_METHOD_NAME,
      )
      .build(),
    path: prefixSlash(process.env.APP_SWAGGER_PATH),
    enable: process.env.APP_SWAGGER_ENABLE == 'true',
    enableStats: process.env.APP_SWAGGER_STATS_ENABLE == 'true',
  },
});
