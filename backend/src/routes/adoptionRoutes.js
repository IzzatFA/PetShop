import express from 'express';
import adoptionController from '../controllers/adoptionController.js';

const router = express.Router();

router.get('/', adoptionController.index);
router.post('/', adoptionController.store);
router.get('/user/:userId', adoptionController.userAdoptions);
router.put('/:id/status', adoptionController.updateStatus);

export default router;
