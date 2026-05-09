import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Premium from './pages/Premium'
import Movies from './pages/Movies'
import MovieDetail from './pages/MovieDetail'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/premium" element={<Premium />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:industry" element={<Movies />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App