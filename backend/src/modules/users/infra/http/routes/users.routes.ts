import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';
import CreateUser from '@modules/users/services/CreateUser';
import UpdateUserAvatar from '@modules/users/services/UpdateUserAvatar';
import ensureAthenticated from '../middlewares/ensureAthenticated';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
  const { name, email, password } = request.body;

  const createUser = new CreateUser();

  const user = await createUser.execute({ name, email, password });

  delete user.password;

  return response.json(user);
});

usersRouter.patch(
  '/avatar',
  ensureAthenticated,
  upload.single('avatar'),
  async (request, response) => {
    const updateUserAvatar = new UpdateUserAvatar();

    const user = await updateUserAvatar.execute({
      user_id: request.user.id,
      filename: request.file.filename,
    });

    delete user.password;

    return response.json(user);
  },
);

export default usersRouter;
