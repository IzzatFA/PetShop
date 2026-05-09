import animalModel from '../models/animalModel.js';

const index = async (req, res) => {
  try {
    const animals = await animalModel.getAllAnimals();
    res.status(200).json(animals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch animals' });
  }
};

const show = async (req, res) => {
  try {
    const animal = await animalModel.getAnimalById(req.params.id);
    if (!animal) {
      return res.status(404).json({ error: 'Animal not found' });
    }
    res.status(200).json(animal);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch animal' });
  }
};

const store = async (req, res) => {
  try {
    const { category_id, breed, age, description, status, image_url, price } = req.body;
    const animal = await animalModel.createAnimal(category_id, breed, age, description, status, image_url, price);
    res.status(201).json({ message: 'Animal created', animal });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create animal', details: error.message });
  }
};

const update = async (req, res) => {
  try {
    const animal = await animalModel.updateAnimal(req.params.id, req.body);
    if (!animal) {
      return res.status(404).json({ error: 'Animal not found' });
    }
    res.status(200).json({ message: 'Animal updated', animal });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update animal' });
  }
};

const destroy = async (req, res) => {
  try {
    const animal = await animalModel.deleteAnimal(req.params.id);
    if (!animal) {
      return res.status(404).json({ error: 'Animal not found' });
    }
    res.status(200).json({ message: 'Animal deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete animal' });
  }
};

const getDeleted = async (req, res) => {
  try {
    const animals = await animalModel.getDeletedAnimals();
    res.status(200).json(animals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch deleted animals' });
  }
};

const restore = async (req, res) => {
  try {
    const animal = await animalModel.restoreAnimal(req.params.id);
    if (!animal) {
      return res.status(404).json({ error: 'Animal not found' });
    }
    res.status(200).json({ message: 'Animal restored', animal });
  } catch (error) {
    res.status(500).json({ error: 'Failed to restore animal' });
  }
};

const forceDelete = async (req, res) => {
  try {
    const animal = await animalModel.hardDeleteAnimal(req.params.id);
    if (!animal) {
      return res.status(404).json({ error: 'Animal not found' });
    }
    res.status(200).json({ message: 'Animal permanently deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to permanently delete animal' });
  }
};

export default {
  index,
  show,
  store,
  update,
  destroy,
  getDeleted,
  restore,
  forceDelete,
};
