const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

dotenv.config()

const app = express()
app.use(cors({ origin: '*' }))
app.use(express.json())

// ===== SCHEMAS =====
const movieSchema = new mongoose.Schema({
  title: String, overview: String, posterPath: String,
  rating: Number, releaseDate: String, genres: [String],
  industry: String, isPremium: Boolean, isNewRelease: Boolean,
  popularity: Number, cast: [String], director: String,
  language: String, streamingOn: [String],
}, { timestamps: true })

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'user' },
  isPremium: { type: Boolean, default: false },
}, { timestamps: true })

const Movie = mongoose.model('Movie', movieSchema)
const User  = mongoose.model('User', userSchema)

// ===== AUTH MIDDLEWARE =====
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'No token' })
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'cineverse_secret')
    next()
  } catch {
    res.status(401).json({ message: 'Invalid token' })
  }
}

// ===== MOVIE ROUTES =====
app.get('/api/movies', async (req, res) => {
  try {
    const { industry, genre, search, isPremium, isNewRelease, page = 1, limit = 32 } = req.query
    const filter = {}
    if (industry)    filter.industry    = industry
    if (genre)       filter.genres      = { $in: [genre] }
    if (isPremium    !== undefined) filter.isPremium    = isPremium    === 'true'
    if (isNewRelease !== undefined) filter.isNewRelease = isNewRelease === 'true'
    if (search)      filter.title       = { $regex: search, $options: 'i' }
    const movies = await Movie.find(filter).sort({ popularity: -1 }).skip((page - 1) * limit).limit(parseInt(limit))
    const total = await Movie.countDocuments(filter)
    res.json({ movies, total, page: parseInt(page), totalPages: Math.ceil(total / limit) })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

app.get('/api/movies/by-industry', async (req, res) => {
  try {
    const industries = ['Hollywood', 'Bollywood', 'Tollywood', 'Marathi', 'Mollywood', 'Punjabi', 'Tamil']
    const result = {}
    for (const ind of industries) {
      result[ind] = await Movie.find({ industry: ind }).sort({ popularity: -1 }).limit(32)
    }
    res.json(result)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// ✅ FIXED: Trending — highest rated movies
app.get('/api/movies/trending', async (req, res) => {
  try {
    const movies = await Movie.find({}).sort({ rating: -1, popularity: -1 }).limit(10)
    res.json(movies)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// ✅ FIXED: New releases
app.get('/api/movies/new-releases', async (req, res) => {
  try {
    // Try isNewRelease first, fallback to recent popular movies
    let movies = await Movie.find({ isNewRelease: true }).sort({ popularity: -1 }).limit(20)
    if (movies.length < 5) {
      movies = await Movie.find({}).sort({ popularity: -1 }).skip(10).limit(20)
    }
    res.json(movies)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

app.get('/api/movies/premium', async (req, res) => {
  try {
    const movies = await Movie.find({ isPremium: true }).sort({ popularity: -1 }).limit(20)
    res.json(movies)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

app.get('/api/movies/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id)
    if (!movie) return res.status(404).json({ message: 'Movie not found' })
    res.json(movie)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

app.post('/api/movies/:id/watchlist', authMiddleware, (req, res) => {
  res.json({ success: true })
})

// ===== AUTH ROUTES =====
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' })
    const exists = await User.findOne({ email })
    if (exists) return res.status(400).json({ message: 'Email already exists' })
    const hashed = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, password: hashed })
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'cineverse_secret', { expiresIn: '7d' })
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, isPremium: user.isPremium, token })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: 'Invalid email or password' })
    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(400).json({ message: 'Invalid email or password' })
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'cineverse_secret', { expiresIn: '7d' })
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, isPremium: user.isPremium, token })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// ===== PREMIUM ROUTES =====
app.get('/api/premium/plans', (req, res) => {
  res.json({
    monthly: { price: 149, days: 30,  features: ['Ad-free', 'HD Quality', 'All Industries'] },
    yearly:  { price: 999, days: 365, features: ['Ad-free', '4K Quality', 'All Industries', 'Early Access'] },
  })
})

// ✅ FIXED: subscribe route — updates user isPremium
app.post('/api/premium/subscribe', authMiddleware, async (req, res) => {
  try {
    const { plan } = req.body
    if (!['monthly', 'yearly'].includes(plan))
      return res.status(400).json({ message: 'Invalid plan' })

    await User.findByIdAndUpdate(req.user.id, { isPremium: true, role: 'premium' })

    const days = plan === 'yearly' ? 365 : 30
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + days)

    res.json({
      success: true,
      message: `Welcome to Cineverse Premium! Your ${plan} plan is now active.`,
      endDate,
      plan,
    })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

app.post('/api/premium/upgrade', authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { isPremium: true, role: 'premium' })
    res.json({ success: true, message: 'Welcome to Cineverse Premium!' })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// ===== START =====
const PORT = process.env.PORT || 5000
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('================================')
    console.log('✅ MongoDB Connected!')
    console.log('================================')
    app.listen(PORT, () => {
      console.log('🚀 CINEVERSE SERVER RUNNING!')
      console.log(`🌐 http://localhost:${PORT}`)
      console.log('================================')
    })
  })
  .catch((err) => {
    console.log('❌ MongoDB Error:', err.message)
    process.exit(1)
  })