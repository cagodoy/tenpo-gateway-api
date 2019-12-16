import schema from './schemas';

import Restaurant from './resolvers/models/restaurant';
import Query from './resolvers/queries';

const resolvers = {
  Restaurant,
  Query,
};

export { schema, resolvers };
