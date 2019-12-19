import fs from 'fs';

let schema;
try {
  schema = fs.readFileSync(__dirname + '/schema.graphql', 'utf8');
} catch (err) {
  throw err;
}

export default schema;
