// xml-parser.service.test.ts

import { fetchMakes, fetchVehicleTypesForMakeId } from './xml-parser.service';

// Mocking saveDataToMongoDB
jest.mock('../lib/db', () => ({
  saveDataToMongoDB: jest.fn()
}));

// Mocking limiter.schedule
// const scheduleMock = jest.fn();
// jest.mock('bottleneck', () => ({
//   __esModule: true,
//   default: jest.fn().mockImplementation(() => ({
//     schedule: scheduleMock
//   }))
// }));

// Mocking fetch for the Fetch API
global.fetch = jest.fn();

describe('fetchMakes', () => {
  it('should fetch makes successfully', async () => {
    // Mocking the response from the API
    const xmlResponse = `<?xml version="1.0"?>
      <Response>
        <Results>
          <AllVehicleMakes>
            <Make_ID>[...]</Make_ID>
            <Make_Name>[...]</Make_Name>
            [...]
          </AllVehicleMakes>
        </Results>
      </Response>`;

    (fetch as jest.Mock).mockResolvedValue({
      text: () => Promise.resolve(xmlResponse)
    });

    const makes = await fetchMakes();
    expect(makes.length).toBeGreaterThan(0);
  });
});

describe('fetchVehicleTypesForMakeId', () => {
  it('should fetch vehicle types for a make successfully', async () => {
    // Mocking the response from the API
    const xmlResponse = `<?xml version="1.0"?>
      <Response>
        <Results>
          <VehicleTypesForMakeIds>
            <VehicleTypeId>[...]</VehicleTypeId>
            <VehicleTypeName>[...]</VehicleTypeName>
            [...]
          </VehicleTypesForMakeIds>
        </Results>
      </Response>`;

    (fetch as jest.Mock).mockResolvedValue({
      text: () => Promise.resolve(xmlResponse),
      ok: true
    });

    const data = await fetchVehicleTypesForMakeId('123', 'Toyota');
    expect(data.vehicleTypes).toHaveLength(1);
  });

  it('should handle error when fetching vehicle types', async () => {
    // Mocking the response from the API
    const xmlResponse = `<?xml version="1.0"?>
      <Response>
        <Results>
          <Error>
            <Code>400</Code>
            <Message>Error message</Message>
          </Error>
        </Results>
      </Response>`;

    (fetch as jest.Mock).mockResolvedValue({
      text: () => Promise.resolve(xmlResponse),
      ok: false
    });

    const data = await fetchVehicleTypesForMakeId('123', 'Toyota');
    expect(data.vehicleTypes).toHaveLength(0);
  });
});
