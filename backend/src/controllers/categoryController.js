import categoryModel from '../models/categoryModel.js';

const index = async (req, res) => {
  try {
    const categories = await categoryModel.getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

const store = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await categoryModel.createCategory(name);
    res.status(201).json({ message: 'Category created', category });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category' });
  }
};

export default {
  index,
  store,
};
