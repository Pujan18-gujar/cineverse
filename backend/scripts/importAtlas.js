const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

// Cineverse Movie Schema
const movieSchema = new mongoose.Schema({
  title: String,
  overview: String,
  posterPath: String,
  backdropPath: String,
  rating: Number,
  releaseDate: String,
  genres: [String],
  industry: String,
  isPremium: Boolean,
  isNewRelease: Boolean,
  popularity: Number,
  cast: [String],
  director: String,
  language: String,
})
const Movie = mongoose.model('Movie', movieSchema)

// Determine industry based on language/country
function getIndustry(movie) {
  const lang = (movie.languages || []).join(' ').toLowerCase()
  const country = (movie.countries || []).join(' ').toLowerCase()
  const title = (movie.title || '').toLowerCase()

  if (lang.includes('telugu') || lang.includes('kannada')) return 'Tollywood'
  if (lang.includes('hindi') || country.includes('india')) return 'Bollywood'
  if (lang.includes('marathi')) return 'Marathi'
  return 'Hollywood'
}

async function importFromAtlas() {
  try {
    // Connect to cineverse database
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected to MongoDB!')

    // Connect to sample_mflix database (same cluster, different DB)
    const mflixUri = process.env.MONGO_URI.replace('/cineverse', '/sample_mflix')
    const mflixConn = await mongoose.createConnection(mflixUri)
    console.log('Connected to sample_mflix!')

    // Get movies from sample_mflix
    const mflixMovies = mflixConn.collection('movies')
    const movies = await mflixMovies.find({
      poster: { $exists: true },
      title: { $exists: true },
      imdb: { $exists: true }
    }).limit(500).toArray()

    console.log(`Found ${movies.length} movies in sample_mflix`)

    // Clear existing movies
    await Movie.deleteMany({})
    console.log('Cleared existing movies')

    // Convert and save
    const converted = movies.map((m, i) => ({
      title: m.title || 'Unknown',
      overview: m.fullplot || m.plot || '',
      posterPath: m.poster || '',
      backdropPath: m.poster || '',
      rating: m.imdb?.rating || Math.random() * 3 + 6,
      releaseDate: m.year ? `${m.year}-01-01` : '2000-01-01',
      genres: m.genres || ['Drama'],
      industry: getIndustry(m),
      isPremium: i % 3 === 0,
      isNewRelease: m.year >= 2020,
      popularity: m.imdb?.votes || 1000,
      cast: (m.cast || []).slice(0, 5),
      director: (m.directors || [])[0] || '',
      language: (m.languages || [])[0] || 'English',
    }))

    await Movie.insertMany(converted)
    console.log(`\n✅ Successfully imported ${converted.length} movies!`)

    // Show breakdown
    const industries = ['Hollywood', 'Bollywood', 'Tollywood', 'Marathi']
    for (const ind of industries) {
      const count = converted.filter(m => m.industry === ind).length
      console.log(`  ${ind}: ${count} movies`)
    }

    await mflixConn.close()
    await mongoose.disconnect()
    console.log('\n🎬 Done! Restart your server and refresh browser!')

  } catch (err) {
    console.error('Error:', err.message)
    
    // If sample_mflix not available, use manual data
    console.log('\nSample_mflix not available. Adding manual movies...')
    await addManualMovies()
  }
}

