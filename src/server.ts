import express from 'express';
import { createHandler } from 'graphql-http/lib/use/express';
import { fetchAndProcessMakes } from './services/xml-parser.service';
import { initialDataCheck } from './utils/initialDataCheck';
import { root, schema } from './lib/gql';

const app = express();

// Create and use the GraphQL handler
app.all(
  '/graphql',
  createHandler({
    schema,
    rootValue: root
  })
);

// Start the server at port
app.listen(4000, async () => {
  const needsDataInitialization = await initialDataCheck();
  if (needsDataInitialization) {
    await fetchAndProcessMakes();
  }
  console.log('Running a GraphQL API server at http://localhost:4000/graphql');
});
