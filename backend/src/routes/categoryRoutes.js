import express from 'express';
import categoryController from '../controllers/categoryController.js';

const router = express.Router();

router.get('/', categoryController.index);
router.post('/', categoryController.store);

export default router;
