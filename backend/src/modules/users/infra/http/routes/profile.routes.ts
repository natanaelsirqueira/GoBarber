import { Router } from 'express';

import ProfileController from '../controllers/ProfileController';
import ensureAthenticated from '../middlewares/ensureAthenticated';

const profileRouter = Router();
const profileController = new ProfileController();

profileRouter.use(ensureAthenticated);

profileRouter.get('/', profileController.show);
profileRouter.post('/', profileController.update);

export default profileRouter;
