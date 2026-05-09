const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const movieSchema = new mongoose.Schema({
  title: String, industry: String, genres: [String],
  rating: Number, popularity: Number,
})
const Movie = mongoose.model('Movie', movieSchema)

// Known correct title → industry mappings
const titleFixes = {
  // BOLLYWOOD
  'Andhadhun': 'Bollywood',
  'Dangal': 'Bollywood',
  '3 Idiots': 'Bollywood',
  'PK': 'Bollywood',
  'Dil Chahta Hai': 'Bollywood',
  'Lagaan': 'Bollywood',
  'Gangs of Wasseypur': 'Bollywood',
  'Gangs of Wasseypur - Part 2': 'Bollywood',
  'Taare Zameen Par': 'Bollywood',
  'Queen': 'Bollywood',
  'Zindagi Na Milegi Dobara': 'Bollywood',
  'Mughal-E-Azam': 'Bollywood',
  'Sholay': 'Bollywood',
  'Dilwale Dulhania Le Jayenge': 'Bollywood',
  'Kabhi Khushi Kabhie Gham...': 'Bollywood',
  'Kal Ho Naa Ho': 'Bollywood',
  'Dil To Pagal Hai': 'Bollywood',
  'Kuch Kuch Hota Hai': 'Bollywood',
  'Devdas': 'Bollywood',
  'Black': 'Bollywood',
  'Rang De Basanti': 'Bollywood',
  'Chak De! India': 'Bollywood',
  'A Wednesday': 'Bollywood',
  'Dev.D': 'Bollywood',
  'Udaan': 'Bollywood',
  'Lootera': 'Bollywood',
  'Masaan': 'Bollywood',
  'Tumbbad': 'Bollywood',
  'Article 15': 'Bollywood',
  'Andaz Apna Apna': 'Bollywood',
  'Hera Pheri': 'Bollywood',
  'Dhamaal': 'Bollywood',

  // HOLLYWOOD
  'The Shawshank Redemption': 'Hollywood',
  'The Godfather': 'Hollywood',
  'The Dark Knight': 'Hollywood',
  'Inception': 'Hollywood',
  'Interstellar': 'Hollywood',
  'Avengers: Endgame': 'Hollywood',
  'Spider-Man: No Way Home': 'Hollywood',
  'Top Gun: Maverick': 'Hollywood',
  'Avatar: The Way of Water': 'Hollywood',
  'Barbie': 'Hollywood',
  'Oppenheimer': 'Hollywood',
  'Guardians of the Galaxy Vol. 3': 'Hollywood',
  'Avatar': 'Hollywood',
  'The Avengers': 'Hollywood',
  'Guardians of the Galaxy Vol. 2': 'Hollywood',
  'Black Panther': 'Hollywood',
  'Thor: Ragnarok': 'Hollywood',
  'Forrest Gump': 'Hollywood',
  'Fight Club': 'Hollywood',
  'The Matrix': 'Hollywood',
  'Dune': 'Hollywood',
  'Se7en': 'Hollywood',
  'The Lord of the Rings: The Fellowship of the Ring': 'Hollywood',
  'The Lord of the Rings: The Return of the King': 'Hollywood',
  'Toy Story 3': 'Hollywood',
  'WALL·E': 'Hollywood',
  'Up': 'Hollywood',
  'Finding Nemo': 'Hollywood',
  'The Prestige': 'Hollywood',
  'Schindler\'s List': 'Hollywood',
  'Parasite': 'Hollywood',
  'Whiplash': 'Hollywood',
  'The Grand Budapest Hotel': 'Hollywood',
  'Mad Max: Fury Road': 'Hollywood',
  'La La Land': 'Hollywood',
  'Gravity': 'Hollywood',
  'The Martian': 'Hollywood',
  'Doctor Strange in the Multiverse of Madness': 'Hollywood',
  'Thor: Love and Thunder': 'Hollywood',
  'Black Panther: Wakanda Forever': 'Hollywood',
  'Ant-Man and the Wasp: Quantumania': 'Hollywood',
  'The Flash': 'Hollywood',
  'Aquaman and the Lost Kingdom': 'Hollywood',
  'Zack Snyder\'s Justice League': 'Hollywood',
  'Lethal Weapon': 'Hollywood',
  'Sully': 'Hollywood',
  'Loki': 'Hollywood',
  'Billions': 'Hollywood',
  'Glorious Purpose': 'Hollywood',

  // TOLLYWOOD (Telugu)
  'Baahubali: The Beginning': 'Tollywood',
  'Baahubali 2: The Conclusion': 'Tollywood',
  'RRR': 'Tollywood',
  'Pushpa: The Rise - Part 1': 'Tollywood',
  'KGF: Chapter 1': 'Tollywood',
  'KGF: Chapter 2': 'Tollywood',
  'Arjun Reddy': 'Tollywood',
  'Maharshi': 'Tollywood',
  'Saaho': 'Tollywood',
  'Ala Vaikunthapurramuloo': 'Tollywood',
  'Vakeel Saab': 'Tollywood',
  'Krack': 'Tollywood',
  'Uppena': 'Tollywood',
  'Shyam Singha Roy': 'Tollywood',
  'Radhe Shyam': 'Tollywood',
  'Bheemla Nayak': 'Tollywood',
  'Acharya': 'Tollywood',

  // MOLLYWOOD (Malayalam)
  'Drishyam': 'Mollywood',
  'Premam': 'Mollywood',
  'Bangalore Days': 'Mollywood',
  'Charlie': 'Mollywood',
  'Kumbalangi Nights': 'Mollywood',
  'Jallikattu': 'Mollywood',
  'The Great Indian Kitchen': 'Mollywood',
  'Joji': 'Mollywood',
  'Minnal Murali': 'Mollywood',
  '2018': 'Mollywood',
  'Romancham': 'Mollywood',
  'Manjummel Boys': 'Mollywood',
  'Aavesham': 'Mollywood',
  'The Man Who Didn\'t Want to Die': 'Mollywood',

  // MARATHI
  'Sairat': 'Marathi',
  'Natsamrat': 'Marathi',
  'Court': 'Marathi',
  'Fandry': 'Marathi',
  'Katyar Kaljat Ghusali': 'Marathi',
  'Ventilator': 'Marathi',
  'Muramba': 'Marathi',
  'Andhaadhun': 'Marathi',

  // TAMIL
  'Vikram': 'Tamil',
  'Master': 'Tamil',
  'Soorarai Pottru': 'Tamil',
  'Karnan': 'Tamil',
  'Jai Bhim': 'Tamil',
  'Beast': 'Tamil',
  'Varisu': 'Tamil',
  'Thunivu': 'Tamil',
  'Ponniyin Selvan: I': 'Tamil',
  'Leo': 'Tamil',
  'Jailer': 'Tamil',
  '96': 'Tamil',

  // PUNJABI
  'Angrej': 'Punjabi',
  'Qismat': 'Punjabi',
  'Lahoriye': 'Punjabi',
  'Sat Shri Akaal England': 'Punjabi',
  'Carry On Jatta': 'Punjabi',
  'Shadaa': 'Punjabi',
  'Jatt & Juliet': 'Punjabi',
  'Jatt & Juliet 2': 'Punjabi',
  'Qismat 2': 'Punjabi',
  'Sardaarji': 'Punjabi',
}

