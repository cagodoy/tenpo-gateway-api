// dependencies
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import expressGraphQL from 'express-graphql';
import schema from './graphql';
import AuthSvc from './clients/auth';
import RestaurantSvc from './clients/restaurants';
import HistorySvc from './clients/history';

// get AUTH_HOST env value
const AUTH_HOST = process.env.AUTH_HOST || '';
if (AUTH_HOST === '') {
  console.log('invalid env AUTH_HOST value');
  process.exit(1);
}

// get AUTH_PORT env value
const AUTH_PORT = process.env.AUTH_PORT || '';
if (AUTH_PORT === '') {
  console.log('invalid env AUTH_PORT value');
  process.exit(1);
}

// get RESTAURANTS_HOST env value
const RESTAURANTS_HOST = process.env.RESTAURANTS_HOST || '';
if (RESTAURANTS_HOST === '') {
  console.log('invalid env RESTAURANTS_HOST value');
  process.exit(1);
}

// get RESTAURANTS_PORT env value
const RESTAURANTS_PORT = process.env.RESTAURANTS_PORT || '';
if (RESTAURANTS_PORT === '') {
  console.log('invalid env RESTAURANTS_PORT value');
  process.exit(1);
}

// get HISTORY_HOST env value
const HISTORY_HOST = process.env.HISTORY_HOST || '';
if (HISTORY_HOST === '') {
  console.log('invalid env HISTORY_HOST value');
  process.exit(1);
}

// get HISTORY_PORT env value
const HISTORY_PORT = process.env.HISTORY_PORT || '';
if (HISTORY_PORT === '') {
  console.log('invalid env HISTORY_PORT value');
  process.exit(1);
}

// initialize express
const app = express();

// define port
const port = process.env.PORT || 5000;

// define morgan for show logs
app.use(morgan(':method :url :status :response-time ms'));

// configure bodyparser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure auth service connection
AuthSvc.config({
  host: AUTH_HOST,
  port: AUTH_PORT,
});

// configure restaurants service connection
RestaurantSvc.config({
  host: RESTAURANTS_HOST,
  port: RESTAURANTS_PORT,
});

// configure history service connection
HistorySvc.config({
  host: HISTORY_HOST,
  port: HISTORY_PORT,
});

// graphql middleware
app.use(
  '/',
  expressGraphQL(async (request, response, graphQLParams) => {
    let token = null;
    const { authorization } = request.headers;
    if (authorization !== undefined) {
      const [, t] = authorization.split(' ');
      if (t !== undefined) {
        token = t;
      }
    }

    return {
      schema: schema,
      graphiql: true,
      rootValue: {
        token,
      },
      formatError: (error) => ({
        message: error.message,
        locations: error.locations,
        stack: error.stack ? error.stack.split('\n') : [],
        path: error.path,
      }),
      pretty: true,
    };
  }),
);

// listen server
const server = app.listen(port, () => console.log(`Gateway backend is running on port ${port}`));

// event listener for graceful shutdown
process.on('SIGTERM', () => {
  server.close((err) => {
    if (err) {
      console.log('here in server.close', err);
      process.exit(1);
    }

    process.exit(0);
  });
});

// export server
export default server;
