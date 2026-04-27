const Adoption = require('../models/adoptionModel');

exports.getAllAdoptions = async (req, res) => {
  try {
    const adoptions = await Adoption.findAll();
    res.status(200).json({ success: true, data: adoptions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAdoptionById = async (req, res) => {
  try {
    const adoption = await Adoption.findById(req.params.id);
    if (!adoption) {
      return res.status(404).json({ success: false, message: 'Adoption not found' });
    }
    res.status(200).json({ success: true, data: adoption });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAdoptionsByUser = async (req, res) => {
  try {
    const adoptions = await Adoption.findByUser(req.params.user_id);
    res.status(200).json({ success: true, data: adoptions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createAdoption = async (req, res) => {
  try {
    const adoptionData = {
      ...req.body,
      status: req.body.status || 'pending'
    };
    const adoption = await Adoption.create(adoptionData);
    res.status(201).json({ success: true, data: adoption });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateAdoptionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const adoption = await Adoption.updateStatus(req.params.id, status);
    res.status(200).json({ success: true, data: adoption });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteAdoption = async (req, res) => {
  try {
    await Adoption.delete(req.params.id);
    res.status(200).json({ success: true, message: 'Adoption deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
