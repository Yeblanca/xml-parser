import { parseStringPromise } from 'xml2js';
import { saveDataToMongoDB } from '../lib/db';
import { Make } from '../lib/types';
import Bottleneck from 'bottleneck';

// Fetch all makes from the NHTSA API
export const fetchMakes = async (): Promise<Make[]> => {
  try {
    const response = await fetch('https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=XML');
    const xml = await response.text();
    const result = await parseStringPromise(xml);
    // Return first 100 vehicles
    return result.Response.Results[0].AllVehicleMakes.slice(0, 100);
    // return result.Response.Results[0].AllVehicleMakes;
  } catch (error) {
    console.error('Error fetching makes', error);
    return [];
  }
};

// Configure rate limiting with Bottleneck
const limiter = new Bottleneck({
  maxConcurrent: 5,
  minTime: 333
});

limiter.on('failed', async (error, jobInfo) => {
  const id = jobInfo.options.id;
  console.warn(`Job ${id} failed: ${error}`);
  if (jobInfo.retryCount < 3) {
    // Retry 3 more times
    const delay = 10 * 60 * 1000; // 10 minutes in milliseconds
    console.log(`Retrying job ${id} in ${delay}ms!`);
    return delay;
  }
});

const fetchVehicleTypesForMakeIdWithRetry = async (makeId: string, makeName: string) => {
  return limiter.schedule(() => fetchVehicleTypesForMakeId(makeId, makeName));
};

const processBatchWithRetry = async (batch: { makeId: string; makeName: string }[]) => {
  const results = await Promise.all(batch.map((make) => fetchVehicleTypesForMakeIdWithRetry(make.makeId, make.makeName)));
  await saveDataToMongoDB(results);
  console.log('Batch processed and saved:', results);
};

// Fetch vehicle types for a specific make ID
export const fetchVehicleTypesForMakeId = async (makeId: string, makeName: string) => {
  try {
    const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetVehicleTypesForMakeId/${makeId}?format=xml`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const xml = await response.text();
    const data = await parseStringPromise(xml);

    if (data.Response.Results[0].VehicleTypesForMakeIds === undefined) {
      return {
        makeId,
        makeName,
        vehicleTypes: []
      };
    }

    const vehicleTypes = data.Response.Results[0].VehicleTypesForMakeIds.map((result: { VehicleTypeId: string[]; VehicleTypeName: string[] }) => ({
      typeId: result.VehicleTypeId[0],
      typeName: result.VehicleTypeName[0]
    }));

    return {
      makeId,
      makeName,
      vehicleTypes
    };
  } catch (error) {
    console.error('Error fetching vehicle types', error);
    return {
      makeId,
      makeName,
      vehicleTypes: []
    };
  }
};

// Process all batches of makes
const processBatches = async (batches: { makeId: string; makeName: string }[][]) => {
  for (const batch of batches) {
    await processBatchWithRetry(batch);
  }
  console.log('All batches processed and saved!');
};

// Fetch makes and process them in batches
export const fetchAndProcessMakes = async () => {
  const makes = await fetchMakes();
  const batchSize = 5;
  const makeIds = makes.map((make) => ({
    makeId: make.Make_ID[0],
    makeName: make.Make_Name[0]
  }));

  const batches = [];
  for (let i = 0; i < makeIds.length; i += batchSize) {
    batches.push(makeIds.slice(i, i + batchSize));
  }

  await processBatches(batches);
};
