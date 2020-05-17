import 'reflect-metadata';

import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

let appointmentsRepository: FakeAppointmentsRepository;
let listAvailability: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    appointmentsRepository = new FakeAppointmentsRepository();

    listAvailability = new ListProviderMonthAvailabilityService(
      appointmentsRepository,
    );
  });

  it('should be able to list the provider month availability', async () => {
    const eachHourArray = Array.from({ length: 10 }, (_, index) => index + 8);

    await Promise.all(
      eachHourArray.map(hour =>
        appointmentsRepository.create({
          provider_id: 'user',
          date: new Date(2020, 0, 20, hour, 0, 0),
        }),
      ),
    );

    await appointmentsRepository.create({
      provider_id: 'user',
      date: new Date(2020, 0, 21, 8, 0, 0),
    });

    await appointmentsRepository.create({
      provider_id: 'user',
      date: new Date(2020, 1, 21, 8, 0, 0),
    });

    const availability = await listAvailability.execute({
      provider_id: 'user',
      year: 2020,
      month: 1,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 19, available: true },
        { day: 20, available: false },
        { day: 21, available: true },
      ]),
    );
  });
});
