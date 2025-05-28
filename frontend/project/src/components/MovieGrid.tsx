import React from 'react';
import { MovieCard } from './MovieCard';
import { useMovies } from '../contexts/MovieContext';
import { Loader } from 'lucide-react';

export const MovieGrid: React.FC = () => {
  const { filteredMovies, isLoading, error } = useMovies();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader className="w-10 h-10 text-primary-500 animate-spin mb-4" />
        <p className="text-gray-400">Loading movies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (filteredMovies.length === 0) {
    return (
      <div className="bg-background-card border border-gray-800 rounded-lg p-8 text-center">
        <p className="text-xl font-medium text-gray-400 mb-2">No movies found</p>
        <p className="text-gray-500">Try adjusting your filters to find something to watch.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {filteredMovies.map(movie => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
};