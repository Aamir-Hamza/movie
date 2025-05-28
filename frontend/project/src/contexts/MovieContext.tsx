import React, { createContext, useContext, useState, useEffect } from 'react';
import { Movie, FilterOptions, SortOption } from '../types/movie';
import { mockMovies } from '../data/mockMovies';

interface MovieContextType {
  movies: Movie[];
  filteredMovies: Movie[];
  isLoading: boolean;
  error: string | null;
  filterOptions: FilterOptions;
  updateFilters: (newFilters: Partial<FilterOptions>) => void;
  getMovieById: (id: number) => Movie | undefined;
  availableGenres: string[];
  availableYears: string[];
}

const initialFilterOptions: FilterOptions = {
  genre: 'all',
  year: 'all',
  rating: 'all',
  sortBy: 'popularity',
};

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>(initialFilterOptions);
  const [availableGenres, setAvailableGenres] = useState<string[]>([]);
  const [availableYears, setAvailableYears] = useState<string[]>([]);

  useEffect(() => {
    // Simulate API fetch
    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setMovies(mockMovies);
        
        // Extract available genres and years for filters
        const genres = new Set<string>();
        const years = new Set<string>();
        
        mockMovies.forEach(movie => {
          movie.genres.forEach(genre => genres.add(genre));
          const year = new Date(movie.releaseDate).getFullYear().toString();
          years.add(year);
        });
        
        setAvailableGenres(Array.from(genres).sort());
        setAvailableYears(Array.from(years).sort((a, b) => b.localeCompare(a)));
        
        setIsLoading(false);
      } catch (error) {
        setError('Failed to fetch movies');
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    // Apply filters and sorting whenever movies or filter options change
    if (movies.length === 0) return;

    let result = [...movies];

    // Filter by genre
    if (filterOptions.genre !== 'all') {
      result = result.filter(movie => 
        movie.genres.includes(filterOptions.genre)
      );
    }

    // Filter by year
    if (filterOptions.year !== 'all') {
      result = result.filter(movie => {
        const movieYear = new Date(movie.releaseDate).getFullYear().toString();
        return movieYear === filterOptions.year;
      });
    }

    // Filter by rating
    if (filterOptions.rating !== 'all') {
      const minRating = parseInt(filterOptions.rating, 10);
      result = result.filter(movie => movie.rating >= minRating);
    }

    // Sort results
    result = sortMovies(result, filterOptions.sortBy);

    setFilteredMovies(result);
  }, [movies, filterOptions]);

  const sortMovies = (moviesToSort: Movie[], sortOption: SortOption): Movie[] => {
    const sorted = [...moviesToSort];
    
    switch (sortOption) {
      case 'title':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'releaseDate':
        return sorted.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
      case 'popularity':
      default:
        // For simplicity, we'll use ID as a proxy for popularity in this mock
        return sorted.sort((a, b) => a.id - b.id);
    }
  };

  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    setFilterOptions(prev => ({ ...prev, ...newFilters }));
  };

  const getMovieById = (id: number): Movie | undefined => {
    return movies.find(movie => movie.id === id);
  };

  return (
    <MovieContext.Provider
      value={{
        movies,
        filteredMovies,
        isLoading,
        error,
        filterOptions,
        updateFilters,
        getMovieById,
        availableGenres,
        availableYears,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export const useMovies = (): MovieContextType => {
  const context = useContext(MovieContext);
  if (context === undefined) {
    throw new Error('useMovies must be used within a MovieProvider');
  }
  return context;
};