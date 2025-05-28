import React from 'react';
import { useMovies } from '../contexts/MovieContext';
import { SortOption } from '../types/movie';
import { Button } from './Button';
import { SlidersHorizontal, X } from 'lucide-react';

export const FilterBar: React.FC = () => {
  const { 
    filterOptions, 
    updateFilters, 
    availableGenres, 
    availableYears 
  } = useMovies();
  
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(false);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFilters({ sortBy: e.target.value as SortOption });
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFilters({ genre: e.target.value });
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFilters({ year: e.target.value });
  };

  const handleRatingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFilters({ rating: e.target.value });
  };

  const resetFilters = () => {
    updateFilters({
      genre: 'all',
      year: 'all',
      rating: 'all',
    });
  };

  const hasActiveFilters = filterOptions.genre !== 'all' || 
                          filterOptions.year !== 'all' || 
                          filterOptions.rating !== 'all';

  return (
    <div className="bg-background-card rounded-lg p-4 mb-6 border border-gray-800">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold mb-2 md:mb-0">Movies</h2>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 md:flex-none">
            <select
              value={filterOptions.sortBy}
              onChange={handleSortChange}
              className="input py-1.5 text-sm w-full md:w-auto"
            >
              <option value="popularity">Sort by Popularity</option>
              <option value="rating">Sort by Rating</option>
              <option value="releaseDate">Sort by Release Date</option>
              <option value="title">Sort by Title</option>
            </select>
          </div>

          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="flex items-center"
          >
            <SlidersHorizontal className="h-4 w-4 mr-1" />
            Filters
            {hasActiveFilters && (
              <span className="ml-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {(filterOptions.genre !== 'all' ? 1 : 0) +
                 (filterOptions.year !== 'all' ? 1 : 0) +
                 (filterOptions.rating !== 'all' ? 1 : 0)}
              </span>
            )}
          </Button>
        </div>
      </div>

      {isFiltersOpen && (
        <div className="mt-4 pt-4 border-t border-gray-800 grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-up">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Genre</label>
            <select
              value={filterOptions.genre}
              onChange={handleGenreChange}
              className="input py-1.5 text-sm"
            >
              <option value="all">All Genres</option>
              {availableGenres.map(genre => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Release Year</label>
            <select
              value={filterOptions.year}
              onChange={handleYearChange}
              className="input py-1.5 text-sm"
            >
              <option value="all">All Years</option>
              {availableYears.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Minimum Rating</label>
            <select
              value={filterOptions.rating}
              onChange={handleRatingChange}
              className="input py-1.5 text-sm"
            >
              <option value="all">Any Rating</option>
              <option value="9">9+ ⭐</option>
              <option value="8">8+ ⭐</option>
              <option value="7">7+ ⭐</option>
              <option value="6">6+ ⭐</option>
              <option value="5">5+ ⭐</option>
            </select>
          </div>
          
          {hasActiveFilters && (
            <div className="md:col-span-3 flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={resetFilters}
                className="flex items-center"
              >
                <X className="h-4 w-4 mr-1" />
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};