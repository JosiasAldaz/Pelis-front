// interfaces que uso para recibir la información de las películas de la API

export interface Movie {
    id: number;
    title: string;
    year: number;
    popularity: number;
    description: string;
    imageUrl: string;
  }
  
  export interface TMDBMovie {
    id: number;
    title: string;
    release_date: string;
    overview: string;
    backdrop_path: string;
    popularity: number;
  }
  