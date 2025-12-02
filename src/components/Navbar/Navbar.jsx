import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();

  const isActive = (path) =>
    location.pathname === path ? 'text-highlight font-black border-b-2 border-highlight' : 'text-secondary/80 hover:text-white transition-colors';

  return (
    <nav className="bg-primary sticky top-0 z-50 shadow-lg shadow-primary/20 border-b-4 border-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 group">
              <img
                src="https://i.ibb.co/HDjMWLkP/download.png"
                alt="Aluga Aí! Logo"
                className="h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-sm"
              />
            </Link>

            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-6">
                <Link to="/" className={`px-3 py-2 text-base uppercase tracking-wide transition-all ${isActive('/')}`}>Início</Link>
                <Link to="/catalog" className={`px-3 py-2 text-base uppercase tracking-wide transition-all ${isActive('/catalog')}`}>Catálogo</Link>
                {isAdmin && <Link to="/rentals" className={`px-3 py-2 text-base uppercase tracking-wide transition-all ${isActive('/rentals')}`}>Gestão</Link>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  {isAdmin && <>
                    <Link to="/users" className="text-secondary/80 hover:text-white transition-colors px-3 py-2 rounded-md">Usuários</Link>
                    <Link to="/admin" className="text-secondary/80 hover:text-white transition-colors px-3 py-2 rounded-md">Admin</Link>
                  </>}
                  <button onClick={() => { logout(); navigate('/'); }} className="text-secondary/80 hover:text-white transition-colors px-3 py-2 rounded-md">Sair</button>
                </>
              ) : (
                <Link to="/login" className="text-secondary/80 hover:text-white transition-colors px-3 py-2 rounded-md">Entrar</Link>
              )}
            </div>

            {/* Botão do menu mobile */}
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                type="button"
                className="bg-primaryHover inline-flex items-center justify-center p-2 rounded-md text-secondary hover:text-white focus:outline-none"
                aria-expanded={isMobileMenuOpen}
                aria-label="Abrir menu principal"
              >
                {!isMobileMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Menu mobile — mostra/oculta baseado no estado */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-primaryHover border-t border-accent">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-secondary hover:text-white block px-3 py-2 rounded-md text-base font-medium">Início</Link>
            <Link to="/catalog" onClick={() => setIsMobileMenuOpen(false)} className="text-secondary hover:text-white block px-3 py-2 rounded-md text-base font-medium">Catálogo</Link>
              {isAdmin && <Link to="/rentals" onClick={() => setIsMobileMenuOpen(false)} className="text-secondary hover:text-white block px-3 py-2 rounded-md text-base font-medium">Gestão</Link>}
            {user ? (
              <>
                {isAdmin && <>
                  <Link to="/users" onClick={() => setIsMobileMenuOpen(false)} className="text-secondary hover:text-white block px-3 py-2 rounded-md text-base font-medium">Usuários</Link>
                  <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-secondary hover:text-white block px-3 py-2 rounded-md text-base font-medium">Admin</Link>
                </>}
                <button onClick={() => { logout(); setIsMobileMenuOpen(false); navigate('/'); }} className="text-secondary hover:text-white block px-3 py-2 rounded-md text-base font-medium">Sair</button>
              </>
            ) : (
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-secondary hover:text-white block px-3 py-2 rounded-md text-base font-medium">Entrar</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
