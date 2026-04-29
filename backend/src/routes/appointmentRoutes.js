import express from 'express';
import appointmentController from '../controllers/appointmentController.js';

const router = express.Router();

router.get('/', appointmentController.index);
router.post('/', appointmentController.store);
router.get('/user/:userId', appointmentController.userAppointments);

export default router;
