import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getMovies, INITIAL_RENTALS } from '../constants';
import { useAuth } from '../context/AuthContext.jsx';

const MovieDetails = () => {
  const params = useParams();
  const id = params.id;
  const movie = getMovies().find(m => String(m.id) === String(id));

  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);

  if (!movie) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-primary px-4">
        <h2 className="text-3xl font-black mb-4 text-center">Filme não encontrado</h2>
        <p className="text-gray-600 mb-8 text-center">O filme que você está procurando não existe ou foi removido.</p>
        <Link 
          to="/catalog" 
          className="bg-primary hover:bg-primaryHover text-white px-8 py-3 rounded-lg transition-colors font-bold uppercase tracking-wide"
        >
          Voltar ao Catálogo
        </Link>
      </div>
    );
  }

  const handleRent = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (isAdmin) {
      // admins go to the management page
      navigate('/rentals', { state: { movieTitle: movie.title } });
      return;
    }

    // normal user: create rental directly and show success modal
    try {
      const stored = JSON.parse(localStorage.getItem('locadora_rentals')) || (INITIAL_RENTALS || []);
      const newRental = {
        id: Date.now().toString(),
        customerName: user.username || 'Desconhecido',
        movieTitle: movie.title,
        rentDate: new Date().toISOString().split('T')[0],
        returnDate: '',
        status: 'Ativo'
      };
      const next = [...stored, newRental];
      localStorage.setItem('locadora_rentals', JSON.stringify(next));
      setShowSuccess(true);
    } catch (e) {
      // fallback: still navigate to rentals form if something fails
      navigate('/rentals', { state: { movieTitle: movie.title } });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link 
        to="/catalog" 
        className="inline-flex items-center text-primary/60 hover:text-accent mb-8 transition-colors group font-bold"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Voltar para o Catálogo
      </Link>

      <div className="bg-surface rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 border border-white">
        <div className="md:flex">
          {/* Seção de Imagem */}
          <div className="md:w-1/3 lg:w-1/4 relative">
             <div className="h-full w-full aspect-[2/3] md:aspect-auto relative bg-gray-100">
                <img
                  src={movie.imageUrl}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
             </div>
          </div>

          {/* Seção de Detalhes */}
          <div className="md:w-2/3 lg:w-3/4 p-8 md:p-12 flex flex-col">
            <div className="mb-6">
               <div className="flex flex-wrap items-center gap-3 mb-4 text-sm font-bold tracking-wide uppercase">
                 <span className="bg-primary/10 text-primary px-3 py-1 rounded-md">{movie.category}</span>
                 <span className="text-gray-500 border-2 border-gray-200 px-3 py-1 rounded-md">{movie.year}</span>
                 {!movie.available && (
                   <span className="bg-accent/10 text-accent border border-accent/20 px-3 py-1 rounded-md">Indisponível</span>
                 )}
               </div>
               <h1 className="text-4xl md:text-6xl font-black text-primary mb-4 leading-none tracking-tighter drop-shadow-sm">{movie.title}</h1>
               <div className="flex items-center gap-2 mb-8 bg-secondary/50 inline-flex px-4 py-2 rounded-full">
                 <span className="text-highlight text-2xl drop-shadow-sm">★</span>
                 <span className="text-2xl font-black text-primary">{movie.rating.toFixed(1)}</span>
                 <span className="text-primary/40 text-sm font-bold">/ 5.0</span>
               </div>
            </div>

            <div className="mb-12">
              <h3 className="text-sm font-black text-accent mb-3 uppercase tracking-widest border-b-2 border-accent/10 inline-block pb-1">Sinopse</h3>
              <p className="text-gray-700 text-lg leading-relaxed font-medium">
                {movie.description}
              </p>
            </div>

            <div className="mt-auto pt-8 border-t-2 border-gray-100 flex flex-col sm:flex-row gap-4 items-center">
               {movie.available ? (
                 <button
                   onClick={handleRent}
                   className="w-full sm:w-auto bg-accent hover:bg-accentHover text-white text-center font-black py-4 px-10 rounded-lg shadow-[0_4px_0_rgb(174,86,19)] hover:shadow-[0_2px_0_rgb(174,86,19)] hover:translate-y-[2px] transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-lg"
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                     <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                     <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                   </svg>
                   Alugar Agora
                 </button>
               ) : (
                 <button disabled className="w-full sm:w-auto bg-gray-200 text-gray-400 font-bold py-4 px-10 rounded-lg cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-wide">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                   </svg>
                   Indisponível
                 </button>
               )}
              {/* ID do filme oculto na interface conforme requisito do projeto */}
            </div>
          </div>
        </div>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg p-8 max-w-sm w-full text-center">
            <h3 className="text-xl font-black text-primary mb-4">Filme alugado com sucesso</h3>
            <p className="text-gray-600 mb-6">A sua locação foi registrada. Você pode visualizar na página de Gestão quando um administrador estiver acessando, ou aguardar confirmação.</p>
            <div className="flex justify-center">
              <button onClick={() => setShowSuccess(false)} className="bg-accent text-white px-6 py-2 rounded-lg font-bold">Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovies } from '../constants';

