import { Repository, getRepository, Raw } from 'typeorm';

import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInDayByProviderDTO from '@modules/appointments/dtos/IFindAllInDayByProviderDTO';
import IFindAllInMonthByProviderDTO from '@modules/appointments/dtos/IFindAllInMonthByProviderDTO';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import Appointment from '../entities/Appointment';

class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async create(data: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create(data);

    await this.ormRepository.save(appointment);

    return appointment;
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const appointment = await this.ormRepository.findOne({ where: { date } });

    return appointment;
  }

  public async findAllInMonthByProvider(
    data: IFindAllInMonthByProviderDTO,
  ): Promise<Appointment[]> {
    const { provider_id, year, month } = data;

    const parsedMonth = month.toString().padStart(2, '0');

    const appointment = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`,
        ),
      },
    });

    return appointment;
  }

  public async findAllInDayByProvider(
    data: IFindAllInDayByProviderDTO,
  ): Promise<Appointment[]> {
    const { provider_id, day, month, year } = data;

    const parsedDay = day.toString().padStart(2, '0');
    const parsedMonth = month.toString().padStart(2, '0');

    const appointment = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
        ),
      },
    });

    return appointment;
  }
}

export default AppointmentsRepository;
