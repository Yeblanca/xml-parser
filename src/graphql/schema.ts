import { buildSchema } from 'graphql';

export const schema = buildSchema(`
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
