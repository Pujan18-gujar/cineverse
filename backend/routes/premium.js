const express = require('express')
const User = require('../models/User')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

const PLANS = {
  monthly: { price: 149, days: 30,  features: ['Ad-free', 'HD Quality', 'All Industries'] },
  yearly:  { price: 999, days: 365, features: ['Ad-free', '4K Quality', 'All Industries', 'Early Access'] },
}

// GET /api/premium/plans
router.get('/plans', (req, res) => res.json(PLANS))

// POST /api/premium/subscribe
router.post('/subscribe', protect, async (req, res) => {
  try {
    const { plan } = req.body
    if (!PLANS[plan])
      return res.status(400).json({ message: 'Invalid plan. Choose monthly or yearly.' })

    await User.findByIdAndUpdate(req.user._id, { isPremium: true, role: 'premium' })

    const { days } = PLANS[plan]
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + days)

    res.json({
      message: `Welcome to Cineverse Premium! Your ${plan} plan is now active.`,
      endDate,
      plan,
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message })
  }
})

// POST /api/premium/upgrade (alias)
router.post('/upgrade', protect, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { isPremium: true, role: 'premium' })
    res.json({ success: true, message: 'Welcome to Cineverse Premium!' })
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message })
  }
})

// GET /api/premium/status
router.get('/status', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    res.json({ isPremium: user?.isPremium || false })
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message })
  }
})

module.exports = router