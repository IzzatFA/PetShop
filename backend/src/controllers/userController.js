import userModel from '../models/userModel.js';

const isValidPassword = (password) => /^(?=.*[^A-Za-z0-9]).{8,}$/.test(password);

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!isValidPassword(password || '')) {
      return res.status(400).json({ error: 'Password must be at least 8 characters and contain a special character' });
    }

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
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await userModel.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Exclude password from response
    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json({ message: 'Login successful', user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: 'Failed to login', details: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    if (password && !isValidPassword(password)) {
      return res.status(400).json({ error: 'Password must be at least 8 characters and contain a special character' });
    }

    const user = await userModel.updateUser(req.params.id, {
      name,
      email,
      password: password || null,
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json({ message: 'Profile updated successfully', user: userWithoutPassword });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Email already exists' });
    }

    res.status(500).json({ error: 'Failed to update profile', details: error.message });
  }
};

export default {
  register,
  login,
  updateProfile,
};
