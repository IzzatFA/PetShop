import adoptionModel from '../models/adoptionModel.js';
import animalModel from '../models/animalModel.js';

const index = async (req, res) => {
  try {
    const adoptions = await adoptionModel.getAllAdoptions();
    res.status(200).json(adoptions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch adoptions' });
  }
};

const store = async (req, res) => {
  try {
    const { user_id, animal_id, ...adopterData } = req.body;
    const adoption = await adoptionModel.createAdoption(user_id, animal_id, adopterData);
    res.status(201).json({ message: 'Adoption request submitted', adoption });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit adoption request', details: error.message });
  }
};

const userAdoptions = async (req, res) => {
  try {
    const adoptions = await adoptionModel.getAdoptionsByUserId(req.params.userId);
    res.status(200).json(adoptions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch adoptions' });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body; // pending, approved, rejected
    const adoption = await adoptionModel.updateAdoptionStatus(req.params.id, status);
    
    if (status === 'approved' && adoption) {
      await animalModel.updateAnimalStatus(adoption.animal_id, 'adopted');
    } else if (adoption) {
      await animalModel.updateAnimalStatus(adoption.animal_id, 'available');
    }
    
    res.status(200).json({ message: 'Adoption status updated', adoption });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update adoption status' });
  }
};

export default {
  index,
  store,
  userAdoptions,
  updateStatus,
};
