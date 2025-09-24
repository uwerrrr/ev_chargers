import { IChargerDto } from './charger.dto';
import { ICharger } from './charger.model';

// Maps a Mongoose charger document to a public-facing ChargerDto.
// This ensures only intended data is exposed via the API.
export function toChargerDto(charger: ICharger): IChargerDto {
  return {
    id: charger.id,
    location: charger.location,
    status: charger.status,
    supportedPlugTypes: charger.supportedPlugTypes,
  };
}

