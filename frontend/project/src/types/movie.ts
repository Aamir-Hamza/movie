export interface Movie {
  id: number;
  title: string;
  posterUrl: string;
  backdropUrl: string;
  releaseDate: string;
  rating: number;
  overview: string;
  genres: string[];
  runtime?: number;
  director?: string;
  cast?: string[];
}

export interface FilterOptions {
  genre: string;
  year: string;
  rating: string;
  sortBy: SortOption;
}

export type SortOption = 'popularity' | 'rating' | 'releaseDate' | 'title';

export interface User {
  id: string;
  email: string;
  name: string;
}