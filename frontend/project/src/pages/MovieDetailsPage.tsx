import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useMovies } from '../contexts/MovieContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { ArrowLeft, Calendar, Clock, Star, User } from 'lucide-react';

export const MovieDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getMovieById, isLoading } = useMovies();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Format minutes to hours and minutes
  const formatRuntime = (minutes?: number): string => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  // Redirect if user is not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Don't render anything while redirecting
  }

  const movie = id ? getMovieById(parseInt(id, 10)) : undefined;

  if (isLoading) {
    return (
      <div className="container-custom py-10 flex justify-center">
        <div className="animate-pulse w-full max-w-4xl">
          <div className="h-64 bg-background-light rounded-lg mb-6"></div>
          <div className="h-8 bg-background-light rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-background-light rounded w-1/4 mb-8"></div>
          <div className="h-4 bg-background-light rounded w-full mb-2"></div>
          <div className="h-4 bg-background-light rounded w-full mb-2"></div>
          <div className="h-4 bg-background-light rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container-custom py-10">
        <div className="bg-background-card border border-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-xl font-semibold text-white mb-4">Movie not found</h2>
          <p className="text-gray-400 mb-6">The movie you're looking for doesn't exist or has been removed.</p>
          <Link to="/">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Movies
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="relative h-[300px] md:h-[400px] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={movie.backdropUrl} 
            alt={movie.title}
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/80 to-transparent"></div>
        </div>
        <div className="container-custom relative h-full flex items-end pb-6">
          <Link to="/" className="absolute top-6 left-4 bg-background-dark/50 hover:bg-background-dark/80 p-2 rounded-full transition-colors">
            <ArrowLeft className="h-5 w-5 text-white" />
          </Link>
        </div>
      </div>

      <div className="container-custom py-6">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3 lg:w-1/4 flex-shrink-0">
            <div className="rounded-lg overflow-hidden shadow-lg transform md:-mt-32 relative z-10 border-4 border-background-dark">
              <img 
                src={movie.posterUrl} 
                alt={movie.title}
                className="w-full h-auto" 
              />
            </div>
          </div>
          
          <div className="md:w-2/3 lg:w-3/4">
            <h1 className="text-3xl font-bold text-white mb-2">{movie.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                <span className="font-medium text-white">{movie.rating.toFixed(1)}</span>
                <span className="text-gray-500 ml-1">/10</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{new Date(movie.releaseDate).getFullYear()}</span>
              </div>
              {movie.runtime && (
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{formatRuntime(movie.runtime)}</span>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres.map((genre, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-background-light rounded-full text-sm"
                >
                  {genre}
                </span>
              ))}
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Overview</h2>
              <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
            </div>
            
            {(movie.director || movie.cast) && (
              <div className="border-t border-gray-800 pt-6">
                {movie.director && (
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold mb-2 flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Director
                    </h2>
                    <p className="text-gray-300">{movie.director}</p>
                  </div>
                )}
                
                {movie.cast && movie.cast.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold mb-2">Cast</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {movie.cast.map((actor, index) => (
                        <div key={index} className="bg-background-light p-2 rounded">
                          {actor}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};