async function fixIndustries() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ Connected!\n')

    let fixed = 0
    for (const [title, industry] of Object.entries(titleFixes)) {
      const result = await Movie.updateMany(
        { title: { $regex: new RegExp('^' + title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') } },
        { $set: { industry } }
      )
      if (result.modifiedCount > 0) {
        console.log(`✅ Fixed: "${title}" → ${industry}`)
        fixed += result.modifiedCount
      }
    }

    // Fix obvious wrong assignments: Hollywood shows in other industries
    // Movies with English titles in wrong industries
    const hollywoodKeywords = ['Spider-Man', 'Avengers', 'Batman', 'Superman', 'Iron Man', 
      'Thor', 'Captain', 'Black Panther', 'Doctor Strange', 'Guardians', 'Justice League',
      'Aquaman', 'Flash', 'Loki', 'Billions', 'Sully', 'Lethal Weapon']
    
    for (const kw of hollywoodKeywords) {
      const result = await Movie.updateMany(
        { title: { $regex: kw, $options: 'i' }, industry: { $ne: 'Hollywood' } },
        { $set: { industry: 'Hollywood' } }
      )
      if (result.modifiedCount > 0) {
        console.log(`✅ Moved "${kw}" movies → Hollywood (${result.modifiedCount})`)
        fixed += result.modifiedCount
      }
    }

    console.log(`\n🎬 Total fixed: ${fixed} movies`)

    // Show final count
    const industries = ['Hollywood', 'Bollywood', 'Tollywood', 'Marathi', 'Mollywood', 'Punjabi', 'Tamil']
    console.log('\n📊 Final counts:')
    for (const ind of industries) {
      const count = await Movie.countDocuments({ industry: ind })
      console.log(`  🎭 ${ind}: ${count} movies`)
    }

    console.log('\n✅ Done! Restart server: node serverfinal.js')
  } catch (err) {
    console.error('❌ Error:', err.message)
  } finally {
    await mongoose.disconnect()
  }
}

fixIndustries()