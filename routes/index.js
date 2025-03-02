import { Router } from 'express';
const router = Router();

router.use('/auth', require('./auth'));
router.use('/conversations', require('./conversations'));

export default router;