import React from 'react';
import { Link } from 'react-router-dom';
import { getMovies } from '../constants';
import MovieCard from '../components/MovieCard/MovieCard.jsx';

const Home = () => {
  // Mostra apenas os primeiros 4 filmes como destaque
  const featuredMovies = getMovies().slice(0, 4);

  return (
    <div className="space-y-12 pb-12">
      {/* Seção Hero */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden border-b-8 border-accent">
        <div className="absolute inset-0 bg-primary/80 z-10 mix-blend-multiply"></div>
        <img 
          src="https://i.ibb.co/G344r9Pr/unnamed-3.jpg" 
          alt="Fundo Hero" 
          className="absolute inset-0 w-full h-full object-cover grayscale opacity-60"
        />
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black text-secondary mb-6 drop-shadow-lg uppercase tracking-tight transform -rotate-1">
            Filmes <span className="text-highlight">Ilimitados</span>
          </h1>
          <p className="text-xl md:text-2xl text-secondary/90 mb-8 font-medium max-w-2xl mx-auto">
            Alugue seus clássicos favoritos e sucessos modernos hoje.
          </p>
          <div className="bg-secondary/10 backdrop-blur-sm p-4 rounded-xl inline-block mb-8 border border-secondary/20">
            <p className="text-secondary font-bold text-lg">A partir de apenas <span className="text-highlight text-2xl">R$ 5,90</span></p>
          </div>
          <div className="block">
            <Link 
              to="/catalog"
              className="group relative inline-flex items-center gap-3 bg-accent text-white text-lg font-black py-5 px-12 rounded-full shadow-lg shadow-accent/30 hover:shadow-2xl hover:shadow-accent/50 hover:-translate-y-1 hover:bg-accentHover transition-all duration-300 uppercase tracking-widest border border-white/20"
            >
              <span className="relative z-10">Ver Catálogo</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 relative z-10 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Seção em Destaque */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8 border-b-2 border-primary/10 pb-4">
          <h2 className="text-4xl font-black text-primary uppercase tracking-tighter">Em Alta</h2>
          <Link to="/catalog" className="text-accent hover:text-primary transition font-bold text-sm uppercase tracking-wide flex items-center gap-1">
            Ver Todos 
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featuredMovies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      {/* Seção Promocional */}
      <section className="bg-primary py-16 transform -skew-y-2 mt-10 mb-10 border-y-8 border-highlight">
        <div className="max-w-7xl mx-auto px-4 text-center transform skew-y-2">
          <h2 className="text-3xl md:text-4xl font-black mb-4 text-secondary uppercase">Junte-se ao Clube</h2>
          <p className="text-blue-100 max-w-2xl mx-auto mb-8 text-lg">
            Cadastre-se para nossa assinatura premium e ganhe <span className="text-highlight font-bold">50% de desconto</span> em todas as locações às terças-feiras. 
            Sem multas por atraso, nunca.
          </p>
          <Link to="/register" className="bg-secondary text-primary hover:bg-highlight hover:text-primary font-black py-3 px-8 rounded-lg transition-colors uppercase tracking-wider shadow-lg inline-block">
            Saiba Mais
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;