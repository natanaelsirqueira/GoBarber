import { container } from 'tsyringe';

import ICacheProvider from './protocols/ICacheProvider';
import RedisCacheProvider from './implementations/RedisCacheProvider';

container.registerSingleton<ICacheProvider>(
  'CacheProvider',
  RedisCacheProvider,
);
