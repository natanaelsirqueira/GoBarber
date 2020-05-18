import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/protocols/ICacheProvider';
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

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute(data: IRequest): Promise<Appointment[]> {
    const { provider_id, day, month, year } = data;

    const cacheKey = `provider-appointments:${provider_id}:${year}-${month}-${day}`;

    let appointments = await this.cacheProvider.retrieve<Appointment[]>(
      cacheKey,
    );

    if (!appointments) {
      appointments = await this.appointmentsRepository.findAllInDayByProvider({
        provider_id,
        day,
        month,
        year,
      });

      await this.cacheProvider.save(cacheKey, appointments);
    }

    return appointments;
  }
}

export default ListProviderAppointmentsService;
