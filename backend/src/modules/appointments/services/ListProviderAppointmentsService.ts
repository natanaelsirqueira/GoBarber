import { injectable, inject } from 'tsyringe';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import Appointment from '../infra/typeorm/entities/Appointment';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

@injectable()
class ListProviderAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute(data: IRequest): Promise<Appointment[]> {
    const { provider_id, day, month, year } = data;

    const appointments = await this.appointmentsRepository.findAllInDayByProvider(
      {
        provider_id,
        day,
        month,
        year,
      },
    );

    return appointments;
  }
}

export default ListProviderAppointmentsService;
