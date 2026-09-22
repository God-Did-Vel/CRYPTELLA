const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../models/db');

const router = express.Router();

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// POST /api/auth/register
router.post(
  '/register',
  [
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
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
      if (db.findUserByEmail(email)) {
        return res.status(409).json({ success: false, message: 'Email already registered.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = db.createUser({ firstName, lastName, email, password: hashedPassword });

      const token = generateToken(user.id);

      return res.status(201).json({
        success: true,
        message: 'Account created successfully.',
        token,
        user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email },
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Registration failed.' });
    }
  }
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = db.findUserByEmail(email);
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      const token = generateToken(user.id);

      return res.json({
        success: true,
        message: 'Login successful.',
        token,
        user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email },
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Login failed.' });
    }
  }
);

module.exports = router;
