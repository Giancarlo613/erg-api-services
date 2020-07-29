import {configure, getLogger} from 'log4js';
import {ApiApplication, ApplicationConfig} from './application';

const {API_PATH, HOST, LOG_CFG, NODE_ENV, PORT, GPM_BURL, GPM_URL, METE_URL, METE_WSDL} = require('../config/config');

export * from './application';

configure("./config/log-config.json");
const logger = getLogger(LOG_CFG);

export async function main(options: ApplicationConfig = {}) {
  const app = new ApiApplication(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  // console.log(`Server is running at ${url}`);
  // console.log(`Try ${url}/ping`);
  logger.info(`Server is running at ${url}`);

  return app;
}

if (require.main === module) {
  // Verify config
  logger.info('INFO: Configuration start');
  logger.info("INFO: NODE_ENV = " + NODE_ENV);
  logger.info("INFO: HOST = " + HOST);
  logger.info("INFO: PORT = " + PORT);
  logger.info("INFO: API_PATH = " + API_PATH);
  logger.info("INFO: LOG_CFG = " + LOG_CFG);
  logger.info("INFO: GPM_BURL = " + GPM_BURL);
  logger.info("INFO: GPM_URL = " + GPM_URL);
  logger.info("INFO: METE_URL = " + METE_URL);
  logger.info("INFO: METE_WSDL = " + METE_WSDL);
  logger.info("INFO: Configuration end");
  // Run the application
  const config = {
    rest: {
      // port: +(process.env.PORT ?? 3000),
      // host: process.env.HOST,
      port: +(PORT ?? 3000),
      host: HOST,
      basePath: API_PATH ?? '/',
      // The `gracePeriodForClose` provides a graceful close for http/https
      // servers with keep-alive clients. The default value is `Infinity`
      // (don't force-close). If you want to immediately destroy all sockets
      // upon stop, set its value to `0`.
      // See https://www.npmjs.com/package/stoppable
      gracePeriodForClose: 5000, // 5 seconds
      openApiSpec: {
        // useful when used with OpenAPI-to-GraphQL to locate your application
        setServersFromRequest: true,
      },
    },
  };
  main(config).catch(err => {
    // console.error('Cannot start the application.', err);
    logger.error('ERROR: Cannot start the application.', err);
    process.exit(1);
  });
}
