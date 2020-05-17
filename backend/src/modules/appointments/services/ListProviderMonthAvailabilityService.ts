import { injectable, inject } from 'tsyringe';
import { getDate, getDaysInMonth } from 'date-fns';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
class ListProviderMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute(data: IRequest): Promise<IResponse> {
    const { provider_id, year, month } = data;

    const appointmentsInMonth = await this.appointmentsRepository.findAllInMonthByProvider(
      {
        provider_id,
        year,
        month,
      },
    );

    const daysInMonth = Array.from(
      { length: getDaysInMonth(new Date(year, month - 1)) },
      (_value, index) => index + 1,
    );

    const availability = daysInMonth.map(day => {
      const appointmentsInDay = appointmentsInMonth.filter(
        appointment => getDate(appointment.date) === day,
      );

      return {
        day,
        available: appointmentsInDay.length < 10,
      };
    });

    return availability;
  }
}

export default ListProviderMonthAvailabilityService;
