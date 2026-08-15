import { describe, it, expect } from 'vitest';
import { toChargerDto } from './charger.mapper';
import { ICharger } from './charger.model';

function makeCharger(overrides: Partial<ICharger> = {}): ICharger {
  return {
    id: 101,
    location: 'Sydney CBD Carpark',
    status: 'available',
    supportedPlugTypes: ['CCS2', 'CHAdeMO'],
    ...overrides,
  } as ICharger;
}

describe('toChargerDto', () => {
  it('maps the fields intended for public exposure', () => {
    const dto = toChargerDto(makeCharger());

    expect(dto).toEqual({
      id: 101,
      location: 'Sydney CBD Carpark',
      status: 'available',
      supportedPlugTypes: ['CCS2', 'CHAdeMO'],
      filteredWithDTO: true,
    });
  });

  it('always sets filteredWithDTO to true, marking the response as mapped', () => {
    const dto = toChargerDto(makeCharger({ id: 999 }));
    expect(dto.filteredWithDTO).toBe(true);
  });

  it('does not leak Mongoose document internals onto the DTO', () => {
    const dto = toChargerDto(makeCharger());
    expect(Object.keys(dto).sort()).toEqual(
      ['filteredWithDTO', 'id', 'location', 'status', 'supportedPlugTypes'].sort()
    );
  });
});
