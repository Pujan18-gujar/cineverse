const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

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

const movies = [
  // TOLLYWOOD
  {
    title: 'RRR',
    overview: 'A fictional story about two legendary revolutionaries and their journey far away from home before they began fighting for their country in the 1920s.',
    posterPath: 'https://upload.wikimedia.org/wikipedia/en/d/d9/RRR_Movie_Poster.jpg',
    rating: 8.0, releaseDate: '2022-03-25',
    genres: ['Action', 'Drama'], industry: 'Tollywood',
    isPremium: false, isNewRelease: true, popularity: 9000,
    cast: ['Jr. NTR', 'Ram Charan', 'Alia Bhatt'], director: 'S. S. Rajamouli'
  },
  {
    title: 'KGF Chapter 2',
    overview: 'Rocky\'s bloodthirsty past catches up with him, as he faces threats from Adheera, Ramika Sen, and Inayat Khalil.',
    posterPath: 'https://upload.wikimedia.org/wikipedia/en/3/3e/KGF_Chapter_2_Poster.jpg',
    rating: 8.4, releaseDate: '2022-04-14',
    genres: ['Action', 'Drama'], industry: 'Tollywood',
    isPremium: true, isNewRelease: false, popularity: 8500,
    cast: ['Yash', 'Sanjay Dutt', 'Raveena Tandon'], director: 'Prashanth Neel'
  },
  {
    title: 'Pushpa: The Rise',
    overview: 'A laborer rises through the ranks of a red sandalwood smuggling syndicate.',
    posterPath: 'https://upload.wikimedia.org/wikipedia/en/9/9e/Pushpa-_The_Rise_poster.jpg',
    rating: 7.6, releaseDate: '2021-12-17',
    genres: ['Action', 'Crime'], industry: 'Tollywood',
    isPremium: false, isNewRelease: false, popularity: 8000,
    cast: ['Allu Arjun', 'Fahadh Faasil', 'Rashmika Mandanna'], director: 'Sukumar'
  },
  {
    title: 'Kantara',
    overview: 'A rebellious man clashes with a forest officer in a land dispute in coastal Karnataka, as a mystic ritual becomes the focus of conflict.',
    posterPath: 'https://upload.wikimedia.org/wikipedia/en/3/thirty/Kantara_poster.jpg',
    rating: 9.0, releaseDate: '2022-09-30',
    genres: ['Drama', 'Mystery', 'Thriller'], industry: 'Tollywood',
    isPremium: true, isNewRelease: false, popularity: 9500,
    cast: ['Rishab Shetty', 'Sapthami Gowda'], director: 'Rishab Shetty'
  },
  {
    title: 'Salaar: Part 1 - Ceasefire',
    overview: 'A violent man is torn between keeping a promise to his childhood friend and following his true violent nature.',
    posterPath: 'https://upload.wikimedia.org/wikipedia/en/4/4f/Salaar_Part_1_Ceasefire_poster.jpg',
    rating: 7.5, releaseDate: '2023-12-22',
    genres: ['Action', 'Crime'], industry: 'Tollywood',
    isPremium: false, isNewRelease: true, popularity: 7500,
    cast: ['Prabhas', 'Prithviraj Sukumaran', 'Shruti Haasan'], director: 'Prashanth Neel'
  },
  // BOLLYWOOD
  {
    title: 'Pathaan',
    overview: 'An exiled spy returns to take on a rogue operative who has become a global threat.',
    posterPath: 'https://upload.wikimedia.org/wikipedia/en/8/8d/Pathaan_film_poster.jpg',
    rating: 7.5, releaseDate: '2023-01-25',
    genres: ['Action', 'Thriller'], industry: 'Bollywood',
    isPremium: false, isNewRelease: true, popularity: 8000,
    cast: ['Shah Rukh Khan', 'Deepika Padukone', 'John Abraham'], director: 'Siddharth Anand'
  },
  {
    title: 'Jawan',
    overview: 'A man is driven by a personal vendetta to rectify the wrongs in society, while on the run from a determined police officer.',
    posterPath: 'https://upload.wikimedia.org/wikipedia/en/7/7b/Jawan_film_poster.jpg',
    rating: 7.2, releaseDate: '2023-09-07',
    genres: ['Action', 'Drama'], industry: 'Bollywood',
    isPremium: false, isNewRelease: true, popularity: 8200,
    cast: ['Shah Rukh Khan', 'Nayanthara', 'Vijay Sethupathi'], director: 'Atlee'
  },
  {
    title: 'Animal',
    overview: 'A son grows up to be a fierce and fearless man, deeply devoted to his father.',
    posterPath: 'https://upload.wikimedia.org/wikipedia/en/1/1d/Animal_2023_film_poster.jpg',
    rating: 7.8, releaseDate: '2023-12-01',
    genres: ['Action', 'Crime', 'Drama'], industry: 'Bollywood',
    isPremium: true, isNewRelease: true, popularity: 8700,
    cast: ['Ranbir Kapoor', 'Anil Kapoor', 'Bobby Deol'], director: 'Sandeep Reddy Vanga'
  },
  {
    title: 'Brahmastra Part One: Shiva',
    overview: 'A young man discovers he has a unique connection with fire and the ancient Brahmastra weapon.',
    posterPath: 'https://upload.wikimedia.org/wikipedia/en/8/84/Brahmastra_Part_One_Shiva.jpg',
    rating: 6.0, releaseDate: '2022-09-09',
    genres: ['Fantasy', 'Action'], industry: 'Bollywood',
    isPremium: false, isNewRelease: false, popularity: 7000,
    cast: ['Ranbir Kapoor', 'Alia Bhatt', 'Amitabh Bachchan'], director: 'Ayan Mukerji'
  },
  {
    title: 'Dunki',
    overview: 'A group of friends attempt to illegally immigrate to the UK using a dangerous route called "Donkey Flight".',
    posterPath: 'https://upload.wikimedia.org/wikipedia/en/b/b3/Dunki_film_poster.jpg',
    rating: 7.0, releaseDate: '2023-12-21',
    genres: ['Drama', 'Comedy'], industry: 'Bollywood',
    isPremium: false, isNewRelease: true, popularity: 7800,
    cast: ['Shah Rukh Khan', 'Taapsee Pannu'], director: 'Rajkumar Hirani'
  },
  // HOLLYWOOD
  {
    title: 'Oppenheimer',
    overview: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.',
    posterPath: 'https://upload.wikimedia.org/wikipedia/en/4/4a/Oppenheimer_%28film%29.jpg',
    rating: 8.9, releaseDate: '2023-07-21',
    genres: ['Drama', 'History', 'Thriller'], industry: 'Hollywood',
    isPremium: true, isNewRelease: true, popularity: 9500,
    cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon'], director: 'Christopher Nolan'
  },
  {
    title: 'Top Gun: Maverick',
    overview: 'After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past.',
    posterPath: 'https://upload.wikimedia.org/wikipedia/en/1/13/Top_Gun_Maverick_Poster.jpg',
    rating: 8.3, releaseDate: '2022-05-27',
    genres: ['Action', 'Drama'], industry: 'Hollywood',
    isPremium: true, isNewRelease: false, popularity: 9200,
    cast: ['Tom Cruise', 'Miles Teller', 'Jennifer Connelly'], director: 'Joseph Kosinski'
  },
  {
    title: 'Avatar: The Way of Water',
    overview: 'Jake Sully lives with his newfound family formed on the planet Pandora. When a familiar threat returns to finish what was previously started.',
    posterPath: 'https://upload.wikimedia.org/wikipedia/en/5/55/Avatar_The_Way_of_Water_poster.jpg',
    rating: 7.8, releaseDate: '2022-12-16',
    genres: ['Sci-Fi', 'Adventure', 'Action'], industry: 'Hollywood',
    isPremium: true, isNewRelease: false, popularity: 9000,
    cast: ['Sam Worthington', 'Zoe Saldana', 'Sigourney Weaver'], director: 'James Cameron'
  },
  {
    title: 'Barbie',
    overview: 'Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land.',
    posterPath: 'https://upload.wikimedia.org/wikipedia/en/9/99/Barbie_%28film%29_poster.jpg',
    rating: 7.0, releaseDate: '2023-07-21',
    genres: ['Comedy', 'Fantasy', 'Adventure'], industry: 'Hollywood',
    isPremium: false, isNewRelease: true, popularity: 8800,
    cast: ['Margot Robbie', 'Ryan Gosling', 'America Ferrera'], director: 'Greta Gerwig'
  },
  {
    title: 'Spider-Man: No Way Home',
    overview: 'Peter Parker seeks help from Doctor Strange, causing the multiverse to fracture and unleashing villains from other dimensions.',
    posterPath: 'https://upload.wikimedia.org/wikipedia/en/0/00/Spider-Man_No_Way_Home_official_poster.jpg',
    rating: 8.2, releaseDate: '2021-12-17',
    genres: ['Action', 'Adventure', 'Sci-Fi'], industry: 'Hollywood',
    isPremium: true, isNewRelease: false, popularity: 9800,
    cast: ['Tom Holland', 'Zendaya', 'Benedict Cumberbatch'], director: 'Jon Watts'
  },
  // MARATHI
  {
    title: 'Sairat',
    overview: 'Two youngsters from different castes fall deeply in love, but face violent opposition from her influential family.',
    posterPath: 'https://upload.wikimedia.org/wikipedia/en/c/c3/Sairat_2016_film_poster.jpg',
    rating: 8.2, releaseDate: '2016-04-29',
    genres: ['Romance', 'Drama', 'Tragedy'], industry: 'Marathi',
    isPremium: false, isNewRelease: false, popularity: 7000,
    cast: ['Rinku Rajguru', 'Akash Thosar'], director: 'Nagraj Manjule'
  },
  {
    title: 'Natsamrat',
    overview: 'A veteran Marathi stage actor decides to retire and divide his property among his children, only to face heartbreak.',
    posterPath: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Natsamrat_poster.jpg',
    rating: 8.5, releaseDate: '2016-01-01',
    genres: ['Drama'], industry: 'Marathi',
    isPremium: true, isNewRelease: false, popularity: 6500,
    cast: ['Nana Patekar', 'Medha Manjrekar'], director: 'Mahesh Manjrekar'
  },
  {
    title: 'Fandry',
    overview: 'A young Dalit boy falls for an upper-caste girl and hatches a plan to impress her, while confronting social discrimination.',
    posterPath: 'https://upload.wikimedia.org/wikipedia/en/a/a8/Fandry_film_poster.jpg',
    rating: 8.0, releaseDate: '2013-01-31',
    genres: ['Drama', 'Social'], industry: 'Marathi',
    isPremium: false, isNewRelease: false, popularity: 6000,
    cast: ['Somnath Avghade', 'Rajeshwari Kharat'], director: 'Nagraj Manjule'
  },
  {
    title: 'Jhund',
    overview: 'An aging professor transforms slum kids into a football team, giving them hope and purpose.',
    posterPath: 'https://upload.wikimedia.org/wikipedia/en/6/62/Jhund_film_poster.jpg',
    rating: 8.0, releaseDate: '2022-03-04',
    genres: ['Drama', 'Sports'], industry: 'Marathi',
    isPremium: false, isNewRelease: false, popularity: 6800,
    cast: ['Amitabh Bachchan', 'Rinku Rajguru'], director: 'Nagraj Manjule'
  },
  {
    title: 'Naal',
    overview: 'A young boy discovers the truth about his birth and struggles to come to terms with his identity.',
    posterPath: 'https://upload.wikimedia.org/wikipedia/en/e/e3/Naal_2018_Marathi_film_poster.jpg',
    rating: 7.5, releaseDate: '2018-08-31',
    genres: ['Drama', 'Family'], industry: 'Marathi',
    isPremium: false, isNewRelease: false, popularity: 5500,
    cast: ['Sudhakar Reddy Yakkanti'], director: 'Sudhakar Reddy Yakkanti'
  },
]

async function importMovies() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('MongoDB Connected!')

    await Movie.deleteMany({})
    console.log('Cleared old movies')

    await Movie.insertMany(movies)
    console.log(`\n✅ Successfully imported ${movies.length} movies with posters!\n`)

    const industries = ['Hollywood', 'Bollywood', 'Tollywood', 'Marathi']
    industries.forEach(ind => {
      const count = movies.filter(m => m.industry === ind).length
      console.log(`  🎬 ${ind}: ${count} movies`)
    })

    console.log('\n🚀 Now restart your server!')
    console.log('   node server_demo.js')
    console.log('\n🌐 Then open: http://localhost:5173')

  } catch (err) {
    console.error('Error:', err.message)
  } finally {
    await mongoose.disconnect()
  }
}

importMovies()