import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Movie } from '../types/movie';
import { cn } from '../utils/cn';

interface MovieCardProps {
  movie: Movie;
  className?: string;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, className }) => {
  // Format release date to show only the year
  const releaseYear = new Date(movie.releaseDate).getFullYear();

  return (
    <Link
      to={`/movie/${movie.id}`}
      className={cn(
        'card group transform transition-all duration-300 hover:-translate-y-2',
        className
      )}
    >
      <div className="relative overflow-hidden aspect-[2/3] rounded-t-lg">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <p className="text-white text-sm line-clamp-3">{movie.overview}</p>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-white group-hover:text-primary-400 transition-colors duration-200 line-clamp-1">
            {movie.title}
          </h3>
          <div className="flex items-center bg-primary-900/80 px-2 py-1 rounded-md">
            <Star className="h-3 w-3 text-yellow-400 mr-1" />
            <span className="text-xs font-medium">{movie.rating.toFixed(1)}</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-400">{releaseYear}</p>
          <div className="flex flex-wrap justify-end">
            {movie.genres.slice(0, 2).map((genre, index) => (
              <span 
                key={index} 
                className="text-xs bg-background-light rounded-full px-2 py-0.5 mr-1 mb-1"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};