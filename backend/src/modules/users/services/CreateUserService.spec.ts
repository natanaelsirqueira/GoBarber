import 'reflect-metadata';

import AppError from '@shared/errors/AppError';
import CreateUserService from './CreateUserService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

describe('CreateUser', () => {
  it('should be able to create a user', async () => {
    const usersRepository = new FakeUsersRepository();
    const hashProvider = new FakeHashProvider();
    const createUser = new CreateUserService(usersRepository, hashProvider);

    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('johndoe@example.com');
  });

  it('should not be able to create two users with the same email', async () => {
    const usersRepository = new FakeUsersRepository();
    const hashProvider = new FakeHashProvider();
    const createUser = new CreateUserService(usersRepository, hashProvider);

    const data = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    };

    await createUser.execute(data);

    expect(createUser.execute(data)).rejects.toBeInstanceOf(AppError);
  });
});
