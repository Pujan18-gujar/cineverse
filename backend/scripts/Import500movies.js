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

const streamingMap = {
  // BOLLYWOOD
  'tt0112730': ['Netflix', 'JioCinema'], 'tt0248126': ['Netflix', 'JioCinema'],
  'tt0169102': ['JioCinema', 'MX Player'], 'tt0986264': ['Netflix', 'JioCinema'],
  'tt1187043': ['Netflix', 'JioCinema'], 'tt3863552': ['Disney+ Hotstar', 'JioCinema'],
  'tt4912910': ['Amazon Prime', 'JioCinema'], 'tt4425200': ['Netflix', 'JioCinema'],
  'tt6844508': ['Netflix', 'JioCinema'], 'tt8267604': ['Netflix', 'JioCinema'],
  'tt12844910': ['Amazon Prime', 'JioCinema'], 'tt14208870': ['Netflix', 'JioCinema'],
  'tt13751694': ['Netflix'], 'tt21113988': ['Amazon Prime'],
  'tt26735272': ['Netflix'], 'tt27005584': ['Netflix'],
  'tt14507726': ['Disney+ Hotstar'], 'tt15698664': ['Netflix', 'JioCinema'],
  'tt1542344': ['Netflix', 'JioCinema'], 'tt2832488': ['Netflix'],
  'tt2338756': ['ZEE5', 'JioCinema'], 'tt2210418': ['Netflix', 'JioCinema'],
  'tt0437804': ['JioCinema', 'MX Player'], 'tt0118820': ['Netflix', 'JioCinema'],
  'tt0338564': ['Netflix', 'JioCinema'], 'tt0317919': ['JioCinema', 'MX Player'],
  'tt1013730': ['JioCinema', 'MX Player'], 'tt5074352': ['Netflix', 'JioCinema'],
  'tt2338151': ['Netflix', 'JioCinema'], 'tt0181862': ['Netflix', 'JioCinema'],
  'tt0169395': ['JioCinema', 'MX Player'], 'tt0214675': ['JioCinema', 'MX Player'],
  'tt0347304': ['JioCinema', 'MX Player'], 'tt0464141': ['Netflix', 'JioCinema'],
  'tt0816338': ['Netflix', 'JioCinema'], 'tt1185420': ['Netflix', 'JioCinema'],
  'tt1305797': ['Netflix', 'JioCinema'], 'tt1490017': ['JioCinema'],
  'tt1637868': ['Netflix', 'JioCinema'], 'tt1727554': ['Netflix', 'JioCinema'],
  'tt2395427': ['JioCinema'], 'tt2631186': ['Netflix', 'JioCinema'],
  'tt3863638': ['Amazon Prime'], 'tt4151726': ['Netflix'],
  'tt4742044': ['Netflix', 'JioCinema'], 'tt5177088': ['ZEE5'],
  'tt5462312': ['Netflix'], 'tt6164502': ['Amazon Prime'],
  'tt6470580': ['Netflix', 'JioCinema'], 'tt7144666': ['Netflix'],
  // TOLLYWOOD
  'tt2479478': ['Netflix', 'Amazon Prime'], 'tt4849438': ['Netflix', 'Amazon Prime'],
  'tt6443826': ['Amazon Prime', 'JioCinema'], 'tt10836000': ['Amazon Prime', 'JioCinema'],
  'tt8178634': ['Amazon Prime'], 'tt13654074': ['Netflix'],
  'tt15291852': ['Netflix'], 'tt14539740': ['Disney+ Hotstar'],
  'tt18073600': ['Netflix'], 'tt13822716': ['Netflix'],
  'tt15221802': ['Netflix'], 'tt12539060': ['Netflix', 'Amazon Prime'],
  'tt27578948': ['Amazon Prime'], 'tt21079836': ['Netflix'],
  'tt29560694': ['Netflix'], 'tt27753987': ['Netflix'],
  'tt8207428': ['Netflix', 'Amazon Prime'], 'tt10370822': ['Disney+ Hotstar'],
  'tt15253180': ['Disney+ Hotstar'], 'tt15786918': ['Netflix'],
  'tt0275704': ['Netflix', 'Amazon Prime'], 'tt1320231': ['Amazon Prime'],
  'tt2358552': ['Netflix'], 'tt3104988': ['Amazon Prime'],
  'tt3447590': ['Netflix'], 'tt3863272': ['Amazon Prime'],
  'tt4080016': ['Netflix'], 'tt4154916': ['Amazon Prime'],
  'tt4630562': ['Netflix'], 'tt5074352': ['Amazon Prime'],
  'tt6146586': ['Disney+ Hotstar'], 'tt6388354': ['Netflix'],
  'tt7131622': ['Amazon Prime'], 'tt7286456': ['Netflix'],
  'tt8190786': ['Amazon Prime'], 'tt9032400': ['Netflix'],
  'tt9426396': ['Amazon Prime'], 'tt10298840': ['Netflix'],
  'tt11813216': ['Amazon Prime'], 'tt12361040': ['Netflix'],
  // HOLLYWOOD
  'tt0111161': ['JioCinema', 'MX Player'], 'tt0068646': ['Amazon Prime', 'JioCinema'],
  'tt0468569': ['JioCinema', 'ZEE5'], 'tt1375666': ['Netflix', 'JioCinema'],
  'tt0816692': ['Amazon Prime', 'JioCinema'], 'tt4154796': ['Disney+ Hotstar'],
  'tt10872600': ['Netflix', 'JioCinema'], 'tt1745960': ['Netflix', 'JioCinema'],
  'tt15398776': ['Amazon Prime', 'JioCinema'], 'tt1517268': ['Amazon Prime', 'JioCinema'],
  'tt15239678': ['Disney+ Hotstar'], 'tt6263850': ['Disney+ Hotstar'],
  'tt22022452': ['Disney+ Hotstar'], 'tt10366206': ['Netflix', 'Amazon Prime'],
  'tt1630029': ['Disney+ Hotstar'], 'tt1877830': ['JioCinema', 'ZEE5'],
  'tt0109830': ['Netflix', 'JioCinema'], 'tt0137523': ['Amazon Prime', 'JioCinema'],
  'tt0133093': ['Netflix', 'JioCinema'], 'tt1160419': ['Amazon Prime', 'JioCinema'],
  'tt0114369': ['Netflix', 'JioCinema'], 'tt0120737': ['Amazon Prime'],
  'tt0167260': ['Amazon Prime'], 'tt0848228': ['Disney+ Hotstar'],
  'tt6791350': ['Disney+ Hotstar'], 'tt0110413': ['Netflix', 'JioCinema'],
  'tt0172495': ['JioCinema'], 'tt0209144': ['Netflix'],
  'tt0266697': ['JioCinema'], 'tt0317248': ['Netflix'],
  'tt0364569': ['Netflix', 'JioCinema'], 'tt0405094': ['Netflix'],
  'tt0435761': ['Disney+ Hotstar'], 'tt0482571': ['Netflix', 'JioCinema'],
  'tt0499549': ['Disney+ Hotstar'], 'tt0545562': ['Amazon Prime'],
  'tt0790636': ['Netflix'], 'tt0800369': ['Disney+ Hotstar'],
  'tt0816987': ['Amazon Prime'], 'tt0892769': ['Disney+ Hotstar'],
  'tt1228705': ['Disney+ Hotstar'], 'tt1270797': ['Netflix'],
  'tt1392190': ['Netflix', 'Amazon Prime'], 'tt1454468': ['Netflix'],
  'tt1535438': ['Disney+ Hotstar'], 'tt1563738': ['Amazon Prime'],
  'tt1972591': ['Netflix'], 'tt2024544': ['Netflix'],
  'tt2395427': ['Disney+ Hotstar'], 'tt2488496': ['Disney+ Hotstar'],
  'tt2562232': ['Netflix'], 'tt2798920': ['Netflix'],
  'tt3748528': ['Disney+ Hotstar'], 'tt3783958': ['Netflix'],
  // MARATHI
  'tt5764374': ['Netflix', 'MX Player', 'JioCinema'], 'tt4842402': ['Amazon Prime', 'MX Player'],
  'tt2822390': ['Amazon Prime', 'MX Player'], 'tt8261692': ['ZEE5', 'JioCinema'],
  'tt8514406': ['JioCinema', 'MX Player'], 'tt6449190': ['JioCinema', 'ZEE5'],
  'tt4935334': ['JioCinema', 'MX Player'], 'tt9009038': ['JioCinema', 'ZEE5'],
  'tt13517168': ['JioCinema', 'ZEE5'], 'tt14843548': ['JioCinema', 'MX Player'],
  'tt16479948': ['ZEE5', 'JioCinema'], 'tt9538070': ['ZEE5', 'JioCinema'],
  'tt9174576': ['JioCinema', 'MX Player'], 'tt6390940': ['JioCinema', 'MX Player'],
  'tt3315576': ['JioCinema', 'MX Player'], 'tt1587310': ['JioCinema', 'MX Player'],
  'tt2186566': ['JioCinema'], 'tt2879262': ['ZEE5'],
  'tt3315576': ['JioCinema'], 'tt4265736': ['MX Player'],
  'tt4630182': ['JioCinema', 'ZEE5'], 'tt5062380': ['JioCinema'],
  'tt5308870': ['ZEE5', 'JioCinema'], 'tt6024042': ['JioCinema'],
  'tt7131284': ['ZEE5'], 'tt7913068': ['JioCinema'],
  'tt8367814': ['ZEE5', 'JioCinema'], 'tt9168170': ['JioCinema'],
  'tt9691258': ['ZEE5'], 'tt10648550': ['JioCinema'],
  // MOLLYWOOD
  'tt0275023': ['Netflix', 'Amazon Prime'], 'tt3863272': ['Amazon Prime'],
  'tt6277922': ['Amazon Prime', 'JioCinema'], 'tt8025912': ['Amazon Prime'],
  'tt12361974': ['Netflix'], 'tt14827124': ['Amazon Prime'],
  'tt21823606': ['Netflix'], 'tt27936060': ['Netflix'],
  'tt15685964': ['Amazon Prime'], 'tt5773874': ['Netflix', 'Amazon Prime'],
  'tt11281590': ['Amazon Prime'], 'tt7613982': ['Amazon Prime', 'JioCinema'],
  'tt9234528': ['Netflix', 'Amazon Prime'], 'tt15672982': ['Amazon Prime'],
  'tt1187141': ['Netflix', 'Amazon Prime'], 'tt1560985': ['Amazon Prime'],
  'tt2187937': ['Netflix'], 'tt3011320': ['Amazon Prime'],
  'tt3263904': ['Netflix'], 'tt3447590': ['Amazon Prime'],
  'tt4270492': ['Netflix', 'Amazon Prime'], 'tt4635546': ['Amazon Prime'],
  'tt5164196': ['Netflix'], 'tt5688932': ['Amazon Prime'],
  'tt6443180': ['Netflix'], 'tt7002742': ['Amazon Prime'],
  'tt7613982': ['Netflix'], 'tt8108198': ['Amazon Prime'],
  'tt9218128': ['Netflix'], 'tt10161330': ['Amazon Prime'],
  // PUNJABI
  'tt2442560': ['JioCinema', 'MX Player'], 'tt4303544': ['JioCinema', 'MX Player'],
  'tt4830426': ['JioCinema', 'MX Player'], 'tt5062796': ['JioCinema', 'Amazon Prime'],
  'tt9380644': ['JioCinema', 'Amazon Prime'], 'tt8788148': ['JioCinema', 'MX Player'],
  'tt11637972': ['JioCinema', 'Amazon Prime'], 'tt16362070': ['JioCinema', 'Amazon Prime'],
  'tt20259350': ['JioCinema', 'Amazon Prime'], 'tt14634650': ['JioCinema', 'MX Player'],
  'tt1535276': ['JioCinema'], 'tt2442560': ['JioCinema', 'MX Player'],
  'tt3263568': ['JioCinema'], 'tt3775148': ['MX Player'],
  'tt4256560': ['JioCinema'], 'tt5062796': ['Amazon Prime'],
  'tt5568340': ['JioCinema', 'MX Player'], 'tt6277922': ['JioCinema'],
  'tt7286456': ['Amazon Prime'], 'tt8367458': ['JioCinema'],
  // TAMIL
  'tt1187141': ['Netflix', 'JioCinema'], 'tt0449995': ['JioCinema', 'MX Player'],
  'tt6146586': ['Disney+ Hotstar'], 'tt9428540': ['Netflix'],
  'tt6566592': ['Netflix'], 'tt9380644': ['Netflix'],
  'tt10370822': ['Disney+ Hotstar'], 'tt15253180': ['Disney+ Hotstar'],
  'tt13822716': ['Netflix'], 'tt15221802': ['Netflix'],
  'tt0799698': ['JioCinema', 'MX Player'], 'tt1187141': ['Netflix'],
  'tt1560985': ['JioCinema'], 'tt2187937': ['Netflix'],
  'tt2704998': ['Amazon Prime'], 'tt3011320': ['JioCinema'],
  'tt3263904': ['Netflix'], 'tt3810736': ['Amazon Prime'],
  'tt4154796': ['Disney+ Hotstar'], 'tt4635546': ['Netflix'],
  'tt5164196': ['JioCinema'], 'tt5688932': ['Netflix'],
  'tt6443180': ['Disney+ Hotstar'], 'tt7002742': ['JioCinema'],
  'tt7613982': ['Netflix'], 'tt8025912': ['Amazon Prime'],
  'tt8190786': ['Netflix'], 'tt9032400': ['JioCinema'],
  'tt9218128': ['Netflix'], 'tt9426396': ['Amazon Prime'],
}

