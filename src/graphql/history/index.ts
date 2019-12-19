import schema from './schemas';

import History from './resolvers/models/history';
import Query from './resolvers/queries';

const resolvers = {
  History,
  Query,
};

export { schema, resolvers };
