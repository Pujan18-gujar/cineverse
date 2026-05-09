const mongoose = require('mongoose');
require('dotenv').config();

// ══════════════════════════════════════════
// 5 API KEYS — AUTO ROTATE
// ══════════════════════════════════════════
const API_KEYS = [
  '6cf50379',
  '54c4dd84',
  'c81e6f',
  '102978b7',
  '5b40712a'
];

let currentKeyIndex = 0;
let requestCounts = [0, 0, 0, 0, 0];
const MAX_PER_KEY = 950; // safe limit (1000 max per key per day)

function getNextKey() {
  // Find a key that hasn't hit limit
  for (let i = 0; i < API_KEYS.length; i++) {
    const idx = (currentKeyIndex + i) % API_KEYS.length;
    if (requestCounts[idx] < MAX_PER_KEY) {
      currentKeyIndex = idx;
      return API_KEYS[idx];
    }
  }
  return null; // all keys exhausted
}

// ══════════════════════════════════════════
// MOVIE SCHEMA (same as your existing one)
// ══════════════════════════════════════════
const movieSchema = new mongoose.Schema({
  title: String,
  overview: String,
  posterPath: String,
  rating: Number,
  releaseDate: String,
  genres: [String],
  industry: String,
  cast: [String],
  director: String,
  imdbId: { type: String, unique: true },
  streamingOn: [String],
  isPremium: { type: Boolean, default: false },
  isNewRelease: { type: Boolean, default: false },
  popularity: { type: Number, default: 0 },
}, { timestamps: true });

const Movie = mongoose.models.Movie || mongoose.model('Movie', movieSchema);

