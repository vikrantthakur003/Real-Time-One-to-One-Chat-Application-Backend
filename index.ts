require('dotenv')
  .config();

import express from 'express';
import { appLoader, databaseLoader } from './src/loaders';
import router from './src/routes';

process.on('uncaughtException', err => {
  console.log(' UNCAUGHT EXCEPTION ');
  console.log('[Inside \'uncaughtException\' event] ' + err.stack || err.message);
});
process.on('unhandledRejection',
  (reason, promise) => {
    console.log(' UNHANDLED REJECTION ');
    console.log('Unhandled Rejection at: ', promise, 'REASON: ', reason);
  });

const app = express();

databaseLoader()
  .then(() => appLoader(app, router))
  .catch(error => {
    console.log(error);
    process.exit(1);
  });


  declare global {
    namespace Express {
      interface Request {
        user?: any;
      }
    }
  }
  