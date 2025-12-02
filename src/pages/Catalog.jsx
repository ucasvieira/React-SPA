import React, { useState, useMemo } from 'react';
import { getMovies } from '../constants';
import MovieCard from '../components/MovieCard/MovieCard.jsx';

const Catalog = () => {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Lógica de filtro
  const movies = getMovies();
  const sortedMovies = useMemo(() => {
    try {
      return [...movies].sort((a, b) => a.title.localeCompare(b.title, 'pt', { sensitivity: 'base' }));
    } catch (e) {
      return [...movies];
    }
  }, [movies]);

  const filteredMovies = useMemo(() => {
    return sortedMovies.filter(movie => {
      const matchesCategory = selectedCategory === 'Todos' || movie.category === selectedCategory;
      const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm, sortedMovies]);

  // deriva categorias dinamicamente a partir dos filmes (mantém comportamento sem arquivo de tipos)
  const categories = useMemo(() => {
    const set = new Set();
    sortedMovies.forEach(m => set.add(m.category));
    return ['Todos', ...Array.from(set)];
  }, [sortedMovies]);

  const clearFilters = () => {
    setSelectedCategory('Todos');
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero / Header Section */}
      <div className="bg-primary relative overflow-hidden pb-32 pt-16 shadow-xl">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-primaryHover rounded-full opacity-50 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-[#1a559e] rounded-full opacity-30 blur-2xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
           <h1 className="text-5xl md:text-6xl font-black text-white mb-4 uppercase tracking-tighter drop-shadow-md">
             Nosso <span className="text-highlight">Catálogo</span>
           </h1>
           <p className="text-blue-200 font-medium text-lg max-w-2xl mx-auto leading-relaxed">
             Explore nossa coleção curada de clássicos atemporais e sucessos modernos.
           </p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-30 w-full mb-12">
        <div className="bg-white rounded-3xl shadow-xl shadow-primary/20 p-6 md:p-8 border-2 border-gray-100 flex flex-col gap-8">
            
            {/* Campo de busca - centralizado */}
            <div className="w-full max-w-2xl mx-auto relative group">
               <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none z-10">
                  <svg className="h-6 w-6 text-gray-400 group-focus-within:text-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
               </div>
               <input 
                  type="text" 
                  placeholder="Busque por título do filme..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-full text-primary font-bold placeholder-gray-400 focus:outline-none focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/10 transition-all shadow-inner hover:border-gray-300 h-full text-lg"
               />
               {searchTerm && (
                 <button 
                   onClick={() => setSearchTerm('')}
                   className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-red-500 transition-colors"
                 >
                   <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                   </svg>
                 </button>
               )}
            </div>

            {/* Chips de categoria - lista horizontal */}
            <div>
              <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-6 py-3 rounded-xl font-black text-sm uppercase tracking-wide transition-all duration-300 border-2 relative overflow-hidden group ${
                      selectedCategory === cat
                        ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30 transform -translate-y-1'
                        : 'bg-white text-gray-500 border-gray-200 hover:border-accent hover:text-accent hover:shadow-md'
                    }`}
                  >
                    <span className="relative z-10">{cat === 'Todos' ? 'Todas' : cat}</span>
                    {selectedCategory !== cat && (
                      <div className="absolute inset-0 bg-orange-50 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 z-0"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
        </div>
      </div>

      {/* Grade do conteúdo principal */}
      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-20">
         {/* Contador de resultados */}
         <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between border-b-2 border-gray-100 pb-4 gap-4">
            <div>
              <h2 className="text-3xl font-black text-primary uppercase tracking-tight">
                {selectedCategory === 'Todos' ? 'Todos os Filmes' : selectedCategory}
              </h2>
              <p className="text-gray-500 font-medium text-sm mt-1">
                Mostrando resultados do catálogo
              </p>
            </div>
            <div className="flex items-center gap-3">
              {(selectedCategory !== 'Todos' || searchTerm) && (
                 <button 
                    onClick={clearFilters}
                    className="text-red-500 font-bold text-sm hover:underline"
                 >
                    Limpar Filtros
                 </button>
              )}
              <span className="bg-primary text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-md">
                {filteredMovies.length} {filteredMovies.length === 1 ? 'filme' : 'filmes'}
              </span>
            </div>
         </div>

         {/* Grade de cards */}
         {filteredMovies.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {filteredMovies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200 text-center">
            <div className="bg-orange-50 rounded-full p-8 mb-6 animate-pulse">
               <svg className="h-16 w-16 text-accent/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
               </svg>
            </div>
            <h3 className="text-primary font-black text-2xl mb-2">Nenhum resultado encontrado</h3>
            <p className="text-gray-500 max-w-md mb-8 leading-relaxed font-medium">
              Não encontramos filmes para "{searchTerm}" em {selectedCategory === 'Todos' ? 'todas as categorias' : selectedCategory}.
            </p>
            <button 
               onClick={clearFilters}
               className="px-8 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primaryHover transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
               Limpar Filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;