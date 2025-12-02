import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  return (
    <Link 
      to={`/movie/${movie.id}`}
      className="group relative bg-surface rounded-xl overflow-hidden shadow-lg hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300 block border-2 border-transparent hover:border-highlight h-full flex flex-col"
    >
      <div className="aspect-[2/3] w-full overflow-hidden relative">
        <img 
          src={movie.imageUrl} 
          alt={movie.title} 
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {!movie.available && (
          <div className="absolute top-2 right-2 bg-accent text-white text-xs font-bold px-2 py-1 rounded shadow-md uppercase tracking-wider">
            Indisponível
          </div>
        )}
      </div>
      <div className="p-4 flex-grow flex flex-col bg-surface">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-primary truncate pr-2 group-hover:text-accent transition-colors">{movie.title}</h3>
          <span className="bg-primary text-highlight text-xs font-bold px-1.5 py-0.5 rounded flex items-center shrink-0">
            ★ {movie.rating}
          </span>
        </div>
        <div className="flex justify-between items-center mt-2 pb-2 border-b border-gray-100">
          <p className="text-xs font-bold text-accent uppercase tracking-wide">{movie.category}</p>
          <p className="text-xs font-semibold text-gray-400">{movie.year}</p>
        </div>
        <p className="text-gray-600 text-xs mt-3 line-clamp-2 leading-relaxed">
          {movie.description}
        </p>
      </div>
    </Link>
  );
};

export default MovieCard;