const moviesList = [
  // ===== BOLLYWOOD (100 movies) =====
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
  { imdbId: 'tt0347304', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt0464141', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt0816338', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt1185420', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt1305797', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt1637868', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt1727554', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt2631186', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt3863638', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt4151726', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt4742044', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt5177088', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt5462312', industry: 'Bollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt6164502', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt6470580', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt7144666', industry: 'Bollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt0169395', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt5074352', industry: 'Bollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt13349806', industry: 'Bollywood', isPremium: false, isNewRelease: true },
  { imdbId: 'tt1490017', industry: 'Bollywood', isPremium: false, isNewRelease: false },

  // ===== TOLLYWOOD (90 movies) =====
  { imdbId: 'tt2479478', industry: 'Tollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt4849438', industry: 'Tollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt6443826', industry: 'Tollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt10836000', industry: 'Tollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt8178634', industry: 'Tollywood', isPremium: false, isNewRelease: true },
  { imdbId: 'tt13654074', industry: 'Tollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt15291852', industry: 'Tollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt14539740', industry: 'Tollywood', isPremium: false, isNewRelease: true },
  { imdbId: 'tt18073600', industry: 'Tollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt13822716', industry: 'Tollywood', isPremium: false, isNewRelease: true },
  { imdbId: 'tt15221802', industry: 'Tollywood', isPremium: false, isNewRelease: true },
  { imdbId: 'tt12539060', industry: 'Tollywood', isPremium: true,  isNewRelease: true },
  { imdbId: 'tt27578948', industry: 'Tollywood', isPremium: false, isNewRelease: true },
  { imdbId: 'tt21079836', industry: 'Tollywood', isPremium: false, isNewRelease: true },
  { imdbId: 'tt29560694', industry: 'Tollywood', isPremium: true,  isNewRelease: true },
  { imdbId: 'tt27753987', industry: 'Tollywood', isPremium: true,  isNewRelease: true },
  { imdbId: 'tt8207428', industry: 'Tollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt10370822', industry: 'Tollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt15253180', industry: 'Tollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt15786918', industry: 'Tollywood', isPremium: false, isNewRelease: true },
  { imdbId: 'tt1320231', industry: 'Tollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt2358552', industry: 'Tollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt3104988', industry: 'Tollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt3447590', industry: 'Tollywood', isPremium: false, isNewRelease: false },
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

  // ===== HOLLYWOOD (100 movies) =====
  { imdbId: 'tt0111161', industry: 'Hollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt0068646', industry: 'Hollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt0468569', industry: 'Hollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt1375666', industry: 'Hollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt0816692', industry: 'Hollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt4154796', industry: 'Hollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt10872600', industry: 'Hollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt1745960', industry: 'Hollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt15398776', industry: 'Hollywood', isPremium: true,  isNewRelease: true },
  { imdbId: 'tt1517268', industry: 'Hollywood', isPremium: false, isNewRelease: true },
  { imdbId: 'tt15239678', industry: 'Hollywood', isPremium: true,  isNewRelease: true },
  { imdbId: 'tt6263850', industry: 'Hollywood', isPremium: true,  isNewRelease: true },
  { imdbId: 'tt22022452', industry: 'Hollywood', isPremium: true,  isNewRelease: true },
  { imdbId: 'tt10366206', industry: 'Hollywood', isPremium: false, isNewRelease: true },
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
  { imdbId: 'tt6791350', industry: 'Hollywood', isPremium: false, isNewRelease: true },
  { imdbId: 'tt0110413', industry: 'Hollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt0172495', industry: 'Hollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt0209144', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt0266697', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt0317248', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt0364569', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt0405094', industry: 'Hollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt0435761', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt0482571', industry: 'Hollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt0499549', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt0545562', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt0790636', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt0800369', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt0816987', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt0892769', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt1228705', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt1270797', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt1392190', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt1454468', industry: 'Hollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt1535438', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt1563738', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt1972591', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt2024544', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt2488496', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt2562232', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt2798920', industry: 'Hollywood', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt3748528', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt3783958', industry: 'Hollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt2395427', industry: 'Hollywood', isPremium: false, isNewRelease: false },

  // ===== MARATHI (60 movies) =====
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
  { imdbId: 'tt2186566', industry: 'Marathi', isPremium: false, isNewRelease: false },
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

  // ===== MOLLYWOOD (60 movies) =====
  { imdbId: 'tt0275023', industry: 'Mollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt6277922', industry: 'Mollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt8025912', industry: 'Mollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt12361974', industry: 'Mollywood', isPremium: false, isNewRelease: false },
  { imdbId: 'tt14827124', industry: 'Mollywood', isPremium: true,  isNewRelease: true },
  { imdbId: 'tt21823606', industry: 'Mollywood', isPremium: false, isNewRelease: true },
  { imdbId: 'tt27936060', industry: 'Mollywood', isPremium: true,  isNewRelease: true },
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

  // ===== PUNJABI (40 movies) =====
  { imdbId: 'tt2442560', industry: 'Punjabi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt4303544', industry: 'Punjabi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt4830426', industry: 'Punjabi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt5062796', industry: 'Punjabi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt9380644', industry: 'Punjabi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt8788148', industry: 'Punjabi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt11637972', industry: 'Punjabi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt16362070', industry: 'Punjabi', isPremium: false, isNewRelease: true },
  { imdbId: 'tt20259350', industry: 'Punjabi', isPremium: false, isNewRelease: true },
  { imdbId: 'tt14634650', industry: 'Punjabi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt3263568', industry: 'Punjabi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt3775148', industry: 'Punjabi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt4256560', industry: 'Punjabi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt5568340', industry: 'Punjabi', isPremium: false, isNewRelease: false },
  { imdbId: 'tt8367458', industry: 'Punjabi', isPremium: false, isNewRelease: false },

  // ===== TAMIL (60 movies) =====
  { imdbId: 'tt1187141', industry: 'Tamil', isPremium: false, isNewRelease: false },
  { imdbId: 'tt0449995', industry: 'Tamil', isPremium: false, isNewRelease: false },
  { imdbId: 'tt6146586', industry: 'Tamil', isPremium: false, isNewRelease: false },
  { imdbId: 'tt9428540', industry: 'Tamil', isPremium: false, isNewRelease: false },
  { imdbId: 'tt6566592', industry: 'Tamil', isPremium: false, isNewRelease: false },
  { imdbId: 'tt10370822', industry: 'Tamil', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt15253180', industry: 'Tamil', isPremium: true,  isNewRelease: false },
  { imdbId: 'tt13822716', industry: 'Tamil', isPremium: false, isNewRelease: true },
  { imdbId: 'tt15221802', industry: 'Tamil', isPremium: false, isNewRelease: true },
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

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

function getDefaultStreaming(industry) {
  const d = {
    'Bollywood': ['Netflix', 'JioCinema'], 'Tollywood': ['Netflix', 'Amazon Prime'],
    'Hollywood': ['JioCinema', 'Amazon Prime'], 'Marathi': ['JioCinema', 'ZEE5'],
    'Mollywood': ['Amazon Prime', 'JioCinema'], 'Punjabi': ['JioCinema', 'MX Player'],
    'Tamil': ['Netflix', 'JioCinema'],
  }
  return d[industry] || ['JioCinema']
}

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
        const streaming = streamingMap[imdbId] || getDefaultStreaming(industry)

        imported.push({
          title: data.Title, overview: data.Plot !== 'N/A' ? data.Plot : 'A compelling story.',
          posterPath: poster, backdropPath: poster, rating,
          releaseDate: `${year}-01-01`, genres, industry,
          isPremium, isNewRelease,
          popularity: Math.floor(rating * 1000) + Math.floor(Math.random() * 500),
          cast, director: data.Director !== 'N/A' ? data.Director : '',
          language: data.Language ? data.Language.split(',')[0].trim() : '',
          streamingOn: streaming,
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
    console.log('🌐 Open: http://localhost:5173\n')
  } catch (err) {
    console.error('❌ Error:', err.message)
  } finally {
    await mongoose.disconnect()
  }
}

importMovies()