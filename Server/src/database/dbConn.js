'use strict';

import mongoose from 'mongoose';
import config from '../config/config';

mongoose.Promise = global.Promise;

// in dev environment
mongoose.set('debug', true);
mongoose.set('strictQuery', true);

function onError(err) {
  console.error(`MongoDB connection error: ${err}`);
  mongoose.connection.on(
    'error',
    console.error.bind(console, 'connection error')
  );
}

function onConnected() {
  mongoose.connection.once('open', function callback() {
    // mongoose.set('debug', true);
    // print mongoose logs in dev env
    if (config.dev) {
      mongoose.set('debug', true);
    }
    console.log('Connected to MongoDB!');
  });
}

mongoose.connection.on('disconnected', () => {
  console.warn('Mongoose connection is disconnected');
});

function onReconnected() {
  console.warn('MongoDB reconnected!');
}

const onSIGINT = async () => {
  console.warn(
    'MongoDB default connection disconnected through app termination!'
  );
  await mongoose.connection.close();
  process.exit(0);
};

(async () => {
  await mongoose.connect(config.mongoose.url, config.mongoose.options);
})();

const db = mongoose.connection;

db.on('error', onError);
db.on('connected', onConnected);
db.on('reconnected', onReconnected);

process.on('SIGINT', onSIGINT);

module.exports = db;
