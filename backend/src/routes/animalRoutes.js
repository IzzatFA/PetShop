import express from 'express';
import animalController from '../controllers/animalController.js';

const router = express.Router();

router.get('/', animalController.index);
router.get('/:id', animalController.show);
router.post('/', animalController.store);
router.put('/:id', animalController.update);
router.delete('/:id', animalController.destroy);

export default router;