const MovieDetails = () => {
  const params = useParams();
  const id = params.id;
  const movie = getMovies().find(m => String(m.id) === String(id));

  if (!movie) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-primary px-4">
        <h2 className="text-3xl font-black mb-4 text-center">Filme não encontrado</h2>
        <p className="text-gray-600 mb-8 text-center">O filme que você está procurando não existe ou foi removido.</p>
        <Link 
          to="/catalog" 
          className="bg-primary hover:bg-primaryHover text-white px-8 py-3 rounded-lg transition-colors font-bold uppercase tracking-wide"
        >
          Voltar ao Catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link 
        to="/catalog" 
        className="inline-flex items-center text-primary/60 hover:text-accent mb-8 transition-colors group font-bold"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Voltar para o Catálogo
      </Link>

      <div className="bg-surface rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 border border-white">
        <div className="md:flex">
          {/* Seção de Imagem */}
          <div className="md:w-1/3 lg:w-1/4 relative">
             <div className="h-full w-full aspect-[2/3] md:aspect-auto relative bg-gray-100">
                <img
                  src={movie.imageUrl}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
             </div>
          </div>

          {/* Seção de Detalhes */}
          <div className="md:w-2/3 lg:w-3/4 p-8 md:p-12 flex flex-col">
            <div className="mb-6">
               <div className="flex flex-wrap items-center gap-3 mb-4 text-sm font-bold tracking-wide uppercase">
                 <span className="bg-primary/10 text-primary px-3 py-1 rounded-md">{movie.category}</span>
                 <span className="text-gray-500 border-2 border-gray-200 px-3 py-1 rounded-md">{movie.year}</span>
                 {!movie.available && (
                   <span className="bg-accent/10 text-accent border border-accent/20 px-3 py-1 rounded-md">Indisponível</span>
                 )}
               </div>
               <h1 className="text-4xl md:text-6xl font-black text-primary mb-4 leading-none tracking-tighter drop-shadow-sm">{movie.title}</h1>
               <div className="flex items-center gap-2 mb-8 bg-secondary/50 inline-flex px-4 py-2 rounded-full">
                 <span className="text-highlight text-2xl drop-shadow-sm">★</span>
                 <span className="text-2xl font-black text-primary">{movie.rating.toFixed(1)}</span>
                 <span className="text-primary/40 text-sm font-bold">/ 5.0</span>
               </div>
            </div>

            <div className="mb-12">
              <h3 className="text-sm font-black text-accent mb-3 uppercase tracking-widest border-b-2 border-accent/10 inline-block pb-1">Sinopse</h3>
              <p className="text-gray-700 text-lg leading-relaxed font-medium">
                {movie.description}
              </p>
            </div>

            <div className="mt-auto pt-8 border-t-2 border-gray-100 flex flex-col sm:flex-row gap-4 items-center">
              const navigate = useNavigate();
              const { user, isAdmin } = useAuth();
              const [showSuccess, setShowSuccess] = useState(false);

              const handleRent = () => {
                if (!user) {
                  navigate('/login');
                  return;
                }

                if (isAdmin) {
                  // admins go to the management page
                  navigate('/rentals', { state: { movieTitle: movie.title } });
                  return;
                }

                // normal user: create rental directly and show success modal
                try {
                  const stored = JSON.parse(localStorage.getItem('locadora_rentals')) || (INITIAL_RENTALS || []);
                  const newRental = {
                    id: Date.now().toString(),
                    customerName: user.username || 'Desconhecido',
                    movieTitle: movie.title,
                    rentDate: new Date().toISOString().split('T')[0],
                    returnDate: '',
                    status: 'Ativo'
                  };
                  const next = [...stored, newRental];
                  localStorage.setItem('locadora_rentals', JSON.stringify(next));
                  setShowSuccess(true);
                } catch (e) {
                  // fallback: still navigate to rentals form if something fails
                  navigate('/rentals', { state: { movieTitle: movie.title } });
                }
              };

               {movie.available ? (
                <button
                  onClick={handleRent}
                  className="w-full sm:w-auto bg-accent hover:bg-accentHover text-white text-center font-black py-4 px-10 rounded-lg shadow-[0_4px_0_rgb(174,86,19)] hover:shadow-[0_2px_0_rgb(174,86,19)] hover:translate-y-[2px] transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                  </svg>
                  Alugar Agora
                </button>
               ) : (
                 <button disabled className="w-full sm:w-auto bg-gray-200 text-gray-400 font-bold py-4 px-10 rounded-lg cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-wide">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                   </svg>
                   Indisponível
                 </button>
               )}
              {/* ID do filme oculto na interface conforme requisito do projeto */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

 {showSuccess && (
   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
     <div className="bg-white rounded-lg p-8 max-w-sm w-full text-center">
       <h3 className="text-xl font-black text-primary mb-4">Filme alugado com sucesso</h3>
       <p className="text-gray-600 mb-6">A sua locação foi registrada. Você pode visualizar na página de Gestão quando um administrador estiver acessando, ou aguardar confirmação.</p>
       <div className="flex justify-center">
         <button onClick={() => setShowSuccess(false)} className="bg-accent text-white px-6 py-2 rounded-lg font-bold">Fechar</button>
       </div>
     </div>
   </div>
 )}
export default MovieDetails;