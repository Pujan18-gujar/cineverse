const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema(
  {
    tmdbId: { type: Number, unique: true, required: true },
    title: { type: String, required: true, trim: true },
    originalTitle: { type: String, default: '' },
    overview: { type: String, default: '' },
    posterPath: { type: String, default: '' },
    backdropPath: { type: String, default: '' },
    releaseDate: { type: Date },
    genres: [{ type: String }],
    rating: { type: Number, default: 0, min: 0, max: 10 },
    popularity: { type: Number, default: 0 },
    language: {
      type: String,
      enum: ['en', 'hi', 'te', 'mr', 'other'],
      default: 'en',
    },
    industry: {
      type: String,
      enum: ['Hollywood', 'Bollywood', 'Tollywood', 'Marathi', 'Other'],
      default: 'Hollywood',
    },
    isPremium: { type: Boolean, default: false },
    isNewRelease: { type: Boolean, default: false },
    trailer: { type: String, default: '' },
    cast: [{ name: String, character: String, profilePath: String }],
  },
  { timestamps: true }
)

movieSchema.index({ title: 'text', overview: 'text', originalTitle: 'text' })
movieSchema.index({ industry: 1, popularity: -1 })

module.exports = mongoose.model('Movie', movieSchema)