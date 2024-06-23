import { prisma } from './../lib/client';

export const root = {
  async makes({ first = 10, skip = 0 }) {
    return await prisma.make.findMany({
      take: first,
      skip: skip,
      include: {
        vehicleTypes: true
      }
    });
  },
  async vehicleTypesByMake({ makeId }: { makeId: string }) {
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
