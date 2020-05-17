import 'reflect-metadata';

import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

let appointmentsRepository: FakeAppointmentsRepository;
let listAvailability: ListProviderDayAvailabilityService;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    appointmentsRepository = new FakeAppointmentsRepository();

    listAvailability = new ListProviderDayAvailabilityService(
      appointmentsRepository,
    );
  });

  it('should be able to list the provider day availability', async () => {
    await appointmentsRepository.create({
      provider_id: 'user',
      date: new Date(2020, 0, 20, 12, 0, 0),
    });

    await appointmentsRepository.create({
      provider_id: 'user',
      date: new Date(2020, 0, 20, 13, 0, 0),
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 0, 20, 10).getTime();
    });

    const availability = await listAvailability.execute({
      provider_id: 'user',
      year: 2020,
      month: 1,
      day: 20,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: false },
        { hour: 10, available: false },
        { hour: 11, available: true },
        { hour: 12, available: false },
        { hour: 13, available: false },
        { hour: 14, available: true },
      ]),
    );
  });
});
