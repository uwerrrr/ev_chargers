import { Schema, model, Document } from 'mongoose';

// The set of plug types the system knows about. Keep this in sync with any
// seed/mock data (see charger.service.ts) that assigns supportedPlugTypes.
export const PLUG_TYPES = ['CCS2', 'CHAdeMO', 'Type2'] as const;
export type PlugType = (typeof PLUG_TYPES)[number];

// TypeScript interface for a Charger document.
export interface ICharger extends Document {
  id: number;
  location: string;
  status: 'available' | 'in-use' | 'out-of-order';
  supportedPlugTypes: PlugType[];
}

// Mongoose schema defining the structure and validation for the Charger collection.
const ChargerSchema = new Schema<ICharger>({
  id: { type: Number, required: true, unique: true },
  location: { type: String, required: true },
  status: { type: String, required: true, enum: ['available', 'in-use', 'out-of-order'] },
  // `required: true` on an array element only means each *entry* must be non-empty —
  // it does not require the array itself to be non-empty, so a separate validator
  // is needed to reject a charger with no supported plug types at all.
  supportedPlugTypes: {
    type: [{ type: String, enum: PLUG_TYPES, required: true }],
    validate: {
      validator: (plugTypes: string[]) => plugTypes.length > 0,
      message: 'supportedPlugTypes must contain at least one plug type.',
    },
  },
});

// Mongoose model providing an interface to the database.
export const ChargerModel = model<ICharger>('Charger', ChargerSchema);

