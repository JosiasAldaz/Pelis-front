import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Importa el hook useNavigate

interface Movie {
  id: number;
  title: string;
  year: number;
  duration: string;
  description: string;
  imageUrl: string;
}

interface TMDBMovie {
  id: number;
  title: string;
  release_date: string;
  overview: string;
  backdrop_path: string;
}

const Carrusel_Inicial: React.FC = () => {
  const [currentMovieIndex, setCurrentMovieIndex] = useState<number>(0);
  const [movies, setMovies] = useState<Movie[]>([]);
  const navigate = useNavigate();  // Hook para la navegación

  const API_KEY = '228a5c0f55d3caa8bc190520d6246048';
  const TMDB_URL = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=es-ES&page=1`;

  useEffect(() => {
    axios.get(TMDB_URL)
      .then(response => {
        const fetchedMovies = response.data.results.map((movie: TMDBMovie) => ({
          id: movie.id,  // Guarda el ID de la película
          title: movie.title,
          year: new Date(movie.release_date).getFullYear(),
          duration: 'Duración no disponible',
          description: movie.overview,
          imageUrl: `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`,
        }));
        setMovies(fetchedMovies);
      })
      .catch(error => console.error('Error fetching movies:', error));
  }, []);

  const handleNextMovie = () => {
    console.log("Next movie clicked");
    setCurrentMovieIndex((prevIndex) => (prevIndex + 1) % movies.length);
  };

  const handlePrevMovie = () => {

    setCurrentMovieIndex((prevIndex) => (prevIndex - 1 + movies.length) % movies.length);
  };

  const verPelicula = (movieId: number) => {
    // Redirigir a la página de detalles de la película con el ID
    console.log(`ID DE LA PELÍCULA: ${movieId}`);
    navigate(`/detalles/${movieId}`);
  };

  const currentMovie = movies[currentMovieIndex];

  return (
    <div className="relative h-screen bg-black text-white">
      {currentMovie && (
        <div
          className="absolute inset-0 bg-center bg-no-repeat bg-cover opacity-60 w-full h-full"
          style={{ backgroundImage: `url(${currentMovie.imageUrl})` }}
        ></div>
      )}


      {/* Contenido */}
      <div className="relative z-10 flex flex-col h-full justify-center items-start px-8 ml-16 pl-14">
        {currentMovie && (
          <>
            <h1 className="text-4xl font-bold">{currentMovie.title}</h1>
            <p className="text-lg mt-2">
               Año:{currentMovie.year} 
            </p>
            <p className="mt-4 max-w-md">{currentMovie.description}</p>

            <div className="mt-6 flex space-x-4">
              {/* Botón "Ver ahora" */}
              <button
                className="flex items-center px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-700 transition focus:outline-none shadow-lg"
                onClick={() => verPelicula(currentMovie.id)} // Llama a la función handleWatchNow
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-6.336-4.448A1 1 0 007 7.447v9.106a1 1 0 001.416.895l6.336-4.448a1 1 0 000-1.782z" />
                </svg>
                Ver ahora
              </button>

              {/* Botón "+ Mis favoritos" */}
              
            </div>
          </>
        )}
      </div>

      {/* Botones de navegación */}
      <div className="absolute inset-y-0 left-0 flex items-center mx-4">
        <button
          onClick={handlePrevMovie}
          className="p-3 text-white bg-gray-800 bg-opacity-70 hover:bg-opacity-90 rounded-full shadow-lg transition-transform transform hover:scale-110 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div className="absolute inset-y-0 right-0 flex items-center mx-4 z-20">
        <button
          onClick={handleNextMovie}
          className="p-3 text-white bg-gray-800 bg-opacity-70 hover:bg-opacity-90 rounded-full shadow-lg transition-transform transform hover:scale-110 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Carrusel_Inicial;
