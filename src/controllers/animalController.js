const Animal = require('../models/animalModel');

exports.getAllAnimals = async (req, res) => {
  try {
    const animals = await Animal.findAll();
    res.status(200).json({ success: true, data: animals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAnimalById = async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id);
    if (!animal) {
      return res.status(404).json({ success: false, message: 'Animal not found' });
    }
    res.status(200).json({ success: true, data: animal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createAnimal = async (req, res) => {
  try {
    const animal = await Animal.create(req.body);
    res.status(201).json({ success: true, data: animal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateAnimal = async (req, res) => {
  try {
    const animal = await Animal.update(req.params.id, req.body);
    res.status(200).json({ success: true, data: animal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteAnimal = async (req, res) => {
  try {
    await Animal.delete(req.params.id);
    res.status(200).json({ success: true, message: 'Animal deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
