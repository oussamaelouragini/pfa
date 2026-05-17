import { Router } from 'express';
import verifyJWT from '../middleware/JWT';
import { uploadAvatarMiddleware } from '../middleware/upload';
import { getProfile, updateProfile, uploadAvatar, deleteAvatar } from '../Controllers/userController';

const router = Router();

router.use(verifyJWT);

router.route('/profile')
  .get(getProfile)
  .put(updateProfile);

router.route('/avatar')
  .post(uploadAvatarMiddleware, uploadAvatar)
  .delete(deleteAvatar);

export default router;
