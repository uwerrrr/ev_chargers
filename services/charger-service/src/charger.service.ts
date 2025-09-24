import { ChargerModel } from './charger.model';
import { ICharger } from './charger.model';

// Mock data to seed the database for demonstration purposes.
const mockChargers = [
    { id: 101, location: 'Sydney CBD Carpark', status: 'available', supportedPlugTypes: ['CCS2', 'CHAdeMO'] },
    { id: 102, location: 'Sydney CBD Carpark', status: 'in-use', supportedPlugTypes: ['CCS2'] },
    { id: 103, location: 'Parramatta Mall', status: 'available', supportedPlugTypes: ['Type2', 'CCS2'] },
];

// Seeds the database with initial data if it's empty.
export async function seedDatabase() {
  if (await ChargerModel.countDocuments() === 0) {
    console.log('Seeding database for Charger Service...');
    await ChargerModel.insertMany(mockChargers);
  }
}

/**
 * Queries the database for chargers that are 'available' and support a specific plug type.
 * @param {string} plugType - The plug type to filter by (e.g., "CCS2").
 * @returns {Promise<ICharger[]>} A promise that resolves to an array of matching charger documents.
 */
export async function findAvailableChargersByPlugType(plugType: string): Promise<ICharger[]> {
  return ChargerModel.find({
    status: 'available',
    supportedPlugTypes: plugType, // Mongoose finds documents where 'plugType' is in the array.
  });
}
