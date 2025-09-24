// Defines the data shape for a charger that is sent back to the client.
// This decouples the API response from the internal database model.
export interface IChargerDto {
  id: number;
  location: string;
  status: string;
  supportedPlugTypes: string[];
  filteredWithDTO: boolean;
}

