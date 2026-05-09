const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields are required.' })

    const existing = await User.findOne({ email })
    if (existing)
      return res.status(409).json({ message: 'Email already registered.' })

    const user = await User.create({ name, email, password })
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required.' })

    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid email or password.' })

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message })
  }
})

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    watchlist: req.user.watchlist,
  })
})

module.exports = router