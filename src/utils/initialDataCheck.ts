import { prisma } from './../lib/client';

export const initialDataCheck = async () => {
  const maxRetries = 5;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const makeCount = await prisma.make.count();
      console.log(`Make count: ${makeCount}`);
      return makeCount === 0;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: unknown | any) {
      console.error(`Attempt ${attempt + 1} failed: ${error.message}`);
      attempt++;
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds before retrying
    }
  }

  throw new Error('Failed to connect to MongoDB after multiple attempts');
};
