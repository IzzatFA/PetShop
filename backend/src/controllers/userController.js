import userModel from '../models/userModel.js';

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = await userModel.createUser(name, email, password);
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Failed to register user', details: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findUserByEmail(email);
    
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to login', details: error.message });
  }
};

export default {
  register,
  login,
};
