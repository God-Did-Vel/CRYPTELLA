const jwt = require('jsonwebtoken');
const { User } = require('../models');

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Not authorized. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }

  try {
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found.' });
    }

    // Attach user to request (password is excluded by the schema)
    req.user = user.toJSON();
    next();
  } catch (err) {
    next(err);
  }
};

// Use after protect
const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required.' });
  }
  next();
};

// Use after protect: admin accounts manage orders, they don't place them
const customerOnly = (req, res, next) => {
  if (req.user?.role === 'admin') {
    return res.status(403).json({ success: false, message: 'Admin accounts cannot place or hold orders.' });
  }
  next();
};

module.exports = { protect, adminOnly, customerOnly };
