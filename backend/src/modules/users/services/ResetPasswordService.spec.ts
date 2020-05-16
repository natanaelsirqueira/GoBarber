import 'reflect-metadata';

import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import ResetPasswordService from './ResetPasswordService';

let usersRepository: FakeUsersRepository;
let userTokensRepository: FakeUserTokensRepository;
let hashProvider: FakeHashProvider;
let resetPasswordService: ResetPasswordService;

describe('ResetPassword', () => {
  beforeEach(() => {
    usersRepository = new FakeUsersRepository();
    userTokensRepository = new FakeUserTokensRepository();
    hashProvider = new FakeHashProvider();

    resetPasswordService = new ResetPasswordService(
      usersRepository,
      userTokensRepository,
      hashProvider,
    );
  });

  it('should be able to reset the password', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const { token } = await userTokensRepository.generate(user.id);

    const generateHash = jest.spyOn(hashProvider, 'generateHash');

    await resetPasswordService.execute({
      password: '654321',
      token,
    });

    expect(generateHash).toHaveBeenCalledWith('654321');
  });

  it('should not be able to reset the password with a non-existing token', async () => {
    await expect(
      resetPasswordService.execute({
        password: '654321',
        token: '123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password with of a non-existing user', async () => {
    const userToken = await userTokensRepository.generate('foo');

    await expect(
      resetPasswordService.execute({
        password: '654321',
        token: userToken.token,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password if more than 2 hours have passed', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const { token } = await userTokensRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPasswordService.execute({
        password: '654321',
        token,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
