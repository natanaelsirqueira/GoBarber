import 'reflect-metadata';

import AppError from '@shared/errors/AppError';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let appointmentsRepository: FakeAppointmentsRepository;
let notificationsRepository: FakeNotificationsRepository;
let cacheProvider: FakeCacheProvider;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    appointmentsRepository = new FakeAppointmentsRepository();
    notificationsRepository = new FakeNotificationsRepository();
    cacheProvider = new FakeCacheProvider();

    createAppointment = new CreateAppointmentService(
      appointmentsRepository,
      notificationsRepository,
      cacheProvider,
    );
  });

  it('should be able to create an appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 0, 10, 12).getTime();
    });

    const appointment = await createAppointment.execute({
      date: new Date(2020, 0, 10, 13),
      user_id: 'user1',
      provider_id: 'provider1',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('provider1');
  });

  it('should not be able to create two appointments on the same date', async () => {
    const date = new Date(2020, 0, 10, 12);

    jest.spyOn(Date, 'now').mockImplementation(() => {
      return date.getTime();
    });

    await createAppointment.execute({
      date,
      user_id: 'user1',
      provider_id: 'provider1',
    });

    await expect(
      createAppointment.execute({
        date,
        user_id: 'user1',
        provider_id: 'provider1',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 0, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 0, 10, 11),
        user_id: 'user1',
        provider_id: 'provider1',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 0, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 0, 10, 13),
        user_id: 'user1',
        provider_id: 'user1',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment before 8AM or after 5PM', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 0, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 0, 11, 7),
        user_id: 'user1',
        provider_id: 'provider1',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        date: new Date(2020, 0, 11, 18),
        user_id: 'user1',
        provider_id: 'provider1',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