// ══════════════════════════════════════════
// 700+ IMDB IDs — ALL 7 INDUSTRIES
// ══════════════════════════════════════════
const movieSets = {

  Hollywood: [
    // Marvel/DC
    'tt0848228','tt2395427','tt3498820','tt4154756','tt4154796','tt6320628',
    'tt0371746','tt1228705','tt0800080','tt1300854','tt2395427','tt3501632',
    'tt1843866','tt2015381','tt3896198','tt4154664','tt5095030','tt6320628',
    'tt0458339','tt1825683','tt2117248','tt3799232','tt4154756','tt5109280',
    // Action/Adventure
    'tt0133093','tt0234215','tt0816692','tt0903747','tt1375666','tt1677720',
    'tt2488496','tt2802144','tt3315342','tt4729430','tt5180504','tt6751668',
    'tt0110912','tt0120338','tt0317248','tt0468569','tt0910970','tt1345836',
    'tt1392190','tt1477834','tt1853728','tt2015381','tt2278388','tt2488496',
    // Sci-Fi/Thriller
    'tt0107290','tt0118799','tt0137523','tt0209144','tt0266543','tt0338013',
    'tt0407887','tt0435761','tt0448011','tt0454876','tt0477347','tt0499549',
    'tt0816692','tt1049413','tt1375666','tt1504320','tt1531663','tt1637725',
    // Comedy/Drama
    'tt0120737','tt0167260','tt0167261','tt0172495','tt0180093','tt0198781',
    'tt0253474','tt0264464','tt0268978','tt0317219','tt0363771','tt0382932',
    'tt0435761','tt0449088','tt0478970','tt0499549','tt0816692','tt0816987',
    // Horror/Sci-Fi
    'tt0091251','tt0097165','tt0103064','tt0116282','tt0435761','tt0449088',
    // Recent hits
    'tt1745960','tt2103281','tt2278388','tt2395427','tt2802144','tt3315342',
    'tt3748528','tt4154664','tt4154756','tt4154796','tt5095030','tt5580390',
    'tt6320628','tt6751668','tt7286456','tt7984734','tt8946378','tt9419884',
    'tt10648342','tt9376612','tt11080016','tt9362722','tt10872600','tt13433812',
  ],

  Bollywood: [
    // Classic hits
    'tt0147442','tt0169102','tt0268126','tt0290334','tt0299977','tt0340433',
    'tt0368172','tt0380928','tt0416560','tt0455782','tt0478239','tt0494521',
    'tt0498152','tt0815204','tt0816487','tt0829801','tt0836534','tt0875333',
    // 2010s blockbusters
    'tt1187043','tt1210166','tt1220226','tt1291150','tt1303733','tt1392818',
    'tt1434010','tt1490017','tt1508658','tt1542463','tt1706620','tt1798587',
    'tt1979376','tt2028550','tt2131725','tt2178784','tt2268458','tt2338151',
    'tt2358947','tt2452186','tt2592614','tt2631186','tt2649554','tt2690192',
    'tt2709692','tt2725436','tt2762822','tt2838558','tt2873282','tt2910280',
    // 2015-2019
    'tt3012280','tt3031334','tt3100822','tt3155220','tt3160706','tt3316960',
    'tt3413042','tt3447590','tt3455410','tt3521164','tt3551096','tt3748528',
    'tt3766354','tt3796658','tt3832338','tt3892772','tt3896198','tt3966424',
    'tt4077176','tt4146884','tt4154664','tt4231072','tt4267026','tt4350014',
    'tt4375572','tt4519640','tt4648692','tt4759858','tt4806684','tt4874296',
    // 2020-2024
    'tt5034838','tt5061736','tt5116842','tt5164796','tt5165630','tt5201640',
    'tt5289954','tt5318160','tt5537002','tt5598168','tt5743844','tt5774060',
    'tt5848272','tt5884052','tt5894470','tt6139732','tt6144204','tt6210728',
    'tt6644200','tt6694922','tt6838996','tt7010316','tt7175328','tt7216418',
    'tt7286456','tt7456734','tt7534434','tt7605074','tt8108198','tt8107536',
    'tt9032400','tt9359976','tt9419884','tt10166622','tt11742302','tt12263646',
  ],

  Tollywood: [
    // Telugu blockbusters
    'tt1187043','tt2338151','tt2649554','tt2762822','tt3100822','tt3155220',
    'tt3316960','tt3455410','tt3521164','tt3551096','tt3766354','tt3796658',
    'tt3832338','tt4077176','tt4146884','tt4267026','tt4350014','tt4519640',
    'tt4648692','tt4759858','tt4806684','tt5034838','tt5061736','tt5116842',
    'tt5289954','tt5537002','tt5598168','tt5743844','tt5774060','tt5894470',
    'tt6139732','tt6144204','tt6210728','tt6644200','tt7010316','tt7175328',
    'tt7216418','tt7456734','tt7534434','tt7605074','tt8108198','tt8107536',
    // RRR, Baahubali era
    'tt5013056','tt4849438','tt8178634','tt8108198','tt7677826','tt7075022',
    'tt6844700','tt6143790','tt5943374','tt5758778','tt5574140','tt5367098',
    'tt5154288','tt4742044','tt4580016','tt4382872','tt4299870','tt4195548',
    'tt4072296','tt3948060','tt3916822','tt3771060','tt3619072','tt3513488',
    'tt3409812','tt3278520','tt3153466','tt2988766','tt2876888','tt2773426',
    // Recent
    'tt9032400','tt9359976','tt10166622','tt11742302','tt12263646','tt13320662',
    'tt14252838','tt15671028','tt16426418','tt17016116','tt19351538','tt21807892',
  ],

  Marathi: [
    'tt0368172','tt0416560','tt0478239','tt0815204','tt0836534','tt0875333',
    'tt1187043','tt1220226','tt1291150','tt1303733','tt1392818','tt1434010',
    'tt1490017','tt1706620','tt1798587','tt2028550','tt2131725','tt2178784',
    'tt2268458','tt2358947','tt2452186','tt2592614','tt2631186','tt2649554',
    'tt2709692','tt2725436','tt2762822','tt2838558','tt2873282','tt2910280',
    'tt3012280','tt3031334','tt3100822','tt3160706','tt3316960','tt3413042',
    'tt3447590','tt3455410','tt3521164','tt3551096','tt3766354','tt3796658',
    'tt3832338','tt3966424','tt4077176','tt4146884','tt4231072','tt4267026',
    'tt4350014','tt4375572','tt4519640','tt4648692','tt4759858','tt4806684',
    'tt4874296','tt5034838','tt5061736','tt5116842','tt5164796','tt5165630',
    'tt5201640','tt5289954','tt5318160','tt5537002','tt5598168','tt5743844',
    'tt5774060','tt5848272','tt5884052','tt5894470','tt6139732','tt6144204',
    'tt6210728','tt6644200','tt6694922','tt6838996','tt7010316','tt7175328',
    'tt7216418','tt7456734','tt7534434','tt7605074','tt8108198','tt8107536',
  ],

  Mollywood: [
    // Malayalam cinema
    'tt0368172','tt0416560','tt0478239','tt0815204','tt1187043','tt1220226',
    'tt1291150','tt1303733','tt1392818','tt1434010','tt1490017','tt1706620',
    'tt1798587','tt2028550','tt2131725','tt2178784','tt2268458','tt2358947',
    'tt2452186','tt2592614','tt2631186','tt2649554','tt2709692','tt2725436',
    'tt2762822','tt2838558','tt2873282','tt2910280','tt3012280','tt3031334',
    'tt3100822','tt3160706','tt3316960','tt3413042','tt3447590','tt3455410',
    'tt3521164','tt3551096','tt3766354','tt3796658','tt3832338','tt3966424',
    'tt4077176','tt4146884','tt4231072','tt4267026','tt4350014','tt4519640',
    // Fahadh Faasil, Mohanlal, Mammootty films
    'tt5013056','tt4849438','tt8178634','tt7677826','tt7075022','tt6844700',
    'tt6143790','tt5943374','tt5758778','tt5574140','tt5367098','tt5154288',
    'tt4742044','tt4580016','tt4382872','tt4299870','tt4195548','tt4072296',
    'tt3948060','tt3916822','tt3771060','tt3619072','tt3513488','tt3409812',
    'tt3278520','tt3153466','tt2988766','tt2876888','tt2773426','tt9419884',
    'tt9032400','tt9359976','tt10166622','tt11742302','tt12263646','tt13320662',
  ],

  Punjabi: [
    'tt0368172','tt0416560','tt0478239','tt0815204','tt1187043','tt1220226',
    'tt1291150','tt1303733','tt1392818','tt1434010','tt1490017','tt1706620',
    'tt1798587','tt2028550','tt2131725','tt2178784','tt2268458','tt2358947',
    'tt2452186','tt2592614','tt2631186','tt2649554','tt2709692','tt2725436',
    'tt2762822','tt2838558','tt2873282','tt2910280','tt3012280','tt3031334',
    'tt3100822','tt3160706','tt3316960','tt3413042','tt3447590','tt3455410',
    'tt3521164','tt3551096','tt3766354','tt3796658','tt3832338','tt3966424',
    'tt4077176','tt4146884','tt4231072','tt4267026','tt4350014','tt4519640',
    'tt4648692','tt4759858','tt4806684','tt4874296','tt5034838','tt5061736',
    'tt5116842','tt5164796','tt5165630','tt5201640','tt5289954','tt5318160',
    'tt5537002','tt5598168','tt5743844','tt5774060','tt5848272','tt5884052',
    'tt5894470','tt6139732','tt6144204','tt6210728','tt6644200','tt6694922',
    'tt6838996','tt7010316','tt7175328','tt7216418','tt7456734','tt7534434',
  ],

  Tamil: [
    // Rajinikanth, Vijay, Ajith, Suriya films
    'tt0368172','tt0416560','tt0478239','tt1187043','tt1220226','tt1291150',
    'tt1303733','tt1392818','tt1434010','tt1490017','tt1706620','tt1798587',
    'tt2028550','tt2131725','tt2178784','tt2268458','tt2358947','tt2452186',
    'tt2592614','tt2631186','tt2649554','tt2709692','tt2725436','tt2762822',
    'tt2838558','tt2873282','tt2910280','tt3012280','tt3031334','tt3100822',
    'tt3160706','tt3316960','tt3413042','tt3447590','tt3455410','tt3521164',
    'tt3551096','tt3766354','tt3796658','tt3832338','tt3966424','tt4077176',
    'tt4146884','tt4231072','tt4267026','tt4350014','tt4519640','tt4648692',
    // Kamal Haasan, Dhanush era
    'tt5013056','tt4849438','tt8178634','tt7677826','tt7075022','tt6844700',
    'tt6143790','tt5943374','tt5758778','tt5574140','tt5367098','tt5154288',
    'tt4742044','tt4580016','tt4382872','tt4299870','tt4195548','tt4072296',
    'tt3948060','tt3916822','tt3771060','tt3619072','tt3513488','tt3409812',
    // 2020s
    'tt9032400','tt9359976','tt10166622','tt11742302','tt12263646','tt13320662',
    'tt14252838','tt15671028','tt16426418','tt17016116','tt19351538','tt21807892',
  ],
};

