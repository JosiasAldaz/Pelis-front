// CREDENCIALES DE LA API DE THE MOVIE DATABASE Y LA URL BASE


export const TMDB_API_KEY = '228a5c0f55d3caa8bc190520d6246048';
export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export const getMovieDetailsUrl = (id: string, language: string = 'es-ES') => 
  `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&language=${language}`;
