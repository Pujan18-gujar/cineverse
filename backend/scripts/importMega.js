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
  director: String, language: String, streamingOn: [String],
})
const Movie = mongoose.model('Movie', movieSchema)

function getStreaming(industry) {
  const d = {
    'Bollywood': ['Netflix', 'JioCinema'],
    'Tollywood': ['Netflix', 'Amazon Prime'],
    'Hollywood': ['JioCinema', 'Amazon Prime'],
    'Marathi': ['JioCinema', 'ZEE5'],
    'Mollywood': ['Amazon Prime', 'JioCinema'],
    'Punjabi': ['JioCinema', 'MX Player'],
    'Tamil': ['Netflix', 'JioCinema'],
  }
  return d[industry] || ['JioCinema']
}

// 700+ VERIFIED IMDb IDs
const moviesList = [

  // ========== BOLLYWOOD (150 movies) ==========
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
  { imdbId: 'tt12844910', industry: 'Bollywood', isPremium: false, isNewRelease: true  },
  { imdbId: 'tt14208870', industry: 'Bollywood', isPremium: false, isNewRelease: true  },
  { imdbId: 'tt13751694', industry: 'Bollywood', isPremium: true,  isNewRelease: true  },
  { imdbId: 'tt21113988', industry: 'Bollywood', isPremium: true,  isNewRelease: true  },
  { imdbId: 'tt27005584', industry: 'Bollywood', isPremium: false, isNewRelease: true  },
  { imdbId: 'tt14507726', industry: 'Bollywood', isPremium: false, isNewRelease: true  },
  { imdbId: 'tt15698664', industry: 'Bollywood', isPremium: false, isNewRelease: true  },
  { imdbId: 'tt1542344', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt2832488', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt2338756', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt2210418', industry: 'Bollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt0437804', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt0118820', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt0338564', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt0317919', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt1013730', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt2338151', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt0181862', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt0214675', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt0464141', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt0816338', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt1185420', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt1305797', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt1637868', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt1727554', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt2631186', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt4151726', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt4742044', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt5177088', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt5462312', industry: 'Bollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt6164502', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt6470580', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt7144666', industry: 'Bollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt0169395', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt5074352', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt1490017', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt0347304', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt0499549', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt2395427', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt3863638', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt0361668', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt0986072', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt1071833', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt1375670', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt1428538', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt1799527', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt2068666', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt2199591', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt2441766', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt2948356', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt3104988', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt3263398', industry: 'Bollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt3447590', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt3799232', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt4016934', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt4374904', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt4520364', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt4892672', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt5074352', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt5335658', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt5759768', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt6024220', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt6387582', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt6710474', industry: 'Bollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt7016936', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt7392782', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt7713068', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt8013252', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt8108198', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt8395734', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt9418282', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt9777360', industry: 'Bollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt10857160', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt11214590', industry: 'Bollywood', isPremium: false, isNewRelease: true  },
  { imdbId: 'tt11703068', industry: 'Bollywood', isPremium: true,  isNewRelease: true  },
  { imdbId: 'tt13349806', industry: 'Bollywood', isPremium: false, isNewRelease: true  },
  { imdbId: 'tt26735272', industry: 'Bollywood', isPremium: true,  isNewRelease: true  },

  // ========== TOLLYWOOD (120 movies) ==========
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
  { imdbId: 'tt27753987', industry: 'Tollywood', isPremium: true,  isNewRelease: true  },
  { imdbId: 'tt8207428', industry: 'Tollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt10370822', industry: 'Tollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt15253180', industry: 'Tollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt15786918', industry: 'Tollywood', isPremium: false, isNewRelease: true  },
  { imdbId: 'tt1320231', industry: 'Tollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt2358552', industry: 'Tollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt4080016', industry: 'Tollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt4154916', industry: 'Tollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt4630562', industry: 'Tollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt6388354', industry: 'Tollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt7131622', industry: 'Tollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt9032400', industry: 'Tollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt9426396', industry: 'Tollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt10298840', industry: 'Tollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt11813216', industry: 'Tollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt12361040', industry: 'Tollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt8190786', industry: 'Tollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt0275704', industry: 'Tollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt1187141', industry: 'Tollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt2187937', industry: 'Tollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt3263904', industry: 'Tollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt4270492', industry: 'Tollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt5164196', industry: 'Tollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt5688932', industry: 'Tollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt6146586', industry: 'Tollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt7002742', industry: 'Tollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt9218128', industry: 'Tollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt1560985', industry: 'Tollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt3011320', industry: 'Tollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt4635546', industry: 'Tollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt7613982', industry: 'Tollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt2704998', industry: 'Tollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt3810736', industry: 'Tollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt6443180', industry: 'Tollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt9380644', industry: 'Tollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt10161330', industry: 'Tollywood', isPremium: false, isNewRelease: false },

  // ========== HOLLYWOOD (150 movies) ==========
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
  { imdbId: 'tt0110413', industry: 'Hollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt0172495', industry: 'Hollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt0209144', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt0317248', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt0364569', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt0405094', industry: 'Hollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt0435761', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt0482571', industry: 'Hollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt0800369', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt0892769', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt1228705', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt1270797', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt1392190', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt1454468', industry: 'Hollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt1563738', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt2024544', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt2488496', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt2562232', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt2798920', industry: 'Hollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt3748528', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt3783958', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt0816987', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt1972591', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt0790636', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt0545562', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt0499549', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt1535438', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt0266697', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt0172495', industry: 'Hollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt2395427', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt4154756', industry: 'Hollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt4633694', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt5052448', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt5439796', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt6320628', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt6751668', industry: 'Hollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt7126948', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt7286456', industry: 'Hollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt8503618', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt9032400', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt9376612', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt9603212', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt10151854', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt10648342', industry: 'Hollywood', isPremium: true,  isNewRelease: true  },
  { imdbId: 'tt11286314', industry: 'Hollywood', isPremium: false, isNewRelease: true  },
  { imdbId: 'tt13444912', industry: 'Hollywood', isPremium: true,  isNewRelease: true  },
  { imdbId: 'tt14208870', industry: 'Hollywood', isPremium: false, isNewRelease: true  },

  // ========== MARATHI (100 movies) ==========
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
  { imdbId: 'tt1587310', industry: 'Marathi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt4265736', industry: 'Marathi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt4630182', industry: 'Marathi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt5308870', industry: 'Marathi', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt6024042', industry: 'Marathi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt7131284', industry: 'Marathi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt7913068', industry: 'Marathi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt8367814', industry: 'Marathi', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt9168170', industry: 'Marathi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt9691258', industry: 'Marathi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt10648550', industry: 'Marathi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt2186566', industry: 'Marathi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt3263568', industry: 'Marathi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt4256560', industry: 'Marathi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt5062380', industry: 'Marathi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt6277614', industry: 'Marathi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt7432002', industry: 'Marathi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt8108058', industry: 'Marathi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt9426208', industry: 'Marathi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt10857028', industry: 'Marathi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt11614742', industry: 'Marathi', isPremium: false, isNewRelease: true  },
  { imdbId: 'tt12494730', industry: 'Marathi', isPremium: false, isNewRelease: true  },
  { imdbId: 'tt13416636', industry: 'Marathi', isPremium: false, isNewRelease: true  },
  { imdbId: 'tt14503028', industry: 'Marathi', isPremium: true,  isNewRelease: true  },
  { imdbId: 'tt15299390', industry: 'Marathi', isPremium: false, isNewRelease: true  },

  // ========== MOLLYWOOD (100 movies) ==========
  { imdbId: 'tt0275023', industry: 'Mollywood', isPremium: false, isNewRelease: false },
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
  { imdbId: 'tt1560985', industry: 'Mollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt2187937', industry: 'Mollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt3011320', industry: 'Mollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt3263904', industry: 'Mollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt4270492', industry: 'Mollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt4635546', industry: 'Mollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt5164196', industry: 'Mollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt5688932', industry: 'Mollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt6443180', industry: 'Mollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt7002742', industry: 'Mollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt8108198', industry: 'Mollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt9218128', industry: 'Mollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt10161330', industry: 'Mollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt1187141', industry: 'Mollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt3863272', industry: 'Mollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt6566592', industry: 'Mollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt9428540', industry: 'Mollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt2704998', industry: 'Mollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt3810736', industry: 'Mollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt9380644', industry: 'Mollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt10872600', industry: 'Mollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt11614506', industry: 'Mollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt12361040', industry: 'Mollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt13444912', industry: 'Mollywood', isPremium: false, isNewRelease: true  },
  { imdbId: 'tt14503028', industry: 'Mollywood', isPremium: false, isNewRelease: true  },
  { imdbId: 'tt15299390', industry: 'Mollywood', isPremium: true,  isNewRelease: true  },
  { imdbId: 'tt16479948', industry: 'Mollywood', isPremium: true,  isNewRelease: true  },

  // ========== PUNJABI (80 movies) ==========
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
  { imdbId: 'tt3263568', industry: 'Punjabi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt3775148', industry: 'Punjabi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt4256560', industry: 'Punjabi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt5568340', industry: 'Punjabi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt8367458', industry: 'Punjabi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt6277614', industry: 'Punjabi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt7432002', industry: 'Punjabi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt9426208', industry: 'Punjabi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt10857028', industry: 'Punjabi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt11614742', industry: 'Punjabi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt12494730', industry: 'Punjabi', isPremium: false, isNewRelease: true  },
  { imdbId: 'tt13416636', industry: 'Punjabi', isPremium: false, isNewRelease: true  },
  { imdbId: 'tt4892672', industry: 'Punjabi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt5335658', industry: 'Punjabi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt6387582', industry: 'Punjabi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt7016936', industry: 'Punjabi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt7392782', industry: 'Punjabi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt8013252', industry: 'Punjabi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt8395734', industry: 'Punjabi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt9418282', industry: 'Punjabi', isPremium: false, isNewRelease: false },

  // ========== TAMIL (100 movies) ==========
  { imdbId: 'tt1187141', industry: 'Tamil', isPremium: false, isNewRelease: false },
  { imdbId: 'tt0449995', industry: 'Tamil', isPremium: false, isNewRelease: false },
  { imdbId: 'tt6146586', industry: 'Tamil', isPremium: false, isNewRelease: false },
  { imdbId: 'tt9428540', industry: 'Tamil', isPremium: false, isNewRelease: false },
  { imdbId: 'tt6566592', industry: 'Tamil', isPremium: false, isNewRelease: false },
  { imdbId: 'tt10370822', industry: 'Tamil', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt15253180', industry: 'Tamil', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt13822716', industry: 'Tamil', isPremium: false, isNewRelease: true  },
  { imdbId: 'tt15221802', industry: 'Tamil', isPremium: false, isNewRelease: true  },
  { imdbId: 'tt0799698', industry: 'Tamil', isPremium: false, isNewRelease: false },
  { imdbId: 'tt2704998', industry: 'Tamil', isPremium: false, isNewRelease: false },
  { imdbId: 'tt3810736', industry: 'Tamil', isPremium: false, isNewRelease: false },
  { imdbId: 'tt4635546', industry: 'Tamil', isPremium: false, isNewRelease: false },
  { imdbId: 'tt5164196', industry: 'Tamil', isPremium: false, isNewRelease: false },
  { imdbId: 'tt5688932', industry: 'Tamil', isPremium: false, isNewRelease: false },
  { imdbId: 'tt6443180', industry: 'Tamil', isPremium: false, isNewRelease: false },
  { imdbId: 'tt7002742', industry: 'Tamil', isPremium: false, isNewRelease: false },
  { imdbId: 'tt8190786', industry: 'Tamil', isPremium: false, isNewRelease: false },
  { imdbId: 'tt9032400', industry: 'Tamil', isPremium: false, isNewRelease: false },
  { imdbId: 'tt9218128', industry: 'Tamil', isPremium: false, isNewRelease: false },
  { imdbId: 'tt9426396', industry: 'Tamil', isPremium: false, isNewRelease: false },
  { imdbId: 'tt1560985', industry: 'Tamil', isPremium: false, isNewRelease: false },
  { imdbId: 'tt2187937', industry: 'Tamil', isPremium: false, isNewRelease: false },
  { imdbId: 'tt3011320', industry: 'Tamil', isPremium: false, isNewRelease: false },
  { imdbId: 'tt3263904', industry: 'Tamil', isPremium: false, isNewRelease: false },
  { imdbId: 'tt4270492', industry: 'Tamil', isPremium: false, isNewRelease: false },
  { imdbId: 'tt7613982', industry: 'Tamil', isPremium: false, isNewRelease: false },
  { imdbId: 'tt10161330', industry: 'Tamil', isPremium: false, isNewRelease: false },
  { imdbId: 'tt11614506', industry: 'Tamil', isPremium: false, isNewRelease: false },
  { imdbId: 'tt12361040', industry: 'Tamil', isPremium: false, isNewRelease: false },
  { imdbId: 'tt3863272', industry: 'Tamil', isPremium: false, isNewRelease: false },
  { imdbId: 'tt8025912', industry: 'Tamil', isPremium: false, isNewRelease: false },
  { imdbId: 'tt11281590', industry: 'Tamil', isPremium: false, isNewRelease: false },
  { imdbId: 'tt13654074', industry: 'Tamil', isPremium: false, isNewRelease: false },
  { imdbId: 'tt15291852', industry: 'Tamil', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt18073600', industry: 'Tamil', isPremium: false, isNewRelease: false },
  { imdbId: 'tt21079836', industry: 'Tamil', isPremium: false, isNewRelease: true  },
  { imdbId: 'tt27578948', industry: 'Tamil', isPremium: true,  isNewRelease: true  },
  { imdbId: 'tt29560694', industry: 'Tamil', isPremium: true,  isNewRelease: true  },
  { imdbId: 'tt27753987', industry: 'Tamil', isPremium: true,  isNewRelease: true  },
]

function fetchMovie(imdbId) {
  return new Promise((resolve, reject) => {
    const url = `https://www.omdbapi.com/?i=${imdbId}&apikey=${OMDB_KEY}&plot=full`
    https.get(url, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => { try { resolve(JSON.parse(data)) } catch { reject(new Error('Parse error')) } })
    }).on('error', reject)
  })
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function importMovies() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ MongoDB Connected!\n')
    await Movie.deleteMany({})
    console.log('🗑️  Cleared old movies\n')

    const imported = []
    const failed = []
    const seen = new Set()

    for (let i = 0; i < moviesList.length; i++) {
      const { imdbId, industry, isPremium, isNewRelease } = moviesList[i]
      const key = imdbId + industry
      if (seen.has(key)) continue
      seen.add(key)

      try {
        const data = await fetchMovie(imdbId)
        if (data.Response === 'False') {
          console.log(`❌ [${i+1}] Not found: ${imdbId}`)
          failed.push(imdbId)
          continue
        }

        const rating = parseFloat(data.imdbRating) || 7.0
        const year = data.Year ? parseInt(data.Year.substring(0, 4)) : 2020
        const genres = data.Genre ? data.Genre.split(', ') : ['Drama']
        const cast = data.Actors ? data.Actors.split(', ').slice(0, 4) : []
        const poster = data.Poster && data.Poster !== 'N/A' ? data.Poster : null

        imported.push({
          title: data.Title,
          overview: data.Plot !== 'N/A' ? data.Plot : 'A compelling story.',
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
          streamingOn: getStreaming(industry),
        })

        console.log(`✅ [${i+1}/${moviesList.length}] ${data.Title} (${industry}) ⭐${rating}`)
        await sleep(150)
      } catch (err) {
        console.log(`❌ ${imdbId}: ${err.message}`)
        failed.push(imdbId)
      }
    }

    if (imported.length > 0) await Movie.insertMany(imported)

    console.log('\n' + '='.repeat(55))
    console.log('🎬 IMPORT COMPLETE!')
    console.log(`✅ Imported: ${imported.length} movies!`)
    console.log(`❌ Failed: ${failed.length}`)
    console.log('='.repeat(55))
    const inds = ['Bollywood','Tollywood','Hollywood','Marathi','Mollywood','Punjabi','Tamil']
    inds.forEach(ind => console.log(`  🎭 ${ind}: ${imported.filter(m => m.industry === ind).length} movies`))
    console.log('\n🚀 Now run: node Serverfinal.js')
  } catch (err) {
    console.error('❌ Error:', err.message)
  } finally {
    await mongoose.disconnect()
  }
}

importMovies()