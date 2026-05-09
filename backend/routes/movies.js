const express = require('express')
const Movie = require('../models/Movie')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

// GET /api/movies
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const skip = (page - 1) * limit
    let filter = {}
    if (req.query.genre) filter.genres = req.query.genre
    if (req.query.industry) filter.industry = req.query.industry
    if (req.query.search) filter.title = { $regex: req.query.search, $options: 'i' }

    const movies = await Movie.find(filter).sort({ popularity: -1 }).skip(skip).limit(limit).select('-cast')
    const total = await Movie.countDocuments(filter)
    res.json({ movies, page, totalPages: Math.ceil(total / limit), total })
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message })
  }
})

// GET /api/movies/by-industry
router.get('/by-industry', async (req, res) => {
  try {
    const industries = ['Hollywood', 'Bollywood', 'Tollywood', 'Marathi']
    const result = {}
    await Promise.all(
      industries.map(async (ind) => {
        result[ind] = await Movie.find({ industry: ind })
          .sort({ popularity: -1 })
          .limit(8)
          .select('-cast -overview')
      })
    )
    res.json(result)
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message })
  }
})

// GET /api/movies/new-releases - FIXED: use isNewRelease flag
router.get('/new-releases', async (req, res) => {
  try {
    let filter = { isNewRelease: true }
    if (req.query.industry) filter.industry = req.query.industry
    const movies = await Movie.find(filter).sort({ popularity: -1 }).limit(12)
    res.json(movies)
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message })
  }
})

// GET /api/movies/trending
router.get('/trending', async (req, res) => {
  try {
    let filter = {}
    if (req.query.industry) filter.industry = req.query.industry
    const movies = await Movie.find(filter).sort({ rating: -1, popularity: -1 }).limit(10)
    res.json(movies)
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message })
  }
})

// GET /api/movies/:id
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id)
    if (!movie) return res.status(404).json({ message: 'Movie not found.' })
    if (movie.isPremium && !req.headers.authorization) {
      return res.json({ ...movie.toObject(), trailer: null, isPremiumLocked: true })
    }
    res.json(movie)
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message })
  }
})

// POST /api/movies/:id/watchlist
router.post('/:id/watchlist', protect, async (req, res) => {
  try {
    const user = req.user
    const movieId = req.params.id
    if (user.watchlist.includes(movieId)) {
      user.watchlist = user.watchlist.filter((id) => id.toString() !== movieId)
      await user.save()
      return res.json({ message: 'Removed from watchlist', watchlist: user.watchlist })
    }
    user.watchlist.push(movieId)
    await user.save()
    res.json({ message: 'Added to watchlist', watchlist: user.watchlist })
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message })
  }
})

module.exports = router