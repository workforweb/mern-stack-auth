import Joi from 'joi';
import 'dotenv/config';

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid('production', 'development', 'test')
      .lowercase()
      .required(),
    PORT: Joi.number().default(4000),
    SERVER_NAME: Joi.string().required(),
    API_URL: Joi.string().required().description('Api url'),
    CLIENT_URL: Joi.string().required().description('Client url'),
    MONGO_INITDB_ROOT_USERNAME: Joi.string().required(),
    MONGO_INITDB_ROOT_PASSWORD: Joi.string().required(),
    MONGO_INITDB_DATABASE: Joi.string().required(),
    DB_LOCAL_PORT: Joi.string().required(),
    DB_DOCKER_PORT: Joi.string().required(),
    DB_HOST: Joi.string().ip().required(),

    // JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(30)
      .description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
      .default(30)
      .description('days after which refresh tokens expire'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  dev: process.env.NODE_ENV !== 'production',
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  clientUrl: envVars.CLIENT_URL,
  mongoose: {
    url: `mongodb://${envVars.MONGO_INITDB_ROOT_USERNAME}:${envVars.MONGO_INITDB_ROOT_PASSWORD}@${envVars.DB_HOST}:${envVars.DB_LOCAL_PORT}/${envVars.MONGO_INITDB_DATABASE}?authSource=admin`,
    options: {
      useNewUrlParser: true,
    },
  },
  authentication: {
    accessToken: {
      secret: envVars.JWT_ACCESS_SECRET,
      expiresIn: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    },
    refreshToken: {
      secret: envVars.JWT_REFRESH_SECRET,
      expiresIn: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    },
  },
};

export default config;
