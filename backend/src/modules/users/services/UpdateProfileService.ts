import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/protocols/IHashProvider';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute(data: IRequest): Promise<User> {
    const { user_id, name, email, old_password, password } = data;

    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found.');
    }

    const foundUser = await this.usersRepository.findByEmail(email);

    if (foundUser && foundUser.id !== user_id) {
      throw new AppError('E-mail already used.');
    }

    user.name = name;
    user.email = email;

    if (password && !old_password) {
      throw new AppError(
        'You need to provide the old password to set a new password.',
      );
    }

    if (password && old_password) {
      const oldPasswordMatches = await this.hashProvider.compareHash(
        old_password,
        user.password,
      );

      if (oldPasswordMatches) {
        user.password = await this.hashProvider.generateHash(password);
      } else {
        throw new AppError('Old password does not match.');
      }
    }

    return this.usersRepository.save(user);
  }
}

export default UpdateProfileService;
