// dependencies
import { makeExecutableSchema } from 'graphql-tools';
import { merge } from 'lodash';

// schemas and resolvers
import { schema as coreSchema } from './core';
import { schema as authSchema, resolvers as authResolvers } from './auth';
import { schema as restaurantSchema, resolvers as restaurantResolvers } from './restaurant';
import { schema as userSchema, resolvers as userResolvers } from './user';

const typeDefs = [coreSchema, authSchema, restaurantSchema, userSchema];
const resolvers = merge(authResolvers, restaurantResolvers, userResolvers);

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
