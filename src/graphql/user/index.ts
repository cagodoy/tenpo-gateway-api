import schema from './schemas';

import User from './resolvers/models/user';
// import Query from './resolvers/queries';
// import Mutation from './resolvers/mutations';

const resolvers = {
  User,
  // Query,
  // Mutation,
};

export { schema, resolvers };
