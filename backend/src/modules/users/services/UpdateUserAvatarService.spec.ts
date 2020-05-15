import 'reflect-metadata';

import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import UpdateUserAvatarService from './UpdateUserAvatarService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

describe('UpdateUserAvatar', () => {
  it('should be able to update an user avatar', async () => {
    const usersRepository = new FakeUsersRepository();
    const storageProvider = new FakeStorageProvider();

    const updateUserAvatar = new UpdateUserAvatarService(
      usersRepository,
      storageProvider,
    );

    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      filename: 'avatar.jpg',
    });

    expect(user.avatar).toBe('avatar.jpg');
  });

  it('should not be able to update the avatar of a non existing user', async () => {
    const usersRepository = new FakeUsersRepository();
    const storageProvider = new FakeStorageProvider();

    const updateUserAvatar = new UpdateUserAvatarService(
      usersRepository,
      storageProvider,
    );

    expect(
      updateUserAvatar.execute({
        user_id: '1',
        filename: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete the old avatar file', async () => {
    const usersRepository = new FakeUsersRepository();
    const storageProvider = new FakeStorageProvider();

    const updateUserAvatar = new UpdateUserAvatarService(
      usersRepository,
      storageProvider,
    );

    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      filename: 'avatar1.jpg',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      filename: 'avatar2.jpg',
    });

    expect(await storageProvider.getFile('avatar1.jpg')).toBeFalsy();
  });
});
