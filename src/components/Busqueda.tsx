import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

const API_KEY = '228a5c0f55d3caa8bc190520d6246048';
const TMDB_URL = 'https://api.themoviedb.org/3/search/movie';

const Busqueda: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Obtener el término de búsqueda desde la query string
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('query');

  useEffect(() => {
    if (query) {
      setLoading(true);
      setError('');
      axios
        .get(`${TMDB_URL}?api_key=${API_KEY}&query=${query}`)
        .then((response) => {
          setMovies(response.data.results);
          setLoading(false);
        })
        .catch(() => {
          setError('Hubo un error al cargar los resultados de búsqueda.');
          setLoading(false);
        });
    }
  }, [query]);

  return (
    <div className="p-4 bg-black min-h-screen">
      <h2 className="text-white text-3xl font-semibold text-center mt-16 mb-16">
        Resultados de la búsqueda
      </h2>
      {/* Mostrar carga */}
      {loading && (
        <div className="flex justify-center items-center h-[400px]">
          <p className="text-white text-xl font-semibold">Cargando...</p>
        </div>
      )}

      {/* Mostrar error */}
      {error && (
        <div className="flex justify-center items-center h-[400px]">
          <p className="text-white text-xl font-semibold">{error}</p>
        </div>
      )}

      {/* Mostrar resultados */}
      {!loading && !error && movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <Link key={movie.id} to={`/detalles/${movie.id}`} className="relative group flex flex-col items-center">
              <div className="relative">
                <img
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  alt={movie.title}
                  className="w-[300px] h-[450px] object-cover rounded-md shadow-lg transition-all duration-300 group-hover:border-4 group-hover:border-white"
                />
                {/* Botón centrado en la card */}
                <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-6 py-3 bg-white text-black text-sm font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Más información
                </button>
              </div>
              {/* Título de la película */}
              <h3 className="text-white text-lg font-semibold mt-2 text-center">
                {movie.title}
              </h3>
            </Link>
          ))}
        </div>
      ) : (
        !loading &&
        !error && (
          <div className="flex justify-center items-center h-[400px]">
            <p className="text-white text-xl font-semibold">No se encontraron resultados</p>
          </div>
        )
      )}
    </div>
  );
};

export default Busqueda;
