const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const DJ_PASSWORD_HASH = process.env.DJ_PASSWORD_HASH;

router.post('/login', async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    if (!DJ_PASSWORD_HASH) {
      return res.status(500).json({ error: 'DJ password not configured' });
    }

    const isMatch = await bcrypt.compare(password, DJ_PASSWORD_HASH);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ role: 'dj' }, JWT_SECRET, { expiresIn: '24h' });

    res.json({ token });
  } catch (error) {
    console.error('DJ login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;