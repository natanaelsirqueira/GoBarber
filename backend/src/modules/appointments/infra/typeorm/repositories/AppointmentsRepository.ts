import { Repository, getRepository } from 'typeorm';

import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

import Appointment from '../entities/Appointment';

class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async find(): Promise<Appointment[]> {
    return this.ormRepository.find();
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const appointment = await this.ormRepository.findOne({ where: { date } });

    return appointment;
  }

  public async create(data: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create(data);

    await this.ormRepository.save(appointment);

    return appointment;
  }
}

export default AppointmentsRepository;
