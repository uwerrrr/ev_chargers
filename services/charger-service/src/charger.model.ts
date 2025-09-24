import { Schema, model, Document } from 'mongoose';

// TypeScript interface for a Charger document.
export interface ICharger extends Document {
  id: number;
  location: string;
  status: 'available' | 'in-use' | 'out-of-order';
  supportedPlugTypes: string[];
}

// Mongoose schema defining the structure and validation for the Charger collection.
const ChargerSchema = new Schema<ICharger>({
  id: { type: Number, required: true, unique: true },
  location: { type: String, required: true },
  status: { type: String, required: true, enum: ['available', 'in-use', 'out-of-order'] },
  supportedPlugTypes: [{ type: String, required: true }],
});

// Mongoose model providing an interface to the database.
export const ChargerModel = model<ICharger>('Charger', ChargerSchema);

