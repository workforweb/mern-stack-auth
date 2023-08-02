import express from 'express';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import appRoutes from './routes';
import config from './config/config';
import {
  errorConverter,
  errorHandler,
  notFound,
  finalError,
} from './errors/error';

const app = express();
const port = config.port;

// connect to mongodb
require('./database/dbConn');

// Remove Express header
if (config.env !== 'development') {
  app.disable('x-powered-by');
}

app.set('etag', false);
app.set('trust proxy', true);

if (config.env !== 'test') {
  app.use(
    morgan('dev', {
      skip: function (req, res) {
        return res.statusCode < 400;
      },
    })
  );
}

// enable cors
let whitelist = ['http://localhost:3000'];
const origin = (origin, callback) => {
  // allow requests with no origin
  if (!origin) return callback(null, true);
  if (whitelist.indexOf(origin) === -1) {
    const message =
      'The CORS policy for this origin does not allow access from a specific origin.';

    return callback(new Error(message), false);
  }
  return callback(null, true);
};
app.use(cors({ origin, credentials: true, optionsSuccessStatus: 200 }));

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: false }));

// parse cookies
app.use(cookieParser());

// sanitize request data
app.use(ExpressMongoSanitize({ replaceWith: '_' }));

// gzip compression
app.use(compression());

// Register app routes
appRoutes(app);

app.use(notFound);

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

// error handler middleware
app.use(finalError);

const server = app.listen(port, () =>
  console.log(`Server up on port ${port}!`)
);

process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
