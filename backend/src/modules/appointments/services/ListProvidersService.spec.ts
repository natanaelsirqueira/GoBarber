import 'reflect-metadata';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProvidersService from './ListProvidersService';

let usersRepository: FakeUsersRepository;
let cacheProvider: FakeCacheProvider;
let listProviders: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    usersRepository = new FakeUsersRepository();
    cacheProvider = new FakeCacheProvider();
    listProviders = new ListProvidersService(usersRepository, cacheProvider);
  });

  it('should be able to list the providers', async () => {
    const user1 = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const user2 = await usersRepository.create({
      name: 'John Trê',
      email: 'johntre@example.com',
      password: '123456',
    });

    const loggedUser = await usersRepository.create({
      name: 'John Ono',
      email: 'johnono@example.com',
      password: '123456',
    });

    const providers = await listProviders.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toEqual([user1, user2]);
  });

  it('should cache the list of providers', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const loggedUser = await usersRepository.create({
      name: 'John Ono',
      email: 'johnono@example.com',
      password: '123456',
    });

    await listProviders.execute({ user_id: loggedUser.id });

    await usersRepository.create({
      name: 'John Trê',
      email: 'johntre@example.com',
      password: '123456',
    });

    const providers = await listProviders.execute({ user_id: loggedUser.id });

    expect(providers).toHaveLength(1);
  });
});
