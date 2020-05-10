import { Router } from 'express'
import multer from 'multer'

import uploadConfig from '../config/upload'
import ensureAthenticated from '../middlewares/ensureAthenticated'
import CreateUser from '../services/CreateUser'
import UpdateUserAvatar from '../services/UpdateUserAvatar'

const usersRouter = Router()
const upload = multer(uploadConfig)

usersRouter.post('/', async (request, response) => {
  const { name, email, password } = request.body

  const createUser = new CreateUser()

  const user = await createUser.execute({ name, email, password })

  delete user.password

  return response.json(user)
})

usersRouter.patch(
  '/avatar',
  ensureAthenticated,
  upload.single('avatar'),
  async (request, response) => {
    const updateUserAvatar = new UpdateUserAvatar()

    const user = await updateUserAvatar.execute({
      user_id: request.user.id,
      filename: request.file.filename,
    })

    delete user.password

    return response.json(user)
  },
)

export default usersRouter