async function addManualMovies() {
  const manualMovies = [
    { title: 'RRR', overview: 'A fictional story about two legendary revolutionaries and their journey far away from home.', posterPath: 'https://image.tmdb.org/t/p/w500/nEufeZlyAOLqO6larqByFAgHcAz.jpg', rating: 8.0, releaseDate: '2022-03-25', genres: ['Action', 'Drama'], industry: 'Tollywood', isPremium: false, isNewRelease: true, popularity: 9000 },
    { title: 'KGF Chapter 2', overview: 'Rocky\'s bloodthirsty past catches up with him, as he faces threats from Adheera and others.', posterPath: 'https://image.tmdb.org/t/p/w500/4ZFkOHMHcuaryRPsHmIHuD3oaTs.jpg', rating: 8.4, releaseDate: '2022-04-14', genres: ['Action', 'Drama'], industry: 'Tollywood', isPremium: true, isNewRelease: false, popularity: 8500 },
    { title: 'Pushpa: The Rise', overview: 'A laborer rises through the ranks of a red sandalwood smuggling syndicate.', posterPath: 'https://image.tmdb.org/t/p/w500/krlFHAvCJdxAGpWFWmuLOEQpXkJ.jpg', rating: 7.6, releaseDate: '2021-12-17', genres: ['Action', 'Crime'], industry: 'Tollywood', isPremium: false, isNewRelease: false, popularity: 8000 },
    { title: 'Kantara', overview: 'A rebellious man clashes with a forest officer in a land dispute, as a mystic ritual unfolds.', posterPath: 'https://image.tmdb.org/t/p/w500/mf7QH2EgtEEXwzpbzCIOUrHe0Fo.jpg', rating: 9.0, releaseDate: '2022-09-30', genres: ['Drama', 'Mystery'], industry: 'Tollywood', isPremium: true, isNewRelease: false, popularity: 9500 },
    { title: 'Salaar', overview: 'A violent man is torn between keeping a promise to his friend and following his true nature.', posterPath: 'https://image.tmdb.org/t/p/w500/lrFOSQrOFSMnJANLbWRnmomAHlq.jpg', rating: 7.5, releaseDate: '2023-12-22', genres: ['Action'], industry: 'Tollywood', isPremium: false, isNewRelease: true, popularity: 7500 },
    { title: 'Pathaan', overview: 'An exiled spy returns to take on a rogue agent and a vengeful mercenary.', posterPath: 'https://image.tmdb.org/t/p/w500/oB3KJBNVK3peFxPPGKj1VbDXPIp.jpg', rating: 7.5, releaseDate: '2023-01-25', genres: ['Action', 'Thriller'], industry: 'Bollywood', isPremium: false, isNewRelease: true, popularity: 8000 },
    { title: 'Jawan', overview: 'A man is driven by a personal vendetta to rectify the wrongs in society.', posterPath: 'https://image.tmdb.org/t/p/w500/lHn5oYJIMJHETeEMLFrZFJGNO7r.jpg', rating: 7.2, releaseDate: '2023-09-07', genres: ['Action', 'Drama'], industry: 'Bollywood', isPremium: false, isNewRelease: true, popularity: 8200 },
    { title: 'Animal', overview: 'A son grows up to be a fierce and fearless man devoted to his father.', posterPath: 'https://image.tmdb.org/t/p/w500/nD3IKlDQFG4bBBPFRLJxTCMXzEe.jpg', rating: 7.8, releaseDate: '2023-12-01', genres: ['Action', 'Crime'], industry: 'Bollywood', isPremium: true, isNewRelease: true, popularity: 8700 },
    { title: 'Brahmastra Part One: Shiva', overview: 'A young man discovers he has a unique connection with fire and the ancient Brahmastra weapon.', posterPath: 'https://image.tmdb.org/t/p/w500/nD7GZnQE3LIOKR8XcevQoiWDKi0.jpg', rating: 6.0, releaseDate: '2022-09-09', genres: ['Fantasy', 'Action'], industry: 'Bollywood', isPremium: false, isNewRelease: false, popularity: 7000 },
    { title: 'Tu Jhoothi Main Makkaar', overview: 'A couple who meet for the purpose of staging a breakup find themselves falling for each other.', posterPath: 'https://image.tmdb.org/t/p/w500/zVMyvOurGPLlDMGJHPGdGDGvDSF.jpg', rating: 7.0, releaseDate: '2023-03-08', genres: ['Romance', 'Comedy'], industry: 'Bollywood', isPremium: false, isNewRelease: true, popularity: 6500 },
    { title: 'Avatar: The Way of Water', overview: 'Jake Sully lives with his newfound family formed on the extrasolar moon Pandora.', posterPath: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg', rating: 7.8, releaseDate: '2022-12-16', genres: ['Sci-Fi', 'Adventure'], industry: 'Hollywood', isPremium: true, isNewRelease: false, popularity: 9000 },
    { title: 'Oppenheimer', overview: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.', posterPath: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', rating: 8.9, releaseDate: '2023-07-21', genres: ['Drama', 'History'], industry: 'Hollywood', isPremium: true, isNewRelease: true, popularity: 9500 },
    { title: 'Top Gun: Maverick', overview: 'After thirty years, Maverick is still pushing the envelope as a top naval aviator.', posterPath: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg', rating: 8.3, releaseDate: '2022-05-27', genres: ['Action', 'Drama'], industry: 'Hollywood', isPremium: true, isNewRelease: false, popularity: 9200 },
    { title: 'Barbie', overview: 'Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land.', posterPath: 'https://image.tmdb.org/t/p/w500/iuFNMS8vlbCPjlAKBbGs8MFKFZA.jpg', rating: 7.0, releaseDate: '2023-07-21', genres: ['Comedy', 'Fantasy'], industry: 'Hollywood', isPremium: false, isNewRelease: true, popularity: 8800 },
    { title: 'The Batman', overview: 'When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate.', posterPath: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg', rating: 7.8, releaseDate: '2022-03-04', genres: ['Action', 'Crime', 'Drama'], industry: 'Hollywood', isPremium: true, isNewRelease: false, popularity: 8600 },
    { title: 'Spider-Man: No Way Home', overview: 'Peter Parker seeks help from Doctor Strange to make the world forget he is Spider-Man.', posterPath: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg', rating: 8.2, releaseDate: '2021-12-17', genres: ['Action', 'Adventure', 'Sci-Fi'], industry: 'Hollywood', isPremium: true, isNewRelease: false, popularity: 9800 },
    { title: 'Sairat', overview: 'Two youngsters fall in love but face opposition from her family due to caste differences.', posterPath: 'https://image.tmdb.org/t/p/w500/sai0rFdSJcYRLzDdoRqtTUgkGO6.jpg', rating: 8.2, releaseDate: '2016-04-29', genres: ['Romance', 'Drama'], industry: 'Marathi', isPremium: false, isNewRelease: false, popularity: 7000 },
    { title: 'Natsamrat', overview: 'A veteran actor decides to retire and divide his property among his children.', posterPath: 'https://image.tmdb.org/t/p/w500/bPstxRAhFM8kHfaHHr6P1mKBtqB.jpg', rating: 8.5, releaseDate: '2016-01-01', genres: ['Drama'], industry: 'Marathi', isPremium: true, isNewRelease: false, popularity: 6500 },
    { title: 'Fandry', overview: 'A young Dalit boy falls for an upper-caste girl and tries to improve his standing.', posterPath: 'https://image.tmdb.org/t/p/w500/kTLTPEPYDL0fHQoQFxPhSQFOOhU.jpg', rating: 8.0, releaseDate: '2013-01-31', genres: ['Drama'], industry: 'Marathi', isPremium: false, isNewRelease: false, popularity: 6000 },
    { title: 'Naal', overview: 'A young boy discovers the truth about his birth and struggles to accept it.', posterPath: 'https://image.tmdb.org/t/p/w500/kTLTPEPYDL0fHQoQFxPhSQFOOhU.jpg', rating: 7.5, releaseDate: '2018-08-31', genres: ['Drama', 'Family'], industry: 'Marathi', isPremium: false, isNewRelease: false, popularity: 5500 },
  ]

  await Movie.deleteMany({})
  await Movie.insertMany(manualMovies)
  console.log(`\n✅ Added ${manualMovies.length} movies manually!`)
  
  const industries = ['Hollywood', 'Bollywood', 'Tollywood', 'Marathi']
  for (const ind of industries) {
    const count = manualMovies.filter(m => m.industry === ind).length
    console.log(`  ${ind}: ${count} movies`)
  }
  
  await mongoose.disconnect()
  console.log('\n🎬 Done! Restart server and refresh browser!')
}

importFromAtlas()