const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// In a real application, this would be stored securely in environment variables
const DJ_PASSWORD_HASH = process.env.DJ_PASSWORD_HASH;
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    console.log('Attempting login with password:', password);
    console.log('Stored hash:', DJ_PASSWORD_HASH);

    // Verify password
    const isValid = await bcrypt.compare(password, DJ_PASSWORD_HASH);
    console.log('Password validation result:', isValid);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign({ role: 'dj' }, JWT_SECRET, { expiresIn: '24h' });

    res.status(200).json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 