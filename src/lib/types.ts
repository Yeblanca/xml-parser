export type VehicleType = {
  typeId: string;
  typeName: string;
};

export type Make = {
  Make_ID: string[];
  Make_Name: string[];
};

export type MakeWithVehicleTypes = {
  makeId: string;
  makeName: string;
  vehicleTypes: VehicleType[];
};
