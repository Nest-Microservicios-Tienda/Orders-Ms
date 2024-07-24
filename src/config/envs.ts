import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  // PRODUCT_MICROSERVICE_PORT: number;
  // PRODUCT_MICROSERVICE_HOST: string;

  // ORDERS_MICROSERVICE_HOST: string;
  // ORDERS_MICROSERVICE_PORT: number;
  NATS_SERVERS: string[];
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    // PRODUCT_MICROSERVICE_PORT: joi.number().required(),
    // PRODUCT_MICROSERVICE_HOST: joi.string().required(),

    // ORDERS_MICROSERVICE_HOST: joi.string().required(),
    // ORDERS_MICROSERVICE_PORT: joi.string().required(),
    NATS_SERVERS: joi.array().items(joi.string()).required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envsvars: EnvVars = value;

export const envs = {
  port: envsvars.PORT,
  // productsMicroservicePort: envsvars.PRODUCT_MICROSERVICE_PORT,
  // productsMicroserviceHost: envsvars.PRODUCT_MICROSERVICE_HOST,

  // ordersMicroserviceHost: envsvars.ORDERS_MICROSERVICE_HOST,
  // ordersMicroservicePort: envsvars.ORDERS_MICROSERVICE_PORT,
  natsServer: envsvars.NATS_SERVERS,
};
