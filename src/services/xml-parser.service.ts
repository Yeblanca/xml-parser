import { parseStringPromise } from 'xml2js';

interface VehicleType {
  makeId: string;
  makeName: string;
  modelId: string;
  modelName: string;
}

export const fetchMakes = async () => {
  const response = await fetch('https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=XML');

  const xml = await response.text();

  const result = await parseStringPromise(xml);

  return result;
};

export const fetchVehicleTypesForMakeIds = async (makeIds: number[], batchSize: number) => {
  const allVehicleTypes: VehicleType[] = [];
};
