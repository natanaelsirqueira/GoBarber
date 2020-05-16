import 'reflect-metadata';

import AppError from '@shared/errors/AppError';
import CreateAppointmentService from './CreateAppointmentService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

let appointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    appointmentsRepository = new FakeAppointmentsRepository();
    createAppointment = new CreateAppointmentService(appointmentsRepository);
  });

  it('should be able to create an appointment', async () => {
    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: '1',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('1');
  });

  it('should not be able to create two appointments on the same date', async () => {
    const date = new Date();

    await createAppointment.execute({ date, provider_id: '1' });

    await expect(
      createAppointment.execute({
        date,
        provider_id: '1',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
