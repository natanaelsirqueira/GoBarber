import 'reflect-metadata';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let appointmentsRepository: FakeAppointmentsRepository;
let cacheProvider: FakeCacheProvider;
let listProviderAppointments: ListProviderAppointmentsService;

describe('ListProviderAppointments', () => {
  beforeEach(() => {
    appointmentsRepository = new FakeAppointmentsRepository();
    cacheProvider = new FakeCacheProvider();

    listProviderAppointments = new ListProviderAppointmentsService(
      appointmentsRepository,
      cacheProvider,
    );
  });

  it('should be able to list the appointments on a specific day', async () => {
    const appointment1 = await appointmentsRepository.create({
      provider_id: 'provider1',
      user_id: 'user1',
      date: new Date(2020, 0, 20, 14, 0, 0),
    });

    const appointment2 = await appointmentsRepository.create({
      provider_id: 'provider1',
      user_id: 'user1',
      date: new Date(2020, 0, 20, 15, 0, 0),
    });

    const appointments = await listProviderAppointments.execute({
      provider_id: 'provider1',
      year: 2020,
      month: 1,
      day: 20,
    });

    expect(appointments).toEqual([appointment1, appointment2]);
  });

  it('should cache the list of appointments', async () => {
    await appointmentsRepository.create({
      provider_id: 'provider1',
      user_id: 'user1',
      date: new Date(2020, 0, 20, 14, 0, 0),
    });

    await listProviderAppointments.execute({
      provider_id: 'provider1',
      year: 2020,
      month: 1,
      day: 20,
    });

    await appointmentsRepository.create({
      provider_id: 'provider1',
      user_id: 'user1',
      date: new Date(2020, 0, 20, 15, 0, 0),
    });

    const appointments = await listProviderAppointments.execute({
      provider_id: 'provider1',
      year: 2020,
      month: 1,
      day: 20,
    });

    expect(appointments).toHaveLength(1);
  });
});
