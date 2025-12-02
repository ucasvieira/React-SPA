import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { INITIAL_RENTALS, getMovies } from '../../constants';

const RentalTable = () => {
  const location = useLocation();
  
  const [rentals, setRentals] = useState(() => {
    const savedRentals = localStorage.getItem('locadora_rentals');
    return savedRentals ? JSON.parse(savedRentals) : (INITIAL_RENTALS || []);
  });
  
  const [formData, setFormData] = useState({
    customerName: '',
    movieTitle: '',
    rentDate: '',
    returnDate: '',
    status: 'Ativo'
  });

  // autocomplete suggestions for movie titles
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const rentDateRef = useRef(null);
  const returnDateRef = useRef(null);

  useEffect(() => {
    if (location.state && location.state.movieTitle) {
      setFormData(prev => ({
        ...prev,
        movieTitle: location.state.movieTitle,
        rentDate: new Date().toISOString().split('T')[0]
      }));
    }
  }, [location]);

  const [allMovies, setAllMovies] = useState([]);
  const lastMoviesRef = useRef('');

  const loadMovies = () => {
    try {
      const list = getMovies() || [];
      const key = JSON.stringify((list || []).map(m => ({ id: m.id, title: m.title })));
      if (key !== lastMoviesRef.current) {
        lastMoviesRef.current = key;
        setAllMovies(list);
        // update suggestions if field has content
        const q = String(formData.movieTitle || '').trim().toLowerCase();
        if (q) {
          const matches = (list || []).filter(m => (m.title || '').toLowerCase().includes(q)).slice(0, 8);
          setSuggestions(matches);
          setShowSuggestions(matches.length > 0);
        }
      }
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    loadMovies();
    const onStorage = (e) => {
      if (!e.key || e.key === 'locadora_movies' || e.key === 'locadora_removed') loadMovies();
    };
    const onMoviesUpdated = () => loadMovies();
    window.addEventListener('storage', onStorage);
    window.addEventListener('movies:updated', onMoviesUpdated);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('movies:updated', onMoviesUpdated);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('locadora_rentals', JSON.stringify(rentals));
  }, [rentals]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'movieTitle') {
      const q = String(value || '').trim().toLowerCase();
      if (!q) {
        setSuggestions([]);
        setShowSuggestions(false);
      } else {
        const matches = (allMovies || []).filter(m => (m.title || '').toLowerCase().includes(q)).slice(0, 8);
        setSuggestions(matches);
        setShowSuggestions(true);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditing && editId) {
      setRentals(prev => prev.map(item => 
        item.id === editId 
        ? { ...item, ...formData } 
        : item
      ));
      setIsEditing(false);
      setEditId(null);
    } else {
      const newRental = {
        id: Date.now().toString(),
        customerName: formData.customerName || 'Desconhecido',
        movieTitle: formData.movieTitle || 'Desconhecido',
        rentDate: formData.rentDate || new Date().toISOString().split('T')[0],
        returnDate: formData.returnDate || '',
        status: formData.status || 'Ativo'
      };
      setRentals(prev => [...prev, newRental]);
    }

    setFormData({
      customerName: '',
      movieTitle: '',
      rentDate: '',
      returnDate: '',
      status: 'Ativo'
    });
  };

  const handleEdit = (rental) => {
    setIsEditing(true);
    setEditId(rental.id);
    setFormData({
      customerName: rental.customerName,
      movieTitle: rental.movieTitle,
      rentDate: rental.rentDate,
      returnDate: rental.returnDate,
      status: rental.status
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este registro?')) {
      setRentals(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <div className="bg-surface p-8 rounded-xl shadow-xl border border-gray-200">
      <div className="mb-10 bg-secondary/30 p-6 rounded-lg border border-primary/5">
        <h2 className="text-xl font-bold text-primary mb-4 pb-2 border-b-2 border-highlight inline-block">
          {isEditing ? 'Editar Locação' : 'Nova Locação'}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-primary font-bold text-sm mb-2">Nome do Cliente</label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              required
              placeholder="Ex: João Silva"
              className="w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-2.5 text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
          <div className="relative">
            <label className="block text-primary font-bold text-sm mb-2">Título do Filme</label>
            <input
              type="text"
              name="movieTitle"
              value={formData.movieTitle}
              onChange={handleInputChange}
              onFocus={() => {
                if (formData.movieTitle) setShowSuggestions(true);
              }}
              onBlur={() => {
                // delay hide so click on suggestion registers
                setTimeout(() => setShowSuggestions(false), 150);
              }}
              required
              placeholder="Ex: Matrix"
              autoComplete="off"
              className="w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-2.5 text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />

            {showSuggestions && suggestions && suggestions.length > 0 && (
              <ul className="absolute z-40 left-0 right-0 mt-1 max-h-44 overflow-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                {suggestions.map(s => (
                  <li
                    key={s.id}
                    onMouseDown={(ev) => {
                      // use onMouseDown to avoid losing focus before click
                      ev.preventDefault();
                      setFormData(prev => ({ ...prev, movieTitle: s.title }));
                      setShowSuggestions(false);
                      setSuggestions([]);
                    }}
                    className="px-4 py-2 cursor-pointer hover:bg-primary/10"
                  >
                    <div className="font-medium text-primary">{s.title}</div>
                    <div className="text-xs text-gray-500">{s.category} • {s.year}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <label className="block text-primary font-bold text-sm mb-2">Data de Locação</label>
            <div className="relative">
              <input
                ref={rentDateRef}
                type="date"
                name="rentDate"
                value={formData.rentDate}
                onChange={handleInputChange}
                required
                className="w-full bg-white border-2 border-gray-200 rounded-lg px-4 pr-10 py-2.5 text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
              <button
                type="button"
                aria-label="Abrir seletor de data"
                onClick={() => {
                  const el = rentDateRef.current;
                  if (!el) return;
                  if (typeof el.showPicker === 'function') {
                    el.showPicker();
                  } else {
                    el.focus();
                    // try to dispatch a click as a fallback
                    try { el.click(); } catch (e) {}
                  }
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 bg-transparent p-0 border-0 rounded-none focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
          <div>
            <label className="block text-primary font-bold text-sm mb-2">Data de Devolução</label>
            <div className="relative">
              <input
                ref={returnDateRef}
                type="date"
                name="returnDate"
                value={formData.returnDate}
                onChange={handleInputChange}
                className="w-full bg-white border-2 border-gray-200 rounded-lg px-4 pr-10 py-2.5 text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
              <button
                type="button"
                aria-label="Abrir seletor de data"
                onClick={() => {
                  const el = returnDateRef.current;
                  if (!el) return;
                  if (typeof el.showPicker === 'function') {
                    el.showPicker();
                  } else {
                    el.focus();
                    try { el.click(); } catch (e) {}
                  }
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 bg-transparent p-0 border-0 rounded-none focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
          <div>
            <label className="block text-primary font-bold text-sm mb-2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-2.5 text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            >
              <option value="Ativo">Ativo</option>
              <option value="Devolvido">Devolvido</option>
              <option value="Atrasado">Atrasado</option>
            </select>
          </div>
          <div className="md:col-span-2 flex justify-end gap-3 mt-4">
            {isEditing && (
              <button 
                type="button" 
                onClick={() => { setIsEditing(false); setEditId(null); setFormData({ customerName: '', movieTitle: '', rentDate: '', returnDate: '', status: 'Ativo' }); }}
                className="bg-gray-200 text-gray-700 font-bold px-6 py-3 rounded-lg hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
            )}
            <button 
              type="submit" 
              className="bg-accent text-white px-8 py-3 rounded-lg font-black uppercase tracking-wider hover:bg-accentHover transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isEditing ? 'Atualizar' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead className="bg-primary text-white">
            <tr className="text-sm uppercase tracking-wider font-bold">
              <th className="py-4 px-4">Cliente</th>
              <th className="py-4 px-4">Filme</th>
              <th className="py-4 px-4">Data Locação</th>
              <th className="py-4 px-4">Data Devolução</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 px-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {rentals.map((rental) => (
              <tr key={rental.id} className="hover:bg-secondary/30 transition">
                <td className="py-4 px-4 font-medium text-gray-800">{rental.customerName}</td>
                <td className="py-4 px-4 text-primary font-bold">{rental.movieTitle}</td>
                <td className="py-4 px-4 text-gray-600">{rental.rentDate}</td>
                <td className="py-4 px-4 text-gray-600">{rental.returnDate || '-'}</td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide
                    ${rental.status === 'Ativo' ? 'bg-blue-100 text-primary border border-blue-200' : 
                      rental.status === 'Atrasado' ? 'bg-red-100 text-accent border border-red-200' : 
                      'bg-green-100 text-green-700 border border-green-200'}`}>
                    {rental.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-right space-x-3">
                  <button 
                    onClick={() => handleEdit(rental)}
                    className="text-primary hover:text-accent font-semibold transition text-sm bg-transparent p-0 border-0 rounded-none focus:outline-none"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(rental.id)}
                    className="text-gray-400 hover:text-accent font-semibold transition text-sm bg-transparent p-0 border-0 rounded-none focus:outline-none ml-3"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
            {rentals.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-gray-400 font-medium">
                  Nenhuma locação encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RentalTable;
