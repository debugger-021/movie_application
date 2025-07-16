import { useState, useEffect } from 'react'
import './App.css'
import Search from './components/Search'
import Spinner from './components/Spinner'
import MovieCard from './components/MovieCard'
import { useDebounce } from 'react-use'
import { getTrendingMovies, incSearchCount } from './appwrite'

function App() {
  const [search, setSearch] = useState('')
  const [errMessage, setErrMessage] = useState('')
  const [movies, setMovies] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [debouncedSeacrchTerm, setDebouncedSeacrchTerm] = useState('')
  const [trendingMovies, setTrendingMovies] = useState([])

  const API_BASE_URL = 'https://api.themoviedb.org/3';
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  const API_OPTIONS = {
    method: 'GET',
  };

  useDebounce(() => setDebouncedSeacrchTerm(search), 500, [search])

  useEffect(() => {
    const fetchMovie = async (query = '') => {
      setIsLoading(true)
      setErrMessage('')

      try {

        const endpoint = query ? `${API_BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
          : `${API_BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=vote_average.desc`;

        const response = await fetch(endpoint, API_OPTIONS);
        if (!response.ok) {
          throw new Error('Failed to fetch movie you asked for')
        }

        const data = await response.json();
        if (data.Response === 'False') {
          setErrMessage(data.Error || 'Failed to fetch movies');

          setMovies([])
        }

        setMovies(data.results || []);
        if (query && data.results.length > 0) await incSearchCount(query, data.results[0])

      } catch (error) {
        console.log('Error Caught: ', error);
        setErrMessage('Error fetching movies. Please try again later.')
      } finally {
        setIsLoading(false)
      }

    }

    fetchMovie(debouncedSeacrchTerm);
  }, [debouncedSeacrchTerm])

  useEffect(() => {
    const loadTrendingMovies = async () => {
      const res = await getTrendingMovies()
      setTrendingMovies(res)
      console.log(trendingMovies);
      
    }

    loadTrendingMovies()

  }, [])


  return (
    <>
      <header className='font-bold text-5xl text-white bg-cover max-h-screen mt-0' style={{ backgroundImage: "url('./hero-bg.png')" }}>
        <div className="flex justify-center">
          <img src="./hero.png" alt="preface image" />
        </div>
        <div className=' m-auto text-center whitespace-normal '>
          Find <span className="text-gradient ">Movies</span> You'll Enjoy without any Hassle
        </div>
      </header>

      <Search search={search} setSearch={setSearch} />


      {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}
      <section className="all-movies">
        <h2>All Movies</h2>

        {isLoading ?
          (<Spinner />) :
          errMessage ? (<p className='text-red-500'>{errMessage}</p>) :
            <ul>
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              )
              )}
            </ul>
        }
      </section>
    </>
  )
}

export default App
