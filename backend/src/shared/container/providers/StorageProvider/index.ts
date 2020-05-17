import { container } from 'tsyringe';

import IStorageProvider from './protocols/IStorageProvider';
import DiskStorageProvider from './implementations/DiskStorageProvider';

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  DiskStorageProvider,
);
