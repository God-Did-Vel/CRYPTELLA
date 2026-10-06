const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { User } = require('../models');

const router = express.Router();

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const publicUser = (user) => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  role: user.role,
});

// POST /api/auth/register
router.post(
  '/register',
  [
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('email').trim().isEmail().withMessage('Valid email is required').toLowerCase(),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }

    const { firstName, lastName, email, password } = req.body;

    try {
      if (await User.exists({ email })) {
        return res.status(409).json({ success: false, message: 'Email already registered.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ firstName, lastName, email, password: hashedPassword });

      return res.status(201).json({
        success: true,
        message: 'Account created successfully.',
        token: generateToken(user.id),
        user: publicUser(user),
      });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(409).json({ success: false, message: 'Email already registered.' });
      }
      console.error('Registration error:', err);
      return res.status(500).json({ success: false, message: 'Registration failed.' });
    }
  }
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').trim().isEmail().withMessage('Valid email is required').toLowerCase(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email }).select('+password');

      // 400 rather than 401: the frontend treats any 401 as an expired
      // session and hard-redirects, which would swallow this message.
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ success: false, message: 'Invalid email or password.' });
      }

      return res.json({
        success: true,
        message: 'Login successful.',
        token: generateToken(user.id),
        user: publicUser(user),
      });
    } catch (err) {
      console.error('Login error:', err);
      return res.status(500).json({ success: false, message: 'Login failed.' });
    }
  }
);

module.exports = router;
