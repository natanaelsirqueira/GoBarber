import { injectable, inject } from 'tsyringe';
import { getDate, getDaysInMonth, isAfter, endOfYesterday } from 'date-fns';

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
      (_, index) => index + 1,
    );

    const availability = daysInMonth.map(day => {
      const compareDate = new Date(year, month - 1, day, 23, 59, 59);

      const appointmentsInDay = appointmentsInMonth.filter(
        appointment => getDate(appointment.date) === day,
      );

      return {
        day,
        available:
          isAfter(compareDate, new Date()) && appointmentsInDay.length < 10,
      };
    });

    return availability;
  }
}

export default ListProviderMonthAvailabilityService;
