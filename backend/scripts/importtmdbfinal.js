const mongoose = require('mongoose')
const https = require('https')
const dotenv = require('dotenv')
dotenv.config()

const OMDB_KEY = 'b933c587'

const movieSchema = new mongoose.Schema({
  title: String, overview: String, posterPath: String,
  backdropPath: String, rating: Number, releaseDate: String,
  genres: [String], industry: String, isPremium: Boolean,
  isNewRelease: Boolean, popularity: Number, cast: [String],
  director: String, language: String,
  streamingOn: [String],
})
const Movie = mongoose.model('Movie', movieSchema)

// Streaming platform data for popular movies
const streamingData = {
  // Bollywood
  'Dilwale Dulhania Le Jayenge': ['Netflix', 'JioStar'],
  'Kabhi Khushi Kabhie Gham': ['Netflix', 'JioStar'],
  'Lagaan': ['JioStar', 'MX Player'],
  'Taare Zameen Par': ['Netflix', 'JioStar'],
  '3 Idiots': ['Netflix', 'JioStar'],
  'PK': ['Netflix', 'JioStar'],
  'Dangal': ['Disney+ Hotstar', 'JioStar'],
  'Bajrangi Bhaijaan': ['Netflix', 'JioStar'],
  'Andhadhun': ['Netflix', 'JioStar'],
  'Uri: The Surgical Strike': ['Netflix', 'JioStar'],
  'Pathaan': ['Prime Video', 'JioStar'],
  'Jawan': ['Netflix', 'JioStar'],
  'Animal': ['Netflix', 'JioStar'],
  'Stree 2': ['Prime Video', 'JioStar'],
  '12th Fail': ['Disney+ Hotstar', 'JioStar'],
  'Laapataa Ladies': ['Netflix'],
  'Sam Bahadur': ['Netflix', 'JioStar'],
  'Gadar 2': ['JioStar', 'ZEE5'],
  'Dunki': ['Netflix', 'JioStar'],
  'Tiger 3': ['Prime Video', 'JioStar'],
  'Gangubai Kathiawadi': ['Netflix'],
  'The Kashmir Files': ['ZEE5', 'JioStar'],
  'Brahmastra': ['Disney+ Hotstar'],
  'RRR': ['Netflix', 'ZEE5'],
  'Zindagi Na Milegi Dobara': ['Netflix', 'JioStar'],
  'Queen': ['Netflix', 'JioStar'],
  'Kahaani': ['Netflix', 'JioStar'],
  'Barfi!': ['Netflix', 'JioStar'],
  'Gangs of Wasseypur': ['Netflix', 'JioStar'],
  'Rang De Basanti': ['JioStar', 'MX Player'],

  // Tollywood
  'Baahubali: The Beginning': ['Netflix', 'Prime Video'],
  'Baahubali 2: The Conclusion': ['Netflix', 'Prime Video'],
  'KGF: Chapter 1': ['Prime Video', 'JioStar'],
  'KGF: Chapter 2': ['Prime Video', 'JioStar'],
  'Pushpa: The Rise': ['Prime Video', 'JioStar'],
  'Pushpa 2: The Rule': ['Prime Video'],
  'Kantara': ['Netflix'],
  'Salaar: Part 1': ['Netflix'],
  'Vikram': ['Disney+ Hotstar'],
  'Leo': ['Netflix'],
  'Jailer': ['Netflix'],
  'Kalki 2898 AD': ['Netflix', 'Prime Video'],
  'HanuMan': ['Netflix', 'Prime Video'],
  'Lucky Baskhar': ['Prime Video'],
  'Arjun Reddy': ['Netflix', 'Prime Video'],
  'Ponniyin Selvan: Part 1': ['Disney+ Hotstar', 'JioStar'],
  'Ponniyin Selvan: Part 2': ['Disney+ Hotstar', 'JioStar'],
  'Devara: Part 1': ['Netflix'],
  'Saripodhaa Sanivaaram': ['Netflix'],
  'Dasara': ['Netflix', 'Prime Video'],

  // Hollywood
  'The Shawshank Redemption': ['JioStar', 'MX Player'],
  'The Godfather': ['JioStar', 'Prime Video'],
  'The Dark Knight': ['JioStar', 'ZEE5'],
  'Inception': ['JioStar', 'Netflix'],
  'Interstellar': ['JioStar', 'Prime Video'],
  'Avengers: Endgame': ['Disney+ Hotstar'],
  'Spider-Man: No Way Home': ['Netflix', 'JioStar'],
  'Top Gun: Maverick': ['Netflix', 'JioStar'],
  'Oppenheimer': ['JioStar', 'Prime Video'],
  'Barbie': ['Max', 'JioStar'],
  'Dune: Part Two': ['JioStar', 'Prime Video'],
  'Deadpool & Wolverine': ['Disney+ Hotstar'],
  'Inside Out 2': ['Disney+ Hotstar'],
  'John Wick: Chapter 4': ['Netflix', 'Prime Video'],
  'Avatar: The Way of Water': ['Disney+ Hotstar'],
  'The Batman': ['JioStar', 'ZEE5'],
  'Forrest Gump': ['Netflix', 'JioStar'],
  'The Matrix': ['Netflix', 'JioStar'],
  'Fight Club': ['JioStar', 'Prime Video'],
  'Dune: Part One': ['JioStar', 'Prime Video'],

  // Marathi
  'Sairat': ['Netflix', 'JioStar'],
  'Natsamrat': ['JioStar', 'MX Player'],
  'Fandry': ['JioStar', 'MX Player'],
  'Jhund': ['ZEE5', 'JioStar'],
  'Kaasav': ['JioStar', 'MX Player'],
  'Double Seat': ['JioStar', 'MX Player'],
  'Anandi Gopal': ['JioStar', 'ZEE5'],
  'Pawankhind': ['JioStar', 'ZEE5'],
  'Godavari': ['JioStar', 'MX Player'],
  'Har Har Mahadev': ['ZEE5', 'JioStar'],
  'Vaalvi': ['ZEE5', 'JioStar'],
  'Dhurala': ['JioStar', 'ZEE5'],
  'Muramba': ['JioStar', 'MX Player'],
  'Rege': ['JioStar', 'MX Player'],
  'Naal': ['JioStar', 'MX Player'],

  // Mollywood
  'Drishyam': ['Netflix', 'Prime Video'],
  'Drishyam 2': ['Prime Video', 'JioStar'],
  'Premam': ['Netflix', 'JioStar'],
  'Lucifer': ['Prime Video', 'JioStar'],
  'Minnal Murali': ['Netflix'],
  'Manjummel Boys': ['Prime Video'],
  'Premalu': ['Netflix', 'Prime Video'],
  'Aavesham': ['Netflix'],
  '2018': ['Netflix', 'Prime Video'],
  'Angamaly Diaries': ['Netflix', 'Prime Video'],
  'Kumbalangi Nights': ['Netflix', 'Prime Video'],
  'Malik': ['Prime Video'],
  'Varathan': ['Prime Video', 'JioStar'],
  'Virus': ['Netflix', 'Prime Video'],

  // Punjabi
  'Angrej': ['JioStar', 'MX Player'],
  'Udta Punjab': ['Netflix', 'JioStar'],
  'Ardaas': ['JioStar', 'MX Player'],
  'Lahoriye': ['JioStar', 'MX Player'],
  'Sufna': ['JioStar', 'Prime Video'],
  'Shadaa': ['JioStar', 'MX Player'],
  'Honsla Rakh': ['JioStar', 'Prime Video'],
  'Carry On Jatta 3': ['JioStar', 'Prime Video'],
  'Jatt & Juliet 3': ['JioStar', 'Prime Video'],
  'Saunkan Saunkne': ['JioStar', 'Prime Video'],

  // Tamil
  'Enthiran': ['Netflix', 'JioStar'],
  'Sivaji: The Boss': ['JioStar', 'MX Player'],
  'Mersal': ['Netflix', 'JioStar'],
  '96': ['Netflix', 'Prime Video'],
  'Master': ['Netflix', 'Prime Video'],
  'Bigil': ['Netflix', 'JioStar'],
  'Ponniyin Selvan: Part 2': ['Disney+ Hotstar'],
}

