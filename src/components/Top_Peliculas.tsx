import React, { useState, useEffect } from 'react';
import { Pagination, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import axios from 'axios';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

const Top_Peliculas: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const API_KEY = '228a5c0f55d3caa8bc190520d6246048';
  const TMDB_URL = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=es-ES&page=1`;

  useEffect(() => {
    axios
      .get(TMDB_URL)
      .then((response) => {
        // Solo mostrar las primeras 10 películas más vistas
        setMovies(response.data.results.slice(0, 10));
      })
      .catch((error) => {
        console.error('Error fetching top-rated movies:', error);
      });
  }, []);

  return (
    <div className="bg-black py-24">
      <h2 className="text-white text-4xl font-bold mb-10 mt-0 text-center">10 Películas más vistas</h2>
      <Swiper
        spaceBetween={0} // Reducir el espacio entre slides
        slidesPerView={4}
        pagination={{ clickable: true, dynamicBullets: true }}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        modules={[Pagination, Autoplay]}
        className="mySwiper max-w-[90%] mx-auto"
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            {/* Envolver el SwiperSlide en un Link para redirigir al componente Detalles */}
            <Link to={`/detalles/${movie.id}`}>
              <div className="relative group flex flex-col items-center cursor-pointer">
                <img
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  alt={movie.title}
                  className="w-[300px] h-[450px] object-cover rounded-md shadow-lg transition-all duration-300 group-hover:border-4 group-hover:border-white"
                />
                {/* Botón de "Más información" centrado en el slide */}
                <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-6 py-3 bg-white text-black text-sm font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Más información
                </button>
              </div>
              {/* Título de la película */}
              <h3 className="text-white text-lg font-semibold mt-2 text-center">
                {movie.title}
              </h3>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Top_Peliculas;
