const express = require('express');
const router = express.Router();
const adoptionController = require('../controllers/adoptionController');

router.get('/', adoptionController.getAllAdoptions);
router.get('/:id', adoptionController.getAdoptionById);
router.get('/user/:user_id', adoptionController.getAdoptionsByUser);
router.post('/', adoptionController.createAdoption);
router.put('/:id/status', adoptionController.updateAdoptionStatus);
router.delete('/:id', adoptionController.deleteAdoption);

module.exports = router;