const moviesList = [
  // BOLLYWOOD
  { imdbId: 'tt0112730', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt0248126', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt0169102', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt0986264', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt1187043', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt3863552', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt4912910', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt4425200', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt6844508', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt8267604', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt12844910', industry: 'Bollywood', isPremium: false, isNewRelease: true },
  { imdbId: 'tt14208870', industry: 'Bollywood', isPremium: false, isNewRelease: true },
  { imdbId: 'tt13751694', industry: 'Bollywood', isPremium: true,  isNewRelease: true },
  { imdbId: 'tt21113988', industry: 'Bollywood', isPremium: true,  isNewRelease: true },
  { imdbId: 'tt26735272', industry: 'Bollywood', isPremium: true,  isNewRelease: true },
  { imdbId: 'tt27005584', industry: 'Bollywood', isPremium: false, isNewRelease: true },
  { imdbId: 'tt14507726', industry: 'Bollywood', isPremium: false, isNewRelease: true },
  { imdbId: 'tt15698664', industry: 'Bollywood', isPremium: false, isNewRelease: true },
  { imdbId: 'tt13349806', industry: 'Bollywood', isPremium: false, isNewRelease: true },
  { imdbId: 'tt1542344', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt2832488', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt2338756', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt2210418', industry: 'Bollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt0437804', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt0118820', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt0338564', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt0317919', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt1013730', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt5074352', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt2338151', industry: 'Bollywood', isPremium: false, isNewRelease: false },

  // TOLLYWOOD
  { imdbId: 'tt2479478', industry: 'Tollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt4849438', industry: 'Tollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt6443826', industry: 'Tollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt10836000', industry: 'Tollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt8178634', industry: 'Tollywood', isPremium: false, isNewRelease: true  },
  { imdbId: 'tt13654074', industry: 'Tollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt15291852', industry: 'Tollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt14539740', industry: 'Tollywood', isPremium: false, isNewRelease: true  },
  { imdbId: 'tt18073600', industry: 'Tollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt13822716', industry: 'Tollywood', isPremium: false, isNewRelease: true  },
  { imdbId: 'tt15221802', industry: 'Tollywood', isPremium: false, isNewRelease: true  },
  { imdbId: 'tt12539060', industry: 'Tollywood', isPremium: true,  isNewRelease: true  },
  { imdbId: 'tt27578948', industry: 'Tollywood', isPremium: false, isNewRelease: true  },
  { imdbId: 'tt21079836', industry: 'Tollywood', isPremium: false, isNewRelease: true  },
  { imdbId: 'tt29560694', industry: 'Tollywood', isPremium: true,  isNewRelease: true  },
  { imdbId: 'tt27753987', industry: 'Tollywood', isPremium: true,  isNewRelease: true  },
  { imdbId: 'tt8207428', industry: 'Tollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt10370822', industry: 'Tollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt15253180', industry: 'Tollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt15786918', industry: 'Tollywood', isPremium: false, isNewRelease: true  },

  // HOLLYWOOD
  { imdbId: 'tt0111161', industry: 'Hollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt0068646', industry: 'Hollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt0468569', industry: 'Hollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt1375666', industry: 'Hollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt0816692', industry: 'Hollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt4154796', industry: 'Hollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt10872600', industry: 'Hollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt1745960', industry: 'Hollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt15398776', industry: 'Hollywood', isPremium: true,  isNewRelease: true  },
  { imdbId: 'tt1517268', industry: 'Hollywood', isPremium: false, isNewRelease: true  },
  { imdbId: 'tt15239678', industry: 'Hollywood', isPremium: true,  isNewRelease: true  },
  { imdbId: 'tt6263850', industry: 'Hollywood', isPremium: true,  isNewRelease: true  },
  { imdbId: 'tt22022452', industry: 'Hollywood', isPremium: true,  isNewRelease: true  },
  { imdbId: 'tt10366206', industry: 'Hollywood', isPremium: false, isNewRelease: true  },
  { imdbId: 'tt1630029', industry: 'Hollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt1877830', industry: 'Hollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt0109830', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt0137523', industry: 'Hollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt0133093', industry: 'Hollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt1160419', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt0114369', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt0120737', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt0167260', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt0848228', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt6791350', industry: 'Hollywood', isPremium: false, isNewRelease: true  },

  // MARATHI
  { imdbId: 'tt5764374', industry: 'Marathi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt4842402', industry: 'Marathi', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt2822390', industry: 'Marathi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt8261692', industry: 'Marathi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt8514406', industry: 'Marathi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt6449190', industry: 'Marathi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt4935334', industry: 'Marathi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt9009038', industry: 'Marathi', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt13517168', industry: 'Marathi', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt14843548', industry: 'Marathi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt16479948', industry: 'Marathi', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt9538070', industry: 'Marathi', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt9174576', industry: 'Marathi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt6390940', industry: 'Marathi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt3315576', industry: 'Marathi', isPremium: false, isNewRelease: false },

  // MOLLYWOOD
  { imdbId: 'tt0275023', industry: 'Mollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt3863272', industry: 'Mollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt6277922', industry: 'Mollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt8025912', industry: 'Mollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt12361974', industry: 'Mollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt14827124', industry: 'Mollywood', isPremium: true,  isNewRelease: true  },
  { imdbId: 'tt21823606', industry: 'Mollywood', isPremium: false, isNewRelease: true  },
  { imdbId: 'tt27936060', industry: 'Mollywood', isPremium: true,  isNewRelease: true  },
  { imdbId: 'tt15685964', industry: 'Mollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt5773874', industry: 'Mollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt11281590', industry: 'Mollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt7613982', industry: 'Mollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt9234528', industry: 'Mollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt15672982', industry: 'Mollywood', isPremium: false, isNewRelease: false },

  // PUNJABI
  { imdbId: 'tt2442560', industry: 'Punjabi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt4303544', industry: 'Punjabi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt4830426', industry: 'Punjabi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt5062796', industry: 'Punjabi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt9380644', industry: 'Punjabi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt8788148', industry: 'Punjabi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt11637972', industry: 'Punjabi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt16362070', industry: 'Punjabi', isPremium: false, isNewRelease: true  },
  { imdbId: 'tt20259350', industry: 'Punjabi', isPremium: false, isNewRelease: true  },
  { imdbId: 'tt14634650', industry: 'Punjabi', isPremium: false, isNewRelease: false },

  // TAMIL
  { imdbId: 'tt1187141', industry: 'Tamil', isPremium: false, isNewRelease: false },
  { imdbId: 'tt0449995', industry: 'Tamil', isPremium: false, isNewRelease: false },
  { imdbId: 'tt6146586', industry: 'Tamil', isPremium: false, isNewRelease: false },
  { imdbId: 'tt3863272', industry: 'Tamil', isPremium: false, isNewRelease: false },
  { imdbId: 'tt9428540', industry: 'Tamil', isPremium: false, isNewRelease: false },
  { imdbId: 'tt6566592', industry: 'Tamil', isPremium: false, isNewRelease: false },
  { imdbId: 'tt10370822', industry: 'Tamil', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt15253180', industry: 'Tamil', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt13822716', industry: 'Tamil', isPremium: false, isNewRelease: true  },
  { imdbId: 'tt15221802', industry: 'Tamil', isPremium: false, isNewRelease: true  },
]

function fetchMovie(imdbId) {
  return new Promise((resolve, reject) => {
    const url = `https://www.omdbapi.com/?i=${imdbId}&apikey=${OMDB_KEY}&plot=full`
    https.get(url, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try { resolve(JSON.parse(data)) }
        catch { reject(new Error('Parse error')) }
      })
    }).on('error', reject)
  })
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function importMovies() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ MongoDB Connected!')
    await Movie.deleteMany({})
    console.log('🗑️  Cleared old movies\n')

    const imported = []
    const failed = []
    const seenIds = new Set()

    for (let i = 0; i < moviesList.length; i++) {
      const { imdbId, industry, isPremium, isNewRelease } = moviesList[i]

      // Skip duplicates
      if (seenIds.has(imdbId + industry)) continue
      seenIds.add(imdbId + industry)

      try {
        const data = await fetchMovie(imdbId)

        if (data.Response === 'False') {
          console.log(`❌ Not found: ${imdbId}`)
          failed.push(imdbId)
          continue
        }

        const rating = parseFloat(data.imdbRating) || 7.0
        const year = data.Year ? parseInt(data.Year.substring(0, 4)) : 2020
        const genres = data.Genre ? data.Genre.split(', ') : ['Drama']
        const cast = data.Actors ? data.Actors.split(', ').slice(0, 4) : []
        const poster = data.Poster && data.Poster !== 'N/A' ? data.Poster : null
        const streaming = streamingData[data.Title] || getDefaultStreaming(industry)

        imported.push({
          title: data.Title,
          overview: data.Plot !== 'N/A' ? data.Plot : 'An engaging and compelling story.',
          posterPath: poster,
          backdropPath: poster,
          rating,
          releaseDate: `${year}-01-01`,
          genres,
          industry,
          isPremium,
          isNewRelease,
          popularity: Math.floor(rating * 1000) + Math.floor(Math.random() * 500),
          cast,
          director: data.Director !== 'N/A' ? data.Director : '',
          language: data.Language ? data.Language.split(',')[0].trim() : '',
          streamingOn: streaming,
        })

        console.log(`✅ [${i+1}/${moviesList.length}] ${data.Title} (${industry}) ⭐${rating} 📺${streaming.join(', ')}`)
        await sleep(200)

      } catch (err) {
        console.log(`❌ ${imdbId}: ${err.message}`)
        failed.push(imdbId)
      }
    }

    if (imported.length > 0) {
      await Movie.insertMany(imported)
    }

    console.log('\n' + '='.repeat(60))
    console.log('🎬 IMPORT COMPLETE!')
    console.log(`✅ Imported: ${imported.length} movies with REAL posters!`)
    console.log(`❌ Failed: ${failed.length}`)
    console.log('='.repeat(60))

    const industries = ['Bollywood', 'Tollywood', 'Hollywood', 'Marathi', 'Mollywood', 'Punjabi', 'Tamil']
    industries.forEach(ind => {
      const count = imported.filter(m => m.industry === ind).length
      console.log(`  🎭 ${ind}: ${count} movies`)
    })

    console.log('\n🚀 Now run: node server_demo.js')
    console.log('🌐 Open: http://localhost:5173\n')

  } catch (err) {
    console.error('❌ Error:', err.message)
  } finally {
    await mongoose.disconnect()
  }
}

function getDefaultStreaming(industry) {
  const defaults = {
    'Bollywood': ['Netflix', 'JioStar'],
    'Tollywood': ['Netflix', 'Prime Video'],
    'Hollywood': ['JioStar', 'Prime Video'],
    'Marathi': ['JioStar', 'ZEE5'],
    'Mollywood': ['Prime Video', 'JioStar'],
    'Punjabi': ['JioStar', 'MX Player'],
    'Tamil': ['Netflix', 'JioStar'],
  }
  return defaults[industry] || ['JioStar']
}

importMovies()