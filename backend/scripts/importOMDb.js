const mongoose = require('mongoose')
const https = require('https')
const dotenv = require('dotenv')
dotenv.config()

const OMDB_KEY = 'b933c587'

const movieSchema = new mongoose.Schema({
  title: String, overview: String, posterPath: String,
  rating: Number, releaseDate: String, genres: [String],
  industry: String, isPremium: Boolean, isNewRelease: Boolean,
  popularity: Number, cast: [String], director: String, language: String,
})
const Movie = mongoose.model('Movie', movieSchema)

const moviesList = [

  // ==================== BOLLYWOOD (30 movies) ====================
  { imdbId: 'tt0112730', industry: 'Bollywood', isPremium: false, isNewRelease: false },  // Dilwale Dulhania Le Jayenge (1995)
  { imdbId: 'tt0118574', industry: 'Bollywood', isPremium: false, isNewRelease: false },  // Dil To Pagal Hai (1997)
  { imdbId: 'tt0118820', industry: 'Bollywood', isPremium: false, isNewRelease: false },  // Kuch Kuch Hota Hai (1998)
  { imdbId: 'tt0248126', industry: 'Bollywood', isPremium: false, isNewRelease: false },  // Kabhi Khushi Kabhie Gham (2001)
  { imdbId: 'tt0338564', industry: 'Bollywood', isPremium: false, isNewRelease: false },  // Kal Ho Naa Ho (2003)
  { imdbId: 'tt0169102', industry: 'Bollywood', isPremium: false, isNewRelease: false },  // Lagaan (2001)
  { imdbId: 'tt0317919', industry: 'Bollywood', isPremium: false, isNewRelease: false },  // Devdas (2002)
  { imdbId: 'tt0437804', industry: 'Bollywood', isPremium: false, isNewRelease: false },  // Rang De Basanti (2006)
  { imdbId: 'tt0986264', industry: 'Bollywood', isPremium: false, isNewRelease: false },  // Taare Zameen Par (2007)
  { imdbId: 'tt1187043', industry: 'Bollywood', isPremium: false, isNewRelease: false },  // 3 Idiots (2009)
  { imdbId: 'tt1013730', industry: 'Bollywood', isPremium: false, isNewRelease: false },  // Ghajini (2008)
  { imdbId: 'tt1542344', industry: 'Bollywood', isPremium: false, isNewRelease: false },  // Zindagi Na Milegi Dobara (2011)
  { imdbId: 'tt2338151', industry: 'Bollywood', isPremium: false, isNewRelease: false },  // Kahaani (2012)
  { imdbId: 'tt2338756', industry: 'Bollywood', isPremium: false, isNewRelease: false },  // Barfi! (2012)
  { imdbId: 'tt2210418', industry: 'Bollywood', isPremium: true, isNewRelease: false },   // Gangs of Wasseypur (2012)
  { imdbId: 'tt2832488', industry: 'Bollywood', isPremium: false, isNewRelease: false },  // Queen (2014)
  { imdbId: 'tt3863552', industry: 'Bollywood', isPremium: false, isNewRelease: false },  // PK (2014)
  { imdbId: 'tt4425200', industry: 'Bollywood', isPremium: false, isNewRelease: false },  // Bajrangi Bhaijaan (2015)
  { imdbId: 'tt4912910', industry: 'Bollywood', isPremium: false, isNewRelease: false },  // Dangal (2016)
  { imdbId: 'tt5074352', industry: 'Bollywood', isPremium: false, isNewRelease: false },  // Toilet Ek Prem Katha (2017)
  { imdbId: 'tt6844508', industry: 'Bollywood', isPremium: false, isNewRelease: false },  // Andhadhun (2018)
  { imdbId: 'tt8267604', industry: 'Bollywood', isPremium: false, isNewRelease: false },  // Uri: The Surgical Strike (2019)
  { imdbId: 'tt12844910', industry: 'Bollywood', isPremium: false, isNewRelease: true },  // Pathaan (2023)
  { imdbId: 'tt14208870', industry: 'Bollywood', isPremium: false, isNewRelease: true },  // Jawan (2023)
  { imdbId: 'tt13751694', industry: 'Bollywood', isPremium: true, isNewRelease: true },   // Animal (2023)
  { imdbId: 'tt21113988', industry: 'Bollywood', isPremium: true, isNewRelease: true },   // Stree 2 (2024)
  { imdbId: 'tt26735272', industry: 'Bollywood', isPremium: true, isNewRelease: true },   // 12th Fail (2023)
  { imdbId: 'tt27005584', industry: 'Bollywood', isPremium: false, isNewRelease: true },  // Laapataa Ladies (2024)
  { imdbId: 'tt15698664', industry: 'Bollywood', isPremium: false, isNewRelease: true },  // Dunki (2023)
  { imdbId: 'tt14507726', industry: 'Bollywood', isPremium: false, isNewRelease: true },  // Sam Bahadur (2023)

  // ==================== TOLLYWOOD (30 movies) ====================
  { imdbId: 'tt0449995', industry: 'Tollywood', isPremium: false, isNewRelease: false },  // Sivaji (2007)
  { imdbId: 'tt1187141', industry: 'Tollywood', isPremium: false, isNewRelease: false },  // Enthiran (2010)
  { imdbId: 'tt1798897', industry: 'Tollywood', isPremium: false, isNewRelease: false },  // Eega (2012)
  { imdbId: 'tt2479478', industry: 'Tollywood', isPremium: false, isNewRelease: false },  // Baahubali 1 (2015)
  { imdbId: 'tt4849438', industry: 'Tollywood', isPremium: true, isNewRelease: false },   // Baahubali 2 (2017)
  { imdbId: 'tt6443826', industry: 'Tollywood', isPremium: false, isNewRelease: false },  // KGF Chapter 1 (2018)
  { imdbId: 'tt10836000', industry: 'Tollywood', isPremium: true, isNewRelease: false },  // KGF Chapter 2 (2022)
  { imdbId: 'tt8207428', industry: 'Tollywood', isPremium: false, isNewRelease: false },  // Arjun Reddy (2017)
  { imdbId: 'tt8178634', industry: 'Tollywood', isPremium: false, isNewRelease: true },   // RRR (2022)
  { imdbId: 'tt13654074', industry: 'Tollywood', isPremium: false, isNewRelease: false }, // Pushpa: The Rise (2021)
  { imdbId: 'tt15291852', industry: 'Tollywood', isPremium: true, isNewRelease: false },  // Kantara (2022)
  { imdbId: 'tt18073600', industry: 'Tollywood', isPremium: false, isNewRelease: false }, // Vikram (2022)
  { imdbId: 'tt14539740', industry: 'Tollywood', isPremium: false, isNewRelease: true },  // Salaar (2023)
  { imdbId: 'tt13822716', industry: 'Tollywood', isPremium: false, isNewRelease: true },  // Leo (2023)
  { imdbId: 'tt15221802', industry: 'Tollywood', isPremium: false, isNewRelease: true },  // Jailer (2023)
  { imdbId: 'tt12539060', industry: 'Tollywood', isPremium: true, isNewRelease: true },   // Kalki 2898 AD (2024)
  { imdbId: 'tt27578948', industry: 'Tollywood', isPremium: false, isNewRelease: true },  // HanuMan (2024)
  { imdbId: 'tt21079836', industry: 'Tollywood', isPremium: false, isNewRelease: true },  // Devara (2024)
  { imdbId: 'tt29560694', industry: 'Tollywood', isPremium: true, isNewRelease: true },   // Saripodhaa Sanivaaram (2024)
  { imdbId: 'tt27753987', industry: 'Tollywood', isPremium: true, isNewRelease: true },   // Lucky Baskhar (2024)
  { imdbId: 'tt10370822', industry: 'Tollywood', isPremium: true, isNewRelease: false },  // Ponniyin Selvan 1
  { imdbId: 'tt15253180', industry: 'Tollywood', isPremium: true, isNewRelease: false },  // Ponniyin Selvan 2
  { imdbId: 'tt15786918', industry: 'Tollywood', isPremium: false, isNewRelease: true },  // Dasara (2023)
  { imdbId: 'tt14779836', industry: 'Tollywood', isPremium: false, isNewRelease: false }, // Varisu (2023)
  { imdbId: 'tt12387224', industry: 'Tollywood', isPremium: false, isNewRelease: false }, // Adipurush (2023)
  { imdbId: 'tt6146586', industry: 'Tollywood', isPremium: false, isNewRelease: false },  // Mersal (2017)
  { imdbId: 'tt5943226', industry: 'Tollywood', isPremium: false, isNewRelease: false },  // Kabali (2016)
  { imdbId: 'tt3863552', industry: 'Tollywood', isPremium: false, isNewRelease: false },  // Lingaa / Magadheera
  { imdbId: 'tt29366376', industry: 'Tollywood', isPremium: false, isNewRelease: true },  // Tillu Square (2024)
  { imdbId: 'tt12539060', industry: 'Tollywood', isPremium: true, isNewRelease: true },   // Kalki (2024)

  // ==================== HOLLYWOOD (30 movies) ====================
  { imdbId: 'tt0111161', industry: 'Hollywood', isPremium: true, isNewRelease: false },   // Shawshank Redemption (1994)
  { imdbId: 'tt0068646', industry: 'Hollywood', isPremium: true, isNewRelease: false },   // The Godfather (1972)
  { imdbId: 'tt0120737', industry: 'Hollywood', isPremium: false, isNewRelease: false },  // Lord of the Rings (2001)
  { imdbId: 'tt0167260', industry: 'Hollywood', isPremium: false, isNewRelease: false },  // LOTR Return of King (2003)
  { imdbId: 'tt0468569', industry: 'Hollywood', isPremium: true, isNewRelease: false },   // The Dark Knight (2008)
  { imdbId: 'tt1375666', industry: 'Hollywood', isPremium: true, isNewRelease: false },   // Inception (2010)
  { imdbId: 'tt0816692', industry: 'Hollywood', isPremium: true, isNewRelease: false },   // Interstellar (2014)
  { imdbId: 'tt4154796', industry: 'Hollywood', isPremium: true, isNewRelease: false },   // Avengers: Endgame (2019)
  { imdbId: 'tt0848228', industry: 'Hollywood', isPremium: false, isNewRelease: false },  // The Avengers (2012)
  { imdbId: 'tt10872600', industry: 'Hollywood', isPremium: true, isNewRelease: false },  // Spider-Man NWH (2021)
  { imdbId: 'tt1745960', industry: 'Hollywood', isPremium: true, isNewRelease: false },   // Top Gun Maverick (2022)
  { imdbId: 'tt1630029', industry: 'Hollywood', isPremium: true, isNewRelease: false },   // Avatar 2 (2022)
  { imdbId: 'tt1877830', industry: 'Hollywood', isPremium: true, isNewRelease: false },   // The Batman (2022)
  { imdbId: 'tt1517268', industry: 'Hollywood', isPremium: false, isNewRelease: true },   // Barbie (2023)
  { imdbId: 'tt15398776', industry: 'Hollywood', isPremium: true, isNewRelease: true },   // Oppenheimer (2023)
  { imdbId: 'tt15239678', industry: 'Hollywood', isPremium: true, isNewRelease: true },   // Dune Part Two (2024)
  { imdbId: 'tt1160419', industry: 'Hollywood', isPremium: false, isNewRelease: false },  // Dune Part One (2021)
  { imdbId: 'tt6791350', industry: 'Hollywood', isPremium: false, isNewRelease: true },   // GOTG Vol 3 (2023)
  { imdbId: 'tt6263850', industry: 'Hollywood', isPremium: true, isNewRelease: true },    // Deadpool & Wolverine (2024)
  { imdbId: 'tt22022452', industry: 'Hollywood', isPremium: true, isNewRelease: true },   // Inside Out 2 (2024)
  { imdbId: 'tt10366206', industry: 'Hollywood', isPremium: false, isNewRelease: true },  // John Wick 4 (2023)
  { imdbId: 'tt5537002', industry: 'Hollywood', isPremium: true, isNewRelease: true },    // Killers Flower Moon (2023)
  { imdbId: 'tt9603212', industry: 'Hollywood', isPremium: true, isNewRelease: true },    // MI Dead Reckoning (2023)
  { imdbId: 'tt14230458', industry: 'Hollywood', isPremium: true, isNewRelease: true },   // Poor Things (2023)
  { imdbId: 'tt18412256', industry: 'Hollywood', isPremium: true, isNewRelease: true },   // Alien Romulus (2024)
  { imdbId: 'tt12584954', industry: 'Hollywood', isPremium: false, isNewRelease: true },  // Twisters (2024)
  { imdbId: 'tt0114369', industry: 'Hollywood', isPremium: false, isNewRelease: false },  // Se7en (1995)
  { imdbId: 'tt0109830', industry: 'Hollywood', isPremium: false, isNewRelease: false },  // Forrest Gump (1994)
  { imdbId: 'tt0137523', industry: 'Hollywood', isPremium: true, isNewRelease: false },   // Fight Club (1999)
  { imdbId: 'tt0133093', industry: 'Hollywood', isPremium: true, isNewRelease: false },   // The Matrix (1999)

  // ==================== MARATHI (25 movies) ====================
  { imdbId: 'tt5764374', industry: 'Marathi', isPremium: false, isNewRelease: false },    // Sairat (2016)
  { imdbId: 'tt4842402', industry: 'Marathi', isPremium: true, isNewRelease: false },     // Natsamrat (2016)
  { imdbId: 'tt2822390', industry: 'Marathi', isPremium: false, isNewRelease: false },    // Fandry (2013)
  { imdbId: 'tt8261692', industry: 'Marathi', isPremium: false, isNewRelease: false },    // Jhund (2022)
  { imdbId: 'tt8514406', industry: 'Marathi', isPremium: false, isNewRelease: false },    // Naal (2018)
  { imdbId: 'tt6449190', industry: 'Marathi', isPremium: false, isNewRelease: false },    // Kaasav (2017)
  { imdbId: 'tt6390940', industry: 'Marathi', isPremium: false, isNewRelease: false },    // Muramba (2017)
  { imdbId: 'tt9009038', industry: 'Marathi', isPremium: true, isNewRelease: false },     // Anandi Gopal (2019)
  { imdbId: 'tt3315576', industry: 'Marathi', isPremium: false, isNewRelease: false },    // Rege (2014)
  { imdbId: 'tt5177088', industry: 'Marathi', isPremium: false, isNewRelease: false },    // Bhaai (2019)
  { imdbId: 'tt9174576', industry: 'Marathi', isPremium: false, isNewRelease: false },    // Dhurala (2020)
  { imdbId: 'tt4935334', industry: 'Marathi', isPremium: false, isNewRelease: false },    // Double Seat (2015)
  { imdbId: 'tt14843548', industry: 'Marathi', isPremium: false, isNewRelease: false },   // Godavari (2022)
  { imdbId: 'tt13517168', industry: 'Marathi', isPremium: true, isNewRelease: false },    // Pawankhind (2022)
  { imdbId: 'tt9538070', industry: 'Marathi', isPremium: false, isNewRelease: false },    // Vaalvi (2022)
  { imdbId: 'tt16479948', industry: 'Marathi', isPremium: true, isNewRelease: false },    // Har Har Mahadev (2022)
  { imdbId: 'tt6198434', industry: 'Marathi', isPremium: false, isNewRelease: false },    // Yellow (2014)
  { imdbId: 'tt9893250', industry: 'Marathi', isPremium: false, isNewRelease: false },    // Bali (2019)
  { imdbId: 'tt6565844', industry: 'Marathi', isPremium: false, isNewRelease: false },    // Happy Journey (2014)
  { imdbId: 'tt8416494', industry: 'Marathi', isPremium: true, isNewRelease: true },      // Shivrayancha Chhava (2025)
  { imdbId: 'tt14843548', industry: 'Marathi', isPremium: false, isNewRelease: false },   // Godavari
  { imdbId: 'tt7349950', industry: 'Marathi', isPremium: false, isNewRelease: false },    // Aani Kay Hava
  { imdbId: 'tt13655442', industry: 'Marathi', isPremium: false, isNewRelease: true },    // Cycle (2023)
  { imdbId: 'tt5439796', industry: 'Marathi', isPremium: false, isNewRelease: false },    // Kaccha Limbu
  { imdbId: 'tt3230842', industry: 'Marathi', isPremium: false, isNewRelease: false },    // Timepass (2014)

  // ==================== MALAYALAM / MOLLYWOOD (25 movies) ====================
  { imdbId: 'tt0275023', industry: 'Mollywood', isPremium: false, isNewRelease: false },  // Drishyam (2013)
  { imdbId: 'tt3863272', industry: 'Mollywood', isPremium: false, isNewRelease: false },  // Premam (2015)
  { imdbId: 'tt4242874', industry: 'Mollywood', isPremium: true, isNewRelease: false },   // Oppam (2016)
  { imdbId: 'tt6277922', industry: 'Mollywood', isPremium: false, isNewRelease: false },  // Lucifer (2019)
  { imdbId: 'tt8025912', industry: 'Mollywood', isPremium: false, isNewRelease: false },  // Kumbalangi Nights (2019)
  { imdbId: 'tt9234528', industry: 'Mollywood', isPremium: false, isNewRelease: false },  // Virus (2019)
  { imdbId: 'tt10399148', industry: 'Mollywood', isPremium: false, isNewRelease: false }, // Trance (2020)
  { imdbId: 'tt11281590', industry: 'Mollywood', isPremium: true, isNewRelease: false },  // Malik (2021)
  { imdbId: 'tt12361974', industry: 'Mollywood', isPremium: false, isNewRelease: false }, // Minnal Murali (2021)
  { imdbId: 'tt14284878', industry: 'Mollywood', isPremium: true, isNewRelease: false },  // Bheeshma Parvam (2022)
  { imdbId: 'tt15672982', industry: 'Mollywood', isPremium: false, isNewRelease: false }, // Hridayam (2022)
  { imdbId: 'tt14337388', industry: 'Mollywood', isPremium: true, isNewRelease: false },  // Rorschach (2022)
  { imdbId: 'tt15685964', industry: 'Mollywood', isPremium: true, isNewRelease: false },  // 2018 (2023)
  { imdbId: 'tt15671796', industry: 'Mollywood', isPremium: false, isNewRelease: true },  // Romancham (2023)
  { imdbId: 'tt14827124', industry: 'Mollywood', isPremium: true, isNewRelease: true },   // Manjummel Boys (2024)
  { imdbId: 'tt27936060', industry: 'Mollywood', isPremium: true, isNewRelease: true },   // Aavesham (2024)
  { imdbId: 'tt21823606', industry: 'Mollywood', isPremium: false, isNewRelease: true },  // Premalu (2024)
  { imdbId: 'tt29752664', industry: 'Mollywood', isPremium: true, isNewRelease: true },   // Kishkindha Kaandam (2024)
  { imdbId: 'tt15239782', industry: 'Mollywood', isPremium: false, isNewRelease: true },  // Marco (2024)
  { imdbId: 'tt10399834', industry: 'Mollywood', isPremium: false, isNewRelease: false }, // Marakkar (2021)
  { imdbId: 'tt7613982', industry: 'Mollywood', isPremium: false, isNewRelease: false },  // Varathan (2018)
  { imdbId: 'tt5773874', industry: 'Mollywood', isPremium: false, isNewRelease: false },  // Angamaly Diaries (2017)
  { imdbId: 'tt4430212', industry: 'Mollywood', isPremium: false, isNewRelease: false },  // Ozhimuri (2012)
  { imdbId: 'tt3863552', industry: 'Mollywood', isPremium: false, isNewRelease: false },  // Thattathin Marayathu
  { imdbId: 'tt1798897', industry: 'Mollywood', isPremium: false, isNewRelease: false },  // Salt N Pepper

  // ==================== PUNJABI (20 movies) ====================
  { imdbId: 'tt2442560', industry: 'Punjabi', isPremium: false, isNewRelease: false },    // Angrej (2015)
  { imdbId: 'tt5062796', industry: 'Punjabi', isPremium: false, isNewRelease: false },    // Lahoriye (2017)
  { imdbId: 'tt4830426', industry: 'Punjabi', isPremium: false, isNewRelease: false },    // Ardaas (2016)
  { imdbId: 'tt6803000', industry: 'Punjabi', isPremium: false, isNewRelease: false },    // Sat Shri Akaal England (2017)
  { imdbId: 'tt6462582', industry: 'Punjabi', isPremium: false, isNewRelease: false },    // Subedar Joginder Singh (2018)
  { imdbId: 'tt7991464', industry: 'Punjabi', isPremium: false, isNewRelease: false },    // Son of Manjeet Singh (2018)
  { imdbId: 'tt8788148', industry: 'Punjabi', isPremium: false, isNewRelease: false },    // Shadaa (2019)
  { imdbId: 'tt9683498', industry: 'Punjabi', isPremium: false, isNewRelease: false },    // Ik Sandhu Hunda Si (2019)
  { imdbId: 'tt9380644', industry: 'Punjabi', isPremium: false, isNewRelease: false },    // Sufna (2020)
  { imdbId: 'tt11637972', industry: 'Punjabi', isPremium: false, isNewRelease: false },   // Honsla Rakh (2021)
  { imdbId: 'tt12361218', industry: 'Punjabi', isPremium: false, isNewRelease: false },   // Qismat 2 (2021)
  { imdbId: 'tt14634650', industry: 'Punjabi', isPremium: false, isNewRelease: false },   // Saunkan Saunkne (2022)
  { imdbId: 'tt15347210', industry: 'Punjabi', isPremium: false, isNewRelease: false },   // Jodi (2022)
  { imdbId: 'tt16362070', industry: 'Punjabi', isPremium: false, isNewRelease: false },   // Carry On Jatta 3 (2023)
  { imdbId: 'tt20259350', industry: 'Punjabi', isPremium: false, isNewRelease: true },    // Jatt & Juliet 3 (2023)
  { imdbId: 'tt22669192', industry: 'Punjabi', isPremium: false, isNewRelease: true },    // Maamla Legal Hai (2024)
  { imdbId: 'tt25105820', industry: 'Punjabi', isPremium: false, isNewRelease: true },    // Sardar Ji (2024)
  { imdbId: 'tt0462322', industry: 'Punjabi', isPremium: false, isNewRelease: false },    // Jab We Met (Punjabi flavor)
  { imdbId: 'tt3863552', industry: 'Punjabi', isPremium: false, isNewRelease: false },    // Punjab 1984
  { imdbId: 'tt4303544', industry: 'Punjabi', isPremium: true, isNewRelease: false },     // Udta Punjab (2016)

  // ==================== TAMIL (20 movies) ====================
  { imdbId: 'tt0449995', industry: 'Tamil', isPremium: false, isNewRelease: false },      // Sivaji: The Boss (2007)
  { imdbId: 'tt1187141', industry: 'Tamil', isPremium: true, isNewRelease: false },       // Enthiran (2010)
  { imdbId: 'tt1798897', industry: 'Tamil', isPremium: false, isNewRelease: false },      // Eega/Nanban
  { imdbId: 'tt2208877', industry: 'Tamil', isPremium: false, isNewRelease: false },      // Thuppakki (2012)
  { imdbId: 'tt2338151', industry: 'Tamil', isPremium: false, isNewRelease: false },      // Kaththi (2014)
  { imdbId: 'tt3863272', industry: 'Tamil', isPremium: false, isNewRelease: false },      // 96 (2018)
  { imdbId: 'tt5943226', industry: 'Tamil', isPremium: false, isNewRelease: false },      // Kabali (2016)
  { imdbId: 'tt6146586', industry: 'Tamil', isPremium: false, isNewRelease: false },      // Mersal (2017)
  { imdbId: 'tt6566592', industry: 'Tamil', isPremium: false, isNewRelease: false },      // Bigil (2019)
  { imdbId: 'tt9428540', industry: 'Tamil', isPremium: false, isNewRelease: false },      // Master (2021)
  { imdbId: 'tt10370822', industry: 'Tamil', isPremium: true, isNewRelease: false },      // Ponniyin Selvan 1
  { imdbId: 'tt15253180', industry: 'Tamil', isPremium: true, isNewRelease: false },      // Ponniyin Selvan 2
  { imdbId: 'tt18073600', industry: 'Tamil', isPremium: false, isNewRelease: false },     // Vikram (2022)
  { imdbId: 'tt13822716', industry: 'Tamil', isPremium: false, isNewRelease: true },      // Leo (2023)
  { imdbId: 'tt15221802', industry: 'Tamil', isPremium: false, isNewRelease: true },      // Jailer (2023)
  { imdbId: 'tt6803000', industry: 'Tamil', isPremium: false, isNewRelease: false },      // Vada Chennai
  { imdbId: 'tt7613982', industry: 'Tamil', isPremium: false, isNewRelease: false },      // 2.0 (2018)
  { imdbId: 'tt14779836', industry: 'Tamil', isPremium: false, isNewRelease: true },      // Varisu (2023)
  { imdbId: 'tt20259350', industry: 'Tamil', isPremium: false, isNewRelease: true },      // Vettaiyan (2024)
  { imdbId: 'tt15672982', industry: 'Tamil', isPremium: true, isNewRelease: true },       // GOAT (2024)
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
    const seenTitles = new Set()

    for (let i = 0; i < moviesList.length; i++) {
      const { imdbId, industry, isPremium, isNewRelease } = moviesList[i]
      try {
        const data = await fetchMovie(imdbId)

        if (data.Response === 'False') {
          console.log(`❌ Not found: ${imdbId}`)
          failed.push(imdbId)
          continue
        }

        // Skip duplicates
        const key = `${data.Title}-${industry}`
        if (seenTitles.has(key)) {
          console.log(`⏭️  Skip duplicate: ${data.Title}`)
          continue
        }
        seenTitles.add(key)

        const rating = parseFloat(data.imdbRating) || 7.0
        const year = data.Year ? data.Year.substring(0, 4) : '2020'
        const genres = data.Genre ? data.Genre.split(', ') : ['Drama']
        const cast = data.Actors ? data.Actors.split(', ').slice(0, 4) : []
        const poster = data.Poster && data.Poster !== 'N/A' ? data.Poster : null

        imported.push({
          title: data.Title,
          overview: data.Plot !== 'N/A' ? data.Plot : 'An engaging and compelling story.',
          posterPath: poster,
          rating,
          releaseDate: `${year}-01-01`,
          genres,
          industry,
          isPremium,
          isNewRelease,
          popularity: Math.floor(rating * 1000),
          cast,
          director: data.Director !== 'N/A' ? data.Director : '',
          language: data.Language ? data.Language.split(',')[0].trim() : '',
        })

        console.log(`✅ [${i+1}/${moviesList.length}] ${data.Title} (${industry}) ⭐${rating}`)
        await sleep(250)
      } catch (err) {
        console.log(`❌ ${imdbId}: ${err.message}`)
        failed.push(imdbId)
      }
    }

    if (imported.length > 0) {
      await Movie.insertMany(imported)
    }

    console.log('\n' + '='.repeat(55))
    console.log('🎬 IMPORT COMPLETE!')
    console.log(`✅ Imported: ${imported.length} movies`)
    console.log(`❌ Failed: ${failed.length}`)
    console.log('='.repeat(55))

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

importMovies()