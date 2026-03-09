import express   from 'express';
import jwt        from 'jsonwebtoken';

const router = express.Router();

// POST /auth/login
router.post('/login', (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }

  // Check against env password
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Incorrect password' });
  }

  // Generate token — valid for 8 hours
  const token = jwt.sign(
    { role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.json({ token });
});

export default router;
