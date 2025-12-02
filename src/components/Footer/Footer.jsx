import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-primary text-secondary border-t-4 border-highlight py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0 text-center md:text-left flex flex-col items-center md:items-start">
            <img 
              src="https://i.ibb.co/HDjMWLkP/download.png" 
              alt="Aluga Aí! Logo" 
              className="h-12 w-auto max-w-full object-contain mb-2 drop-shadow-sm"
            />
            <p className="text-secondary/70 text-sm mt-1 font-medium">Trazendo os clássicos de volta à vida.</p>
          </div>
          <nav className="flex flex-wrap justify-center gap-3 font-medium mt-4 md:mt-0" aria-label="Footer links">
            <Link to="/legal#privacy" className="bg-transparent text-secondary/80 px-4 py-2 rounded-2xl hover:text-highlight transition w-full sm:w-auto text-center">Privacidade</Link>
            <Link to="/legal#terms" className="bg-transparent text-secondary/80 px-4 py-2 rounded-2xl hover:text-highlight transition w-full sm:w-auto text-center">Termos de Uso</Link>
            <Link to="/legal#contract" className="bg-transparent text-secondary/80 px-4 py-2 rounded-2xl hover:text-highlight transition w-full sm:w-auto text-center">Contrato</Link>
          </nav>
        </div>
        <div className="mt-8 text-center text-secondary/50 text-xs border-t border-primaryHover pt-6">
          &copy; {new Date().getFullYear()} Aluga Aí! Ltda. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
