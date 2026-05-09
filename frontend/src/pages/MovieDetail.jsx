import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const OTT_DATA = {
  // ========== BOLLYWOOD ==========
  'Dilwale Dulhania Le Jayenge': [{ name: 'Netflix', url: 'https://www.netflix.com/search?q=Dilwale+Dulhania', color: '#E50914', free: false }, { name: 'JioCinema', url: 'https://www.jiocinema.com/search/dilwale-dulhania', color: '#0066FF', free: true }],
  'Kabhi Khushi Kabhie Gham': [{ name: 'Netflix', url: 'https://www.netflix.com/search?q=Kabhi+Khushi', color: '#E50914', free: false }, { name: 'JioCinema', url: 'https://www.jiocinema.com/search/kabhi-khushi', color: '#0066FF', free: true }],
  'Lagaan': [{ name: 'JioCinema', url: 'https://www.jiocinema.com/search/lagaan', color: '#0066FF', free: true }, { name: 'MX Player', url: 'https://www.mxplayer.in/search?q=Lagaan', color: '#FF6B00', free: true }],
  'Taare Zameen Par': [{ name: 'Netflix', url: 'https://www.netflix.com/search?q=Taare+Zameen+Par', color: '#E50914', free: false }, { name: 'JioCinema', url: 'https://www.jiocinema.com/search/taare-zameen-par', color: '#0066FF', free: true }],
  '3 Idiots': [{ name: 'Netflix', url: 'https://www.netflix.com/search?q=3+Idiots', color: '#E50914', free: false }, { name: 'JioCinema', url: 'https://www.jiocinema.com/search/3-idiots', color: '#0066FF', free: true }],
  'PK': [{ name: 'Netflix', url: 'https://www.netflix.com/search?q=PK', color: '#E50914', free: false }, { name: 'JioCinema', url: 'https://www.jiocinema.com/search/pk', color: '#0066FF', free: true }],
  'Dangal': [{ name: 'Disney+ Hotstar', url: 'https://www.hotstar.com/in/search?q=Dangal', color: '#00A3E0', free: false }, { name: 'JioCinema', url: 'https://www.jiocinema.com/search/dangal', color: '#0066FF', free: true }],
  'Bajrangi Bhaijaan': [{ name: 'Netflix', url: 'https://www.netflix.com/search?q=Bajrangi+Bhaijaan', color: '#E50914', free: false }, { name: 'JioCinema', url: 'https://www.jiocinema.com/search/bajrangi-bhaijaan', color: '#0066FF', free: true }],
  'Andhadhun': [{ name: 'Netflix', url: 'https://www.netflix.com/search?q=Andhadhun', color: '#E50914', free: false }, { name: 'JioCinema', url: 'https://www.jiocinema.com/search/andhadhun', color: '#0066FF', free: true }],
  'Uri: The Surgical Strike': [{ name: 'Netflix', url: 'https://www.netflix.com/search?q=Uri', color: '#E50914', free: false }, { name: 'JioCinema', url: 'https://www.jiocinema.com/search/uri', color: '#0066FF', free: true }],
  'Pathaan': [{ name: 'Amazon Prime', url: 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase=Pathaan', color: '#00A8E0', free: false }, { name: 'JioCinema', url: 'https://www.jiocinema.com/search/pathaan', color: '#0066FF', free: true }],
  'Jawan': [{ name: 'Netflix', url: 'https://www.netflix.com/search?q=Jawan', color: '#E50914', free: false }, { name: 'JioCinema', url: 'https://www.jiocinema.com/search/jawan', color: '#0066FF', free: true }],
  'Animal': [{ name: 'Netflix', url: 'https://www.netflix.com/search?q=Animal', color: '#E50914', free: false }],
  'Stree 2': [{ name: 'Amazon Prime', url: 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase=Stree+2', color: '#00A8E0', free: false }],
  '12th Fail': [{ name: 'Disney+ Hotstar', url: 'https://www.hotstar.com/in/search?q=12th+Fail', color: '#00A3E0', free: false }],
  'Laapataa Ladies': [{ name: 'Netflix', url: 'https://www.netflix.com/search?q=Laapataa+Ladies', color: '#E50914', free: false }],
  'Sam Bahadur': [{ name: 'Netflix', url: 'https://www.netflix.com/search?q=Sam+Bahadur', color: '#E50914', free: false }, { name: 'JioCinema', url: 'https://www.jiocinema.com/search/sam-bahadur', color: '#0066FF', free: true }],
  'Dunki': [{ name: 'Netflix', url: 'https://www.netflix.com/search?q=Dunki', color: '#E50914', free: false }],
  'Zindagi Na Milegi Dobara': [{ name: 'Netflix', url: 'https://www.netflix.com/search?q=Zindagi+Na+Milegi', color: '#E50914', free: false }, { name: 'JioCinema', url: 'https://www.jiocinema.com/search/zindagi-na-milegi', color: '#0066FF', free: true }],
  'Queen': [{ name: 'Netflix', url: 'https://www.netflix.com/search?q=Queen', color: '#E50914', free: false }, { name: 'MX Player', url: 'https://www.mxplayer.in/search?q=Queen', color: '#FF6B00', free: true }],
  'Kahaani': [{ name: 'Netflix', url: 'https://www.netflix.com/search?q=Kahaani', color: '#E50914', free: false }, { name: 'MX Player', url: 'https://www.mxplayer.in/search?q=Kahaani', color: '#FF6B00', free: true }],
  'Barfi!': [{ name: 'Netflix', url: 'https://www.netflix.com/search?q=Barfi', color: '#E50914', free: false }, { name: 'JioCinema', url: 'https://www.jiocinema.com/search/barfi', color: '#0066FF', free: true }],
  'Gangs of Wasseypur': [{ name: 'Netflix', url: 'https://www.netflix.com/search?q=Gangs+of+Wasseypur', color: '#E50914', free: false }, { name: 'JioCinema', url: 'https://www.jiocinema.com/search/gangs-of-wasseypur', color: '#0066FF', free: true }],
  'Rang De Basanti': [{ name: 'JioCinema', url: 'https://www.jiocinema.com/search/rang-de-basanti', color: '#0066FF', free: true }, { name: 'MX Player', url: 'https://www.mxplayer.in/search?q=Rang+De+Basanti', color: '#FF6B00', free: true }],
  'Kuch Kuch Hota Hai': [{ name: 'Netflix', url: 'https://www.netflix.com/search?q=Kuch+Kuch+Hota+Hai', color: '#E50914', free: false }, { name: 'JioCinema', url: 'https://www.jiocinema.com/search/kuch-kuch-hota-hai', color: '#0066FF', free: true }],
  'Kal Ho Naa Ho': [{ name: 'Netflix', url: 'https://www.netflix.com/search?q=Kal+Ho+Naa+Ho', color: '#E50914', free: false }, { name: 'JioCinema', url: 'https://www.jiocinema.com/search/kal-ho-naa-ho', color: '#0066FF', free: true }],
  'Ghajini': [{ name: 'JioCinema', url: 'https://www.jiocinema.com/search/ghajini', color: '#0066FF', free: true }, { name: 'MX Player', url: 'https://www.mxplayer.in/search?q=Ghajini', color: '#FF6B00', free: true }],
  'Toilet: Ek Prem Katha': [{ name: 'Amazon Prime', url: 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase=Toilet+Ek+Prem', color: '#00A8E0', free: false }],
  'Brahmastra Part One: Shiva': [{ name: 'Disney+ Hotstar', url: 'https://www.hotstar.com/in/search?q=Brahmastra', color: '#00A3E0', free: false }, { name: 'JioCinema', url: 'https://www.jiocinema.com/search/brahmastra', color: '#0066FF', free: true }],

  // ========== TOLLYWOOD ==========
  'Baahubali: The Beginning': [{ name: 'Netflix', url: 'https://www.netflix.com/search?q=Baahubali', color: '#E50914', free: false }, { name: 'Amazon Prime', url: 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase=Baahubali', color: '#00A8E0', free: false }],
  'Baahubali 2: The Conclusion': [{ name: 'Netflix', url: 'https://www.netflix.com/search?q=Baahubali+2', color: '#E50914', free: false }, { name: 'Amazon Prime', url: 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase=Baahubali+2', color: '#00A8E0', free: false }],
  'RRR': [{ name: 'Netflix', url: 'https://www.netflix.com/search?q=RRR', color: '#E50914', free: false }, { name: 'ZEE5', url: 'https://www.zee5.com/search?q=RRR', color: '#8B2BE2', free: false }],
  'KGF: Chapter 1': [{ name: 'Amazon Prime', url: 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase=KGF+Chapter+1', color: '#00A8E0', free: false }, { name: 'JioCinema', url: 'https://www.jiocinema.com/search/kgf-chapter-1', color: '#0066FF', free: true }],
  'KGF: Chapter 2': [{ name: 'Amazon Prime', url: 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase=KGF+2', color: '#00A8E0', free: false }, { name: 'JioCinema', url: 'https://www.jiocinema.com/search/kgf-chapter-2', color: '#0066FF', free: true }],
  'Pushpa: The Rise': [{ name: 'Amazon Prime', url: 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase=Pushpa', color: '#00A8E0', free: false }, { name: 'JioCinema', url: 'https://www.jiocinema.com/search/pushpa', color: '#0066FF', free: true }],
  'Pushpa 2: The Rule': [{ name: 'Amazon Prime', url: 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase=Pushpa+2', color: '#00A8E0', free: false }],
  'Kantara': [{ name: 'Amazon Prime', url: 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase=Kantara', color: '#00A8E0', free: false }],
  'Salaar: Part 1': [{ name: 'Netflix', url: 'https://www.netflix.com/search?q=Salaar', color: '#E50914', free: false }],
  'Salaar: Part 1 - Ceasefire': [{ name: 'Netflix', url: 'https://www.netflix.com/search?q=Salaar', color: '#E50914', free: false }],
  'Vikram': [{ name: 'Disney+ Hotstar', url: 'https://www.hotstar.com/in/search?q=Vikram', color: '#00A3E0', free: false }],
  'Leo': [{ name: 'Netflix', url: 'https://www.netflix.com/search?q=Leo', color: '#E50914', free: false }],
  'Jailer': [{ name: 'Netflix', url: 'https://www.netflix.com/search?q=Jailer', color: '#E50914', free: false }],
  'Kalki 2898 AD': [{ name: 'Netflix', url: 'https://www.netflix.com/search?q=Kalki+2898', color: '#E50914', free: false }, { name: 'Amazon Prime', url: 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase=Kalki+2898', color: '#00A8E0', free: false }],
  'HanuMan': [{ name: 'Netflix', url: 'https://www.netflix.com/search?q=HanuMan', color: '#E50914', free: false }, { name: 'Amazon Prime', url: 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase=HanuMan', color: '#00A8E0', free: false }],
  'Lucky Baskhar': [{ name: 'Amazon Prime', url: 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase=Lucky+Baskhar', color: '#00A8E0', free: false }],
  'Arjun Reddy': [{ name: 'Netflix', url: 'https://www.netflix.com/search?q=Arjun+Reddy', color: '#E50914', free: false }, { name: 'Amazon Prime', url: 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase=Arjun+Reddy', color: '#00A8E0', free: false }],
  'Ponniyin Selvan: Part 1': [{ name: 'Disney+ Hotstar', url: 'https://www.hotstar.com/in/search?q=Ponniyin+Selvan', color: '#00A3E0', free: false }],
  'Ponniyin Selvan: Part 2': [{ name: 'Disney+ Hotstar', url: 'https://www.hotstar.com/in/search?q=Ponniyin+Selvan+2', color: '#00A3E0', free: false }],
  'Devara: Part 1': [{ name: 'Netflix', url: 'https://www.netflix.com/search?q=Devara', color: '#E50914', free: false }],
  'Saripodhaa Sanivaaram': [{ name: 'Netflix', url: 'https://www.netflix.com/search?q=Saripodhaa', color: '#E50914', free: false }],
  'Dasara': [{ name: 'Netflix', url: 'https://www.netflix.com/search?q=Dasara', color: '#E50914', free: false }, { name: 'Amazon Prime', url: 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase=Dasara', color: '#00A8E0', free: false }],

  // ========== HOLLYWOOD ==========
  'The Shawshank Redemption': [{ name: 'JioCinema', url: 'https://www.jiocinema.com/search/shawshank', color: '#0066FF', free: true }, { name: 'MX Player', url: 'https://www.mxplayer.in/search?q=Shawshank', color: '#FF6B00', free: true }],
  'The Godfather': [{ name: 'Amazon Prime', url: 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase=The+Godfather', color: '#00A8E0', free: false }, { name: 'JioCinema', url: 'https://www.jiocinema.com/search/godfather', color: '#0066FF', free: true }],
  'The Dark Knight': [{ name: 'JioCinema', url: 'https://www.jiocinema.com/search/dark-knight', color: '#0066FF', free: true }, { name: 'ZEE5', url: 'https://www.zee5.com/search?q=Dark+Knight', color: '#8B2BE2', free: false }],
  'Inception': [{ name: 'JioCinema', url: 'https://www.jiocinema.com/search/inception', color: '#0066FF', free: true }, { name: 'Netflix', url: 'https://www.netflix.com/search?q=Inception', color: '#E50914', free: false }],
  'Interstellar': [{ name: 'JioCinema', url: 'https://www.jiocinema.com/search/interstellar', color: '#0066FF', free: true }, { name: 'Amazon Prime', url: 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase=Interstellar', color: '#00A8E0', free: false }],
  'Avengers: Endgame': [{ name: 'Disney+ Hotstar', url: 'https://www.hotstar.com/in/search?q=Avengers+Endgame', color: '#00A3E0', free: false }],
  'Spider-Man: No Way Home': [{ name: 'Netflix', url: 'https://www.netflix.com/search?q=Spider-Man+No+Way+Home', color: '#E50914', free: false }, { name: 'JioCinema', url: 'https://www.jiocinema.com/search/spiderman-no-way-home', color: '#0066FF', free: true }],
  'Top Gun: Maverick': [{ name: 'Netflix', url: 'https://www.netflix.com/search?q=Top+Gun+Maverick', color: '#E50914', free: false }, { name: 'JioCinema', url: 'https://www.jiocinema.com/search/top-gun-maverick', color: '#0066FF', free: true }],
  'Oppenheimer': [{ name: 'Amazon Prime', url: 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase=Oppenheimer', color: '#00A8E0', free: false }, { name: 'JioCinema', url: 'https://www.jiocinema.com/search/oppenheimer', color: '#0066FF', free: true }],
  'Barbie': [{ name: 'Amazon Prime', url: 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase=Barbie', color: '#00A8E0', free: false }, { name: 'JioCinema', url: 'https://www.jiocinema.com/search/barbie', color: '#0066FF', free: true }],
  'Dune: Part Two': [{ name: 'JioCinema', url: 'https://www.jiocinema.com/search/dune-part-two', color: '#0066FF', free: true }, { name: 'Amazon Prime', url: 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase=Dune+Part+Two', color: '#00A8E0', free: false }],
  'Deadpool & Wolverine': [{ name: 'Disney+ Hotstar', url: 'https://www.hotstar.com/in/search?q=Deadpool+Wolverine', color: '#00A3E0', free: false }],
  'Inside Out 2': [{ name: 'Disney+ Hotstar', url: 'https://www.hotstar.com/in/search?q=Inside+Out+2', color: '#00A3E0', free: false }],
  'John Wick: Chapter 4': [{ name: 'Netflix', url: 'https://www.netflix.com/search?q=John+Wick+4', color: '#E50914', free: false }, { name: 'Amazon Prime', url: 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase=John+Wick+4', color: '#00A8E0', free: false }],
  'Avatar: The Way of Water': [{ name: 'Disney+ Hotstar', url: 'https://www.hotstar.com/in/search?q=Avatar+Way+of+Water', color: '#00A3E0', free: false }],
  'The Batman': [{ name: 'JioCinema', url: 'https://www.jiocinema.com/search/the-batman', color: '#0066FF', free: true }, { name: 'ZEE5', url: 'https://www.zee5.com/search?q=The+Batman', color: '#8B2BE2', free: false }],
  'Forrest Gump': [{ name: 'Netflix', url: 'https://www.netflix.com/search?q=Forrest+Gump', color: '#E50914', free: false }, { name: 'JioCinema', url: 'https://www.jiocinema.com/search/forrest-gump', color: '#0066FF', free: true }],
  'The Matrix': [{ name: 'Netflix', url: 'https://www.netflix.com/search?q=The+Matrix', color: '#E50914', free: false }, { name: 'JioCinema', url: 'https://www.jiocinema.com/search/the-matrix', color: '#0066FF', free: true }],
  'Fight Club': [{ name: 'JioCinema', url: 'https://www.jiocinema.com/search/fight-club', color: '#0066FF', free: true }, { name: 'Amazon Prime', url: 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase=Fight+Club', color: '#00A8E0', free: false }],
  'Dune: Part One': [{ name: 'JioCinema', url: 'https://www.jiocinema.com/search/dune', color: '#0066FF', free: true }, { name: 'Amazon Prime', url: 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase=Dune', color: '#00A8E0', free: false }],
  'Se7en': [{ name: 'JioCinema', url: 'https://www.jiocinema.com/search/se7en', color: '#0066FF', free: true }],
  'The Lord of the Rings: The Fellowship of the Ring': [{ name: 'Amazon Prime', url: 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase=Lord+of+the+Rings', color: '#00A8E0', free: false }],
  'The Lord of the Rings: The Return of the King': [{ name: 'Amazon Prime', url: 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase=Lord+of+the+Rings', color: '#00A8E0', free: false }],
  'The Avengers': [{ name: 'Disney+ Hotstar', url: 'https://www.hotstar.com/in/search?q=The+Avengers', color: '#00A3E0', free: false }],
  'Guardians of the Galaxy Vol. 3': [{ name: 'Disney+ Hotstar', url: 'https://www.hotstar.com/in/search?q=Guardians+Galaxy+3', color: '#00A3E0', free: false }],

  // ========== MARATHI ==========
  'Sairat': [{ name: 'Netflix', url: 'https://www.netflix.com/search?q=Sairat', color: '#E50914', free: false }, { name: 'MX Player', url: 'https://www.mxplayer.in/search?q=Sairat', color: '#FF6B00', free: true }, { name: 'JioCinema', url: 'https://www.jiocinema.com/search/sairat', color: '#0066FF', free: true }],
  'Natsamrat': [{ name: 'Amazon Prime', url: 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase=Natsamrat', color: '#00A8E0', free: false }, { name: 'MX Player', url: 'https://www.mxplayer.in/search?q=Natsamrat', color: '#FF6B00', free: true }],
  'Fandry': [{ name: 'Amazon Prime', url: 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase=Fandry', color: '#00A8E0', free: false }, { name: 'MX Player', url: 'https://www.mxplayer.in/search?q=Fandry', color: '#FF6B00', free: true }],
  'Jhund': [{ name: 'ZEE5', url: 'https://www.zee5.com/search?q=Jhund', color: '#8B2BE2', free: false }, { name: 'JioCinema', url: 'https://www.jiocinema.com/search/jhund', color: '#0066FF', free: true }],
  'Naal': [{ name: 'MX Player', url: 'https://www.mxplayer.in/search?q=Naal', color: '#FF6B00', free: true }, { name: 'JioCinema', url: 'https://www.jiocinema.com/search/naal', color: '#0066FF', free: true }],
  'Kaasav': [{ name: 'JioCinema', url: 'https://www.jiocinema.com/search/kaasav', color: '#0066FF', free: true }, { name: 'MX Player', url: 'https://www.mxplayer.in/search?q=Kaasav', color: '#FF6B00', free: true }],
  'Double Seat': [{ name: 'JioCinema', url: 'https://www.jiocinema.com/search/double-seat', color: '#0066FF', free: true }, { name: 'MX Player', url: 'https://www.mxplayer.in/search?q=Double+Seat', color: '#FF6B00', free: true }],
  'Anandi Gopal': [{ name: 'JioCinema', url: 'https://www.jiocinema.com/search/anandi-gopal', color: '#0066FF', free: true }, { name: 'ZEE5', url: 'https://www.zee5.com/search?q=Anandi+Gopal', color: '#8B2BE2', free: false }],
  'Pawankhind': [{ name: 'JioCinema', url: 'https://www.jiocinema.com/search/pawankhind', color: '#0066FF', free: true }, { name: 'ZEE5', url: 'https://www.zee5.com/search?q=Pawankhind', color: '#8B2BE2', free: false }],
  'Godavari': [{ name: 'JioCinema', url: 'https://www.jiocinema.com/search/godavari', color: '#0066FF', free: true }, { name: 'MX Player', url: 'https://www.mxplayer.in/search?q=Godavari', color: '#FF6B00', free: true }],
  'Har Har Mahadev': [{ name: 'ZEE5', url: 'https://www.zee5.com/search?q=Har+Har+Mahadev', color: '#8B2BE2', free: false }, { name: 'JioCinema', url: 'https://www.jiocinema.com/search/har-har-mahadev', color: '#0066FF', free: true }],
  'Vaalvi': [{ name: 'ZEE5', url: 'https://www.zee5.com/search?q=Vaalvi', color: '#8B2BE2', free: false }, { name: 'JioCinema', url: 'https://www.jiocinema.com/search/vaalvi', color: '#0066FF', free: true }],
  'Dhurala': [{ name: 'JioCinema', url: 'https://www.jiocinema.com/search/dhurala', color: '#0066FF', free: true }, { name: 'ZEE5', url: 'https://www.zee5.com/search?q=Dhurala', color: '#8B2BE2', free: false }],
  'Muramba': [{ name: 'JioCinema', url: 'https://www.jiocinema.com/search/muramba', color: '#0066FF', free: true }, { name: 'MX Player', url: 'https://www.mxplayer.in/search?q=Muramba', color: '#FF6B00', free: true }],
  'Rege': [{ name: 'JioCinema', url: 'https://www.jiocinema.com/search/rege', color: '#0066FF', free: true }, { name: 'MX Player', url: 'https://www.mxplayer.in/search?q=Rege', color: '#FF6B00', free: true }],

  // ========== MOLLYWOOD ==========
  'Drishyam': [{ name: 'Netflix', url: 'https://www.netflix.com/search?q=Drishyam', color: '#E50914', free: false }, { name: 'Amazon Prime', url: 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase=Drishyam', color: '#00A8E0', free: false }],
  'Drishyam 2': [{ name: 'Amazon Prime', url: 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase=Drishyam+2', color: '#00A8E0', free: false }],
  'Premam': [{ name: 'Netflix', url: 'https://www.netflix.com/search?q=Premam', color: '#E50914', free: false }, { name: 'JioCinema', url: 'https://www.jiocinema.com/search/premam', color: '#0066FF', free: true }],
  'Lucifer': [{ name: 'Amazon Prime', url: 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase=Lucifer+Malayalam', color: '#00A8E0', free: false }, { name: 'JioCinema', url: 'https://www.jiocinema.com/search/lucifer', color: '#0066FF', free: true }],
  'Minnal Murali': [{ name: 'Netflix', url: 'https://www.netflix.com/search?q=Minnal+Murali', color: '#E50914', free: false }],
  'Manjummel Boys': [{ name: 'Amazon Prime', url: 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase=Manjummel+Boys', color: '#00A8E0', free: false }],
  'Premalu': [{ name: 'Netflix', url: 'https://www.netflix.com/search?q=Premalu', color: '#E50914', free: false }, { name: 'Amazon Prime', url: 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase=Premalu', color: '#00A8E0', free: false }],
  'Aavesham': [{ name: 'Netflix', url: 'https://www.netflix.com/search?q=Aavesham', color: '#E50914', free: false }],
  '2018': [{ name: 'Netflix', url: 'https://www.netflix.com/search?q=2018+Kerala+Floods', color: '#E50914', free: false }, { name: 'Amazon Prime', url: 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase=2018+Movie', color: '#00A8E0', free: false }],
  'Angamaly Diaries': [{ name: 'Netflix', url: 'https://www.netflix.com/search?q=Angamaly+Diaries', color: '#E50914', free: false }, { name: 'Amazon Prime', url: 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase=Angamaly+Diaries', color: '#00A8E0', free: false }],
  'Kumbalangi Nights': [{ name: 'Netflix', url: 'https://www.netflix.com/search?q=Kumbalangi+Nights', color: '#E50914', free: false }, { name: 'Amazon Prime', url: 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase=Kumbalangi+Nights', color: '#00A8E0', free: false }],
  'Malik': [{ name: 'Amazon Prime', url: 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase=Malik+Malayalam', color: '#00A8E0', free: false }],
  'Varathan': [{ name: 'Amazon Prime', url: 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase=Varathan', color: '#00A8E0', free: false }, { name: 'JioCinema', url: 'https://www.jiocinema.com/search/varathan', color: '#0066FF', free: true }],
  'Virus': [{ name: 'Netflix', url: 'https://www.netflix.com/search?q=Virus+Malayalam', color: '#E50914', free: false }, { name: 'Amazon Prime', url: 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase=Virus+Malayalam', color: '#00A8E0', free: false }],

  // ========== PUNJABI ==========
  'Angrej': [{ name: 'JioCinema', url: 'https://www.jiocinema.com/search/angrej', color: '#0066FF', free: true }, { name: 'MX Player', url: 'https://www.mxplayer.in/search?q=Angrej', color: '#FF6B00', free: true }],
  'Udta Punjab': [{ name: 'Netflix', url: 'https://www.netflix.com/search?q=Udta+Punjab', color: '#E50914', free: false }, { name: 'JioCinema', url: 'https://www.jiocinema.com/search/udta-punjab', color: '#0066FF', free: true }],
  'Ardaas': [{ name: 'JioCinema', url: 'https://www.jiocinema.com/search/ardaas', color: '#0066FF', free: true }, { name: 'MX Player', url: 'https://www.mxplayer.in/search?q=Ardaas', color: '#FF6B00', free: true }],
  'Lahoriye': [{ name: 'JioCinema', url: 'https://www.jiocinema.com/search/lahoriye', color: '#0066FF', free: true }, { name: 'MX Player', url: 'https://www.mxplayer.in/search?q=Lahoriye', color: '#FF6B00', free: true }],
  'Sufna': [{ name: 'JioCinema', url: 'https://www.jiocinema.com/search/sufna', color: '#0066FF', free: true }, { name: 'Amazon Prime', url: 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase=Sufna', color: '#00A8E0', free: false }],
  'Shadaa': [{ name: 'JioCinema', url: 'https://www.jiocinema.com/search/shadaa', color: '#0066FF', free: true }, { name: 'MX Player', url: 'https://www.mxplayer.in/search?q=Shadaa', color: '#FF6B00', free: true }],
  'Honsla Rakh': [{ name: 'JioCinema', url: 'https://www.jiocinema.com/search/honsla-rakh', color: '#0066FF', free: true }, { name: 'Amazon Prime', url: 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase=Honsla+Rakh', color: '#00A8E0', free: false }],
  'Carry On Jatta 3': [{ name: 'JioCinema', url: 'https://www.jiocinema.com/search/carry-on-jatta-3', color: '#0066FF', free: true }, { name: 'Amazon Prime', url: 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase=Carry+On+Jatta+3', color: '#00A8E0', free: false }],
  'Jatt & Juliet 3': [{ name: 'JioCinema', url: 'https://www.jiocinema.com/search/jatt-juliet-3', color: '#0066FF', free: true }, { name: 'Amazon Prime', url: 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase=Jatt+Juliet+3', color: '#00A8E0', free: false }],
  'Saunkan Saunkne': [{ name: 'JioCinema', url: 'https://www.jiocinema.com/search/saunkan-saunkne', color: '#0066FF', free: true }, { name: 'Amazon Prime', url: 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase=Saunkan+Saunkne', color: '#00A8E0', free: false }],

  // ========== TAMIL ==========
  'Enthiran': [{ name: 'Netflix', url: 'https://www.netflix.com/search?q=Enthiran', color: '#E50914', free: false }, { name: 'JioCinema', url: 'https://www.jiocinema.com/search/enthiran', color: '#0066FF', free: true }],
  'Sivaji: The Boss': [{ name: 'JioCinema', url: 'https://www.jiocinema.com/search/sivaji', color: '#0066FF', free: true }, { name: 'MX Player', url: 'https://www.mxplayer.in/search?q=Sivaji+The+Boss', color: '#FF6B00', free: true }],
  'Mersal': [{ name: 'Netflix', url: 'https://www.netflix.com/search?q=Mersal', color: '#E50914', free: false }, { name: 'JioCinema', url: 'https://www.jiocinema.com/search/mersal', color: '#0066FF', free: true }],
  '96': [{ name: 'Netflix', url: 'https://www.netflix.com/search?q=96+Tamil', color: '#E50914', free: false }, { name: 'Amazon Prime', url: 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase=96+Tamil', color: '#00A8E0', free: false }],
  'Master': [{ name: 'Netflix', url: 'https://www.netflix.com/search?q=Master+Tamil', color: '#E50914', free: false }, { name: 'Amazon Prime', url: 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase=Master+Tamil', color: '#00A8E0', free: false }],
  'Bigil': [{ name: 'Netflix', url: 'https://www.netflix.com/search?q=Bigil', color: '#E50914', free: false }, { name: 'JioCinema', url: 'https://www.jiocinema.com/search/bigil', color: '#0066FF', free: true }],
  'Vikram (Tamil)': [{ name: 'Disney+ Hotstar', url: 'https://www.hotstar.com/in/search?q=Vikram', color: '#00A3E0', free: false }],
  'Leo (Tamil)': [{ name: 'Netflix', url: 'https://www.netflix.com/search?q=Leo+Tamil', color: '#E50914', free: false }],
  'Jailer (Tamil)': [{ name: 'Netflix', url: 'https://www.netflix.com/search?q=Jailer', color: '#E50914', free: false }],
}

const TRAILERS = {
  'Jawan': 'oOpFCM5rGbA', 'Pathaan': 'vsel-Kd3vvE', 'Animal': 'E1BFgpGD7P0',
  'RRR': 'f_vbAtFSEc0', 'KGF: Chapter 2': 'JKa05nyUmuQ', 'Pushpa: The Rise': 'Q1NKMPhP8PY',
  'Kantara': 'oHrGOBvDWmY', 'Salaar: Part 1': 'gH3HNBIWzgk',
  'Oppenheimer': 'uYPbbksJxIg', 'Top Gun: Maverick': 'qSqVVswa420',
  'Avatar: The Way of Water': 'a8Gx8wiNbs8', 'Barbie': 'pBk4NYhWNMM',
  'Spider-Man: No Way Home': 'JfVOs4VSpmA', 'Brahmastra Part One: Shiva': 'QFEoaDGeIKU',
  'Dunki': 'zVPTaHRGrYY', 'Sairat': 'fDtHCACiDPg', 'Natsamrat': 'w3MYkfYVdgQ',
  'Fandry': 'XiH6VrLFSR4', 'Jhund': '6qB_VtjMqgM', 'Naal': 'ow7HAhDg3k8',
  'Dangal': 'x_7YlGv9u1g', '3 Idiots': 'xvszmNXdM4w', 'Bajrangi Bhaijaan': 'jXBSB8XIMSE',
  'Baahubali: The Beginning': 'sOEg_YZQmac', 'Baahubali 2: The Conclusion': 'G2LX_XJLR5g',
  'KGF: Chapter 1': 'MKKoSBdNZGI', 'Pushpa 2: The Rule': 'o3xVLQrJHko',
  'Kalki 2898 AD': 'LWdDem3GKXY', 'HanuMan': 'y4CxuToGN44',
  'The Dark Knight': 'EXeTwQWrcwY', 'Inception': 'YoHD9XEInc0',
  'Interstellar': 'zSWdZVtXT7E', 'Avengers: Endgame': 'TcMBFSGVi1c',
  'Dune: Part Two': 'Way9Dexny3w', 'Deadpool & Wolverine': 'yhGTFOlGKx0',
  'Premam': 'y6uNiqte8X4', 'Manjummel Boys': 'S_XHGWZGMHI',
  'Aavesham': 'wN0yoZ0vv7Y', 'Drishyam 2': 'lGbCaC1bO9E',
  'Lucky Baskhar': 'OZjrxh3NeaU', 'Vikram': 'IRhVl7gq4UE',
}

export default function MovieDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [movie, setMovie] = useState(null)
  const [similar, setSimilar] = useState([])
  const [loading, setLoading] = useState(true)
  const [showTrailer, setShowTrailer] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    setLoading(true)
    setShowTrailer(false)
    axios.get(`/api/movies/${id}`)
      .then(res => {
        setMovie(res.data)
        setLoading(false)
        axios.get(`/api/movies?industry=${res.data.industry}`)
          .then(r => setSimilar((r.data.movies || []).filter(m => m._id !== id).slice(0, 6)))
      })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', background:'#0A0A0A' }}>
      <div style={{ color:'#C9A84C', fontSize:'22px' }}>⏳ Loading movie...</div>
    </div>
  )
  if (!movie) return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', background:'#0A0A0A', color:'#fff' }}>
      Movie not found
    </div>
  )

  const otts = OTT_DATA[movie.title] || []
  const trailerId = TRAILERS[movie.title]
  const freeOTTs = otts.filter(p => p.free)
  const paidOTTs = otts.filter(p => !p.free)

  return (
    <div style={{ minHeight:'100vh', background:'#0A0A0A', color:'#fff', paddingTop:'80px' }}>
      <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'40px 20px' }}>

        <div style={{ display:'flex', gap:'48px', flexWrap:'wrap', marginBottom:'60px' }}>

          {/* POSTER */}
          <div style={{ flexShrink:0 }}>
            <div style={{ position:'relative', width:'280px' }}>
              <img
                src={movie.posterPath || ''}
                alt={movie.title}
                style={{ width:'280px', height:'420px', objectFit:'cover', borderRadius:'12px', border:'2px solid #C9A84C44', display:'block', background:'#1a1a1a' }}
                onError={e => { e.target.src = ''; e.target.style.background = '#1a1a1a'; }}
              />
              <div style={{ position:'absolute', top:'12px', left:'12px', display:'flex', flexDirection:'column', gap:'6px' }}>
                {movie.isPremium && <span style={{ background:'#C9A84C', color:'#000', padding:'4px 10px', borderRadius:'4px', fontSize:'11px', fontWeight:'bold' }}>⭐ PREMIUM</span>}
                {movie.isNewRelease && <span style={{ background:'#22c55e', color:'#000', padding:'4px 10px', borderRadius:'4px', fontSize:'11px', fontWeight:'bold' }}>NEW</span>}
              </div>
            </div>
            <div style={{ marginTop:'12px', background:'#111', borderRadius:'8px', padding:'14px', textAlign:'center', border:'1px solid #C9A84C22' }}>
              <div style={{ color:'#C9A84C', fontSize:'32px', fontWeight:'bold' }}>★ {movie.rating}</div>
              <div style={{ color:'#666', fontSize:'12px' }}>IMDb Rating</div>
            </div>
          </div>

          {/* INFO */}
          <div style={{ flex:1, minWidth:'280px' }}>
            <button onClick={() => navigate(-1)} style={{ background:'transparent', border:'1px solid #333', color:'#888', padding:'6px 16px', borderRadius:'6px', cursor:'pointer', marginBottom:'16px', fontSize:'13px' }}>← Back</button>

            <h1 style={{ fontSize:'40px', fontWeight:'bold', margin:'0 0 10px', lineHeight:1.1 }}>{movie.title}</h1>

            <div style={{ display:'flex', gap:'12px', color:'#888', fontSize:'14px', marginBottom:'16px', flexWrap:'wrap', alignItems:'center' }}>
              <span>{movie.releaseDate?.substring(0,4)}</span>
              <span>•</span>
              <span style={{ color:'#C9A84C', fontWeight:'bold' }}>{movie.industry}</span>
              {movie.language && <><span>•</span><span>{movie.language}</span></>}
            </div>

            <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'20px' }}>
              {(movie.genres || []).map(g => (
                <span key={g} style={{ border:'1px solid #C9A84C55', color:'#C9A84C', padding:'4px 12px', borderRadius:'20px', fontSize:'12px' }}>{g}</span>
              ))}
            </div>

            {movie.overview && (
              <div style={{ marginBottom:'20px' }}>
                <div style={{ color:'#C9A84C', fontSize:'11px', textTransform:'uppercase', letterSpacing:'2px', marginBottom:'8px' }}>Story</div>
                <p style={{ color:'#bbb', lineHeight:1.8, fontSize:'15px', margin:0 }}>{movie.overview}</p>
              </div>
            )}

            <div style={{ background:'#111', borderRadius:'8px', padding:'16px', border:'1px solid #1f1f1f', marginBottom:'20px' }}>
              {movie.director && (
                <div style={{ marginBottom:'10px' }}>
                  <span style={{ color:'#C9A84C', fontSize:'12px', textTransform:'uppercase', letterSpacing:'1px' }}>🎬 Director: </span>
                  <span style={{ color:'#fff', fontSize:'15px' }}>{movie.director}</span>
                </div>
              )}
              {movie.cast && movie.cast.length > 0 && (
                <div>
                  <span style={{ color:'#C9A84C', fontSize:'12px', textTransform:'uppercase', letterSpacing:'1px' }}>🎭 Cast: </span>
                  <span style={{ color:'#ccc', fontSize:'14px' }}>{movie.cast.join(', ')}</span>
                </div>
              )}
            </div>

            {trailerId && (
              <button
                onClick={() => setShowTrailer(!showTrailer)}
                style={{ background: showTrailer ? '#444' : '#C9A84C', border:'none', color: showTrailer ? '#fff' : '#000', padding:'12px 28px', borderRadius:'8px', fontSize:'15px', cursor:'pointer', fontWeight:'bold', marginBottom:'20px', transition:'all 0.2s' }}>
                {showTrailer ? '✕ Close Trailer' : '▶ Watch Trailer'}
              </button>
            )}

            {showTrailer && trailerId && (
              <div style={{ borderRadius:'12px', overflow:'hidden', border:'1px solid #C9A84C33', marginBottom:'24px' }}>
                <iframe width="100%" height="340"
                  src={`https://www.youtube.com/embed/${trailerId}?autoplay=1`}
                  title="Trailer" frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen />
              </div>
            )}

            {/* WHERE TO WATCH */}
            <div style={{ background:'#111', borderRadius:'12px', padding:'20px', border:'1px solid #1f1f1f' }}>
              <div style={{ color:'#C9A84C', fontSize:'12px', textTransform:'uppercase', letterSpacing:'2px', marginBottom:'16px' }}>📺 Where to Watch</div>

              {otts.length === 0 ? (
                <p style={{ color:'#555', fontSize:'14px', margin:0 }}>Currently not available on major OTT platforms.</p>
              ) : (
                <>
                  {freeOTTs.length > 0 && (
                    <div style={{ marginBottom:'14px' }}>
                      <div style={{ color:'#22c55e', fontSize:'11px', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'8px' }}>🆓 Free to Watch</div>
                      <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
                        {freeOTTs.map(p => (
                          <a key={p.name} href={p.url} target="_blank" rel="noreferrer"
                            style={{ background:p.color, color:'#fff', padding:'10px 20px', borderRadius:'8px', textDecoration:'none', fontSize:'13px', fontWeight:'bold', display:'flex', alignItems:'center', gap:'6px', transition:'opacity 0.2s' }}
                            onMouseOver={e => e.currentTarget.style.opacity = '0.85'}
                            onMouseOut={e => e.currentTarget.style.opacity = '1'}>
                            ▶ {p.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                  {paidOTTs.length > 0 && (
                    <div>
                      <div style={{ color:'#C9A84C', fontSize:'11px', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'8px' }}>💳 Subscription Required</div>
                      <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
                        {paidOTTs.map(p => (
                          <a key={p.name} href={p.url} target="_blank" rel="noreferrer"
                            style={{ background:p.color, color:'#fff', padding:'10px 20px', borderRadius:'8px', textDecoration:'none', fontSize:'13px', fontWeight:'bold', display:'flex', alignItems:'center', gap:'6px', transition:'opacity 0.2s' }}
                            onMouseOver={e => e.currentTarget.style.opacity = '0.85'}
                            onMouseOut={e => e.currentTarget.style.opacity = '1'}>
                            ▶ {p.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {movie.isPremium && (
                <div style={{ marginTop:'16px', padding:'12px 16px', background:'linear-gradient(135deg, #C9A84C22, #C9A84C11)', border:'1px solid #C9A84C44', borderRadius:'8px' }}>
                  <span style={{ color:'#C9A84C', fontSize:'13px' }}>
                    ⭐ <strong>Cineverse Premium</strong> — Get exclusive recommendations, early access & ad-free experience.{' '}
                    <span onClick={() => navigate('/premium')} style={{ textDecoration:'underline', cursor:'pointer', fontWeight:'bold' }}>
                      Upgrade Now →
                    </span>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SIMILAR MOVIES */}
        {similar.length > 0 && (
          <div>
            <h2 style={{ fontSize:'22px', marginBottom:'20px' }}>
              More from <span style={{ color:'#C9A84C' }}>{movie.industry}</span>
            </h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(160px, 1fr))', gap:'16px' }}>
              {similar.map(m => (
                <div key={m._id} onClick={() => navigate(`/movie/${m._id}`)}
                  style={{ cursor:'pointer', background:'#111', borderRadius:'8px', overflow:'hidden', border:'1px solid #222', transition:'all 0.2s' }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = '#C9A84C'; e.currentTarget.style.transform = 'scale(1.03)' }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = '#222'; e.currentTarget.style.transform = 'scale(1)' }}>
                  <img src={m.posterPath || ''} alt={m.title}
                    style={{ width:'100%', height:'230px', objectFit:'cover', background:'#1a1a1a', display:'block' }}
                    onError={e => { e.target.style.display = 'none' }} />
                  <div style={{ padding:'10px' }}>
                    <div style={{ fontSize:'13px', fontWeight:'bold', marginBottom:'4px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{m.title}</div>
                    <div style={{ color:'#C9A84C', fontSize:'12px' }}>★ {m.rating} · {m.releaseDate?.substring(0,4)}</div>
                    {m.isPremium && <div style={{ color:'#C9A84C', fontSize:'10px', marginTop:'4px' }}>⭐ PREMIUM</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}