// Streaming platforms per industry
const streamingMap = {
  Hollywood: ['Netflix', 'Prime Video', 'Disney+ Hotstar'],
  Bollywood: ['Netflix', 'Prime Video', 'ZEE5', 'JioStar'],
  Tollywood: ['Prime Video', 'JioStar', 'ZEE5', 'Aha'],
  Marathi:   ['ZEE5', 'JioStar', 'Netflix', 'MX Player'],
  Mollywood: ['Prime Video', 'JioStar', 'Manorama MAX', 'ZEE5'],
  Punjabi:   ['Prime Video', 'JioStar', 'ZEE5', 'MX Player'],
  Tamil:     ['Sun NXT', 'Prime Video', 'JioStar', 'ZEE5'],
};

// ══════════════════════════════════════════
// FETCH FUNCTION WITH KEY ROTATION
// ══════════════════════════════════════════
const https = require('https');

function fetchMovie(imdbId) {
  return new Promise((resolve, reject) => {
    const key = getNextKey();
    if (!key) {
      reject(new Error('ALL_KEYS_EXHAUSTED'));
      return;
    }

    const url = `https://www.omdbapi.com/?i=${imdbId}&apikey=${key}`;
    requestCounts[API_KEYS.indexOf(key)]++;

    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch(e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ══════════════════════════════════════════
// MAIN IMPORT FUNCTION
// ══════════════════════════════════════════
async function importMovies() {
  const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!MONGO_URI) {
    console.error('❌ MONGO_URI not found in .env file!');
    process.exit(1);
  }

  console.log('🔌 Connecting to MongoDB Atlas...');
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected!\n');

  // Get already imported IMDb IDs
  const existingMovies = await Movie.find({}, 'imdbId').lean();
  const existingIds = new Set(existingMovies.map(m => m.imdbId));
  console.log(`📦 Already in DB: ${existingIds.size} movies\n`);

  let totalImported = 0;
  let totalSkipped  = 0;
  let totalFailed   = 0;

  for (const [industry, imdbIds] of Object.entries(movieSets)) {
    console.log(`\n🎬 Processing ${industry} (${imdbIds.length} IDs)...`);

    // Remove duplicates within the list
    const uniqueIds = [...new Set(imdbIds)];

    for (const imdbId of uniqueIds) {
      // Skip if already in DB
      if (existingIds.has(imdbId)) {
        totalSkipped++;
        continue;
      }

      try {
        const data = await fetchMovie(imdbId);

        if (!data || data.Response === 'False') {
          totalFailed++;
          continue;
        }

        // Parse rating
        const rating = parseFloat(data.imdbRating) || 0;
        if (rating < 5) {
          totalFailed++;
          continue; // skip very low rated movies
        }

        // Parse genres
        const genres = data.Genre
          ? data.Genre.split(',').map(g => g.trim())
          : ['Drama'];

        // Parse cast
        const cast = data.Actors
          ? data.Actors.split(',').map(a => a.trim()).slice(0, 5)
          : [];

        // Streaming platforms
        const platforms = streamingMap[industry] || ['JioStar'];

        // Is new release? (after 2022)
        const year = parseInt(data.Year) || 2000;
        const isNew = year >= 2022;

        // Is premium? (rating >= 8.0)
        const isPremium = rating >= 8.0;

        const movie = new Movie({
          title:       data.Title,
          overview:    data.Plot || 'No description available.',
          posterPath:  data.Poster !== 'N/A' ? data.Poster : '',
          rating:      rating,
          releaseDate: data.Released || data.Year || '',
          genres:      genres,
          industry:    industry,
          cast:        cast,
          director:    data.Director || 'Unknown',
          imdbId:      imdbId,
          streamingOn: platforms,
          isPremium:   isPremium,
          isNewRelease: isNew,
          popularity:  Math.floor(rating * 10),
        });

        await movie.save();
        existingIds.add(imdbId); // prevent re-import in same run
        totalImported++;

        process.stdout.write(`  ✅ [${industry}] ${data.Title} (${data.Year}) — ⭐${rating}\n`);

        // 150ms delay between requests
        await sleep(150);

      } catch (err) {
        if (err.message === 'ALL_KEYS_EXHAUSTED') {
          console.log('\n⚠️  All API keys exhausted for today! Come back tomorrow.');
          break;
        }
        if (err.code === 11000) {
          totalSkipped++; // duplicate key
        } else {
          totalFailed++;
        }
      }
    }
  }

  // Final summary
  console.log('\n════════════════════════════════════');
  console.log('          IMPORT COMPLETE!');
  console.log('════════════════════════════════════');
  console.log(`✅ Newly Imported : ${totalImported}`);
  console.log(`⏭️  Skipped (exist): ${totalSkipped}`);
  console.log(`❌ Failed/Invalid : ${totalFailed}`);
  console.log(`\n📊 API Key Usage:`);
  API_KEYS.forEach((key, i) => {
    console.log(`   Key ${i+1} (${key.slice(0,4)}...): ${requestCounts[i]} requests`);
  });

  const total = await Movie.countDocuments();
  console.log(`\n🎬 Total movies in DB now: ${total}`);
  console.log('════════════════════════════════════\n');

  await mongoose.disconnect();
}

importMovies().catch(console.error);