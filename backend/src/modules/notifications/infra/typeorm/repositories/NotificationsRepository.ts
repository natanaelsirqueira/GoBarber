import { MongoRepository, getMongoRepository } from 'typeorm';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import Notification from '../schemas/Notification';

class NotificationsRepository implements INotificationsRepository {
  private ormRepository: MongoRepository<Notification>;

  constructor() {
    this.ormRepository = getMongoRepository(Notification, 'mongo');
  }

  public async create(data: ICreateNotificationDTO): Promise<Notification> {
    const { recipient_id, content } = data;

    const notification = this.ormRepository.create({ recipient_id, content });

    await this.ormRepository.save(notification);

    return notification;
  }
}

export default NotificationsRepository;
