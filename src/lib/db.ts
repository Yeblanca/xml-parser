import { MakeWithVehicleTypes } from './types';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const saveDataToMongoDB = async (data: MakeWithVehicleTypes[]) => {
  try {
    for (const item of data) {
      await prisma.make.create({
        data: {
          makeId: item.makeId,
          makeName: item.makeName,
          vehicleTypes: item.vehicleTypes
        }
      });
    }
    console.log('Data saved to MongoDB');
  } catch (error) {
    console.error('Error saving data to MongoDB', error);
  } finally {
    await prisma.$disconnect();
  }
};
