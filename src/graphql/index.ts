// dependencies
import { makeExecutableSchema } from 'graphql-tools';
import { merge } from 'lodash';

// schemas and resolvers
import { schema as coreSchema } from './core';
import { schema as authSchema, resolvers as authResolvers } from './auth';
import { schema as restaurantSchema, resolvers as restaurantResolvers } from './restaurant';
import { schema as userSchema, resolvers as userResolvers } from './user';
import { schema as historySchema, resolvers as historyResolvers } from './history';

const typeDefs = [coreSchema, authSchema, restaurantSchema, userSchema, historySchema];
const resolvers = merge(authResolvers, restaurantResolvers, userResolvers, historyResolvers);

const resolverValidationOptions = {
  // After we fix all errors that this prints, we should probably go
  // back to `true` (the default)
  requireResolversForResolveType: false,
};

const schema = makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers: resolvers,
  resolverValidationOptions,
});

export default schema;
