

import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Signup
export const signup = async (req, res) => {
  try {
    const { firstname, lastname, username, phonenumber, email, password, role } = req.body;

    const userExists = await User.findOne({ username });
    if (userExists) return res.status(400).json({ message: 'Username not valid' });

    const emailExists = await User.findOne({ email });
    if (emailExists) return res.status(400).json({ message: 'Email not valid' });

    const user = await User.create({ firstname, lastname, username, phonenumber, email, password, role });

    res.status(201).json({
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      phonenumber: user.phonenumber,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error signing up', error: error.message });
  }
};



// Login
export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body; 
    // "identifier" can be email, phone, or username

    // Search for user by email, phone, or username
    const user = await User.findOne({
      $or: [
        { email: identifier },
        { phone: identifier },
        { username: identifier }
      ]
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid login credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid login credentials' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      username: user.username,
      role: user.role,
      token: generateToken(user._id, user.role)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};
