import express from 'express';
import { buildSchema } from 'graphql';
import { createHandler } from 'graphql-http/lib/use/express';
import { PrismaClient } from '@prisma/client';
import { fetchAndProcessMakes } from './services/xml-parser.service';

const prisma = new PrismaClient();
let dataInitialized = true; // Flag to track if data has been initialized, more elegant options can be implemented.

console.log('Database URL:', process.env.DATABASE_URL);

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type MakeVehicleTypes {
    typeId: String
    typeName: String
  }

  type Make {
    id: String
    makeId: String
    makeName: String
    vehicleTypes: [MakeVehicleTypes]
  }

  type Query {
    makes(first: Int, skip: Int): [Make]
    vehicleTypesByMake(makeId: String!): [MakeVehicleTypes]
  }
`);

const root = {
  async makes({ first = 10, skip = 0 }) {
    if (!dataInitialized) {
      await fetchAndProcessMakes();
      dataInitialized = true;
    }
    return await prisma.make.findMany({
      take: first,
      skip: skip,
      include: {
        vehicleTypes: true
      }
    });
  },
  async vehicleTypesByMake({ makeId }: { makeId: string }) {
    console.log(makeId);
    const results = await prisma.make.findMany({
      where: {
        makeId: makeId
      },
      include: {
        vehicleTypes: true
      }
    });
    return results[0].vehicleTypes;
  }
};

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
  if (!dataInitialized) {
    await fetchAndProcessMakes();
    dataInitialized = true;
  }
  console.log('Running a GraphQL API server at http://localhost:4000/graphql');
});
