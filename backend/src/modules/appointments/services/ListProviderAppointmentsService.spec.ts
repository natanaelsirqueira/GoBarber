import 'reflect-metadata';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let appointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointments: ListProviderAppointmentsService;

describe('ListProviderAppointments', () => {
  beforeEach(() => {
    appointmentsRepository = new FakeAppointmentsRepository();

    listProviderAppointments = new ListProviderAppointmentsService(
      appointmentsRepository,
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
});
