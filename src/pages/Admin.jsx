import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getMovies, addMovie, updateMovie, deleteMovie, restoreMovie } from '../constants';

const Admin = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: '', category: '', year: '', description: '', imageUrl: '', rating: 0, available: true });
  const [error, setError] = useState('');
  const [movies, setMovies] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [toast, setToast] = useState(null); // { message, actionText, action }
  const undoRef = useRef(null);
  const [sortBy, setSortBy] = useState('title');
  const [sortDir, setSortDir] = useState('asc');

  if (!user) {
    navigate('/login');
    return null;
  }

  if (!isAdmin) {
    navigate('/');
    return null;
  }

  useEffect(() => {
    setMovies(getMovies());
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title) {
      setError('O título é obrigatório');
      return;
    }
    const movieToSave = { ...form, rating: Number(form.rating || 0), year: Number(form.year || 0) };
    const saved = addMovie(movieToSave);
    if (saved && saved.id) {
      setMovies(getMovies());
      // limpa o formulário
      setForm({ title: '', category: '', year: '', description: '', imageUrl: '', rating: 0, available: true });
    } else {
      setError('Falha ao salvar filme');
    }
  };

  // lista derivada com pesquisa, ordenação e paginação
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return movies.filter(m => !term || (m.title || '').toLowerCase().includes(term) || (m.category || '').toLowerCase().includes(term));
  }, [movies, search]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    list.sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title, 'pt', { sensitivity: 'base' }) * (sortDir === 'asc' ? 1 : -1);
      }
      if (sortBy === 'year') {
        return ((Number(a.year) || 0) - (Number(b.year) || 0)) * (sortDir === 'asc' ? 1 : -1);
      }
      if (sortBy === 'rating') {
        return ((Number(a.rating) || 0) - (Number(b.rating) || 0)) * (sortDir === 'asc' ? 1 : -1);
      }
      return 0;
    });
    return list;
  }, [filtered, sortBy, sortDir]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, pageCount);

  const paged = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, currentPage]);

  // deriva categorias a partir dos filmes existentes para que o admin selecione categorias pré-definidas
  const categories = useMemo(() => {
    const s = new Set();
    (movies || []).forEach(m => { if (m && m.category) s.add(m.category); });
    return Array.from(s).sort();
  }, [movies]);

  useEffect(() => { if (page > pageCount) setPage(pageCount); }, [pageCount]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDir('asc');
    }
    setPage(1);
  };

  const handleEdit = (movie) => {
    setIsEditing(true);
    setEditId(movie.id);
    setForm({ title: movie.title, category: movie.category, year: movie.year, description: movie.description, imageUrl: movie.imageUrl, rating: movie.rating || 0, available: !!movie.available });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!editId) return;
    const movie = { ...form, id: String(editId), rating: Number(form.rating || 0), year: Number(form.year || 0) };
    const updated = updateMovie(movie);
    if (updated) {
      setMovies(getMovies());
      setIsEditing(false);
      setEditId(null);
      setForm({ title: '', category: '', year: '', description: '', imageUrl: '', rating: 0, available: true });
    } else {
      setError('Falha ao atualizar filme');
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este filme?')) return;
    // encontra o objeto para permitir desfazer
    const obj = movies.find(m => String(m.id) === String(id));
    const deleted = deleteMovie(id);
    if (deleted) {
      setMovies(getMovies());
      // exibe um toast com opção de desfazer
      if (undoRef.current) clearTimeout(undoRef.current);
      setToast({ message: `Filme "${deleted.title || deleted.id}" excluído.`, actionText: 'Desfazer', action: () => {
        const ok = restoreMovie(deleted);
        if (ok) setMovies(getMovies());
        setToast(null);
        if (undoRef.current) { clearTimeout(undoRef.current); undoRef.current = null; }
      }});
      // descarta automaticamente e remove a opção de desfazer após 6s
      undoRef.current = setTimeout(() => { setToast(null); undoRef.current = null; }, 6000);
    } else {
      setError('Falha ao excluir filme');
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <h1 className="text-2xl font-black mb-4">Painel do Admin — Adicionar Filme</h1>
        {error && <div className="text-red-500 font-bold mb-3">{error}</div>}
      </div>

      <div className="max-w-7xl mx-auto bg-white p-8 rounded-3xl shadow-lg">

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input name="title" value={form.title} onChange={handleChange} placeholder="Título" required className="block w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-2.5 text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            <select name="category" value={form.category} onChange={handleChange} className="block w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-2.5 text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
              <option value="">Selecione a categoria</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap gap-4">
            <input name="year" value={form.year} onChange={handleChange} placeholder="Ano" className="w-full sm:w-32 bg-white border-2 border-gray-200 rounded-lg px-4 py-2.5 text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            <input name="rating" value={form.rating} onChange={handleChange} placeholder="Nota" className="w-full sm:w-28 bg-white border-2 border-gray-200 rounded-lg px-4 py-2.5 text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
          </div>

          <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="URL da imagem" className="block w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-2.5 text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />

          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Descrição" className="block w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-3 text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all h-28" />

          <label className="flex items-center gap-2"><input type="checkbox" name="available" checked={form.available} onChange={handleChange} /> Disponível</label>

          <div className="flex gap-3">
            {isEditing ? (
              <>
                <button onClick={handleUpdate} className="bg-accent text-white px-4 py-2 rounded-full font-bold">Atualizar Filme</button>
                <button type="button" onClick={() => { setIsEditing(false); setEditId(null); setForm({ title: '', category: '', year: '', description: '', imageUrl: '', rating: 0, available: true }); }} className="bg-transparent text-gray-500 hover:underline px-3 py-1 rounded">Cancelar</button>
              </>
            ) : (
              <>
                <button type="submit" className="bg-accent text-white px-4 py-2 rounded-full font-bold">Adicionar Filme</button>
                <button type="button" onClick={() => navigate('/catalog')} className="bg-transparent text-gray-500 hover:underline px-3 py-1 rounded">Voltar ao Catálogo</button>
              </>
            )}
          </div>
        </form>

        <div className="mt-8 border-t pt-6">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Pesquisar título ou categoria..." className="block w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-2.5 text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
              </div>

              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-600">Página {currentPage} de {pageCount}</div>
                <button onClick={() => setPage(p => Math.max(1, p-1))} className="px-3 py-1 bg-transparent border rounded">Anterior</button>
                <button onClick={() => setPage(p => Math.min(pageCount, p+1))} className="px-3 py-1 bg-transparent border rounded">Próxima</button>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-5xl">
            <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-left border-collapse">
                <thead className="bg-primary text-white">
                  <tr className="text-sm uppercase tracking-wider font-bold">
                    <th className="py-4 px-4">ID</th>
                    <th className="py-4 px-4"><button onClick={() => handleSort('title')} className="flex items-center gap-2 bg-transparent px-2 py-1 rounded hover:text-accent focus:outline-none">Título{sortBy === 'title' && (sortDir === 'asc' ? '▲' : '▼')}</button></th>
                    <th className="py-4 px-4">Categoria</th>
                    <th className="py-4 px-4"><button onClick={() => handleSort('year')} className="flex items-center gap-2 bg-transparent px-2 py-1 rounded hover:text-accent focus:outline-none">Ano{sortBy === 'year' && (sortDir === 'asc' ? '▲' : '▼')}</button></th>
                    <th className="py-4 px-4"><button onClick={() => handleSort('rating')} className="flex items-center gap-2 bg-transparent px-2 py-1 rounded hover:text-accent focus:outline-none">Nota{sortBy === 'rating' && (sortDir === 'asc' ? '▲' : '▼')}</button></th>
                    <th className="py-4 px-4">Disponível</th>
                    <th className="py-4 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {paged.map(m => (
                    <tr key={m.id} className="hover:bg-secondary/30 transition">
                      <td className="py-3 px-4 font-mono text-sm text-gray-700">{m.id}</td>
                      <td className="py-3 px-4 font-bold text-primary">{m.title}</td>
                      <td className="py-3 px-4 text-gray-600">{m.category}</td>
                      <td className="py-3 px-4 text-gray-600">{m.year}</td>
                      <td className="py-3 px-4 text-gray-600">{m.rating}</td>
                      <td className="py-3 px-4">{m.available ? 'Sim' : 'Não'}</td>
                      <td className="py-3 px-4 text-right space-x-3">
                        <button onClick={() => handleEdit(m)} className="text-primary hover:text-accent font-semibold transition text-sm bg-transparent p-0 border-0 rounded-none focus:outline-none">Editar</button>
                        <button onClick={() => handleDelete(m.id)} className="text-gray-400 hover:text-accent font-semibold transition text-sm bg-transparent p-0 border-0 rounded-none focus:outline-none ml-3">Excluir</button>
                      </td>
                    </tr>
                  ))}
                  {paged.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-gray-400 font-medium">Nenhum filme cadastrado.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-4">
              {paged.map(m => (
                <div key={m.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                  <div className="flex items-start gap-4">
                    {m.imageUrl ? <img src={m.imageUrl} alt={m.title} className="w-20 h-28 object-cover rounded" /> : <div className="w-20 h-28 bg-gray-100 rounded" />}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-primary">{m.title}</h3>
                        <div className="text-sm text-gray-500 font-mono">ID {m.id}</div>
                      </div>
                      <p className="text-sm text-gray-600">{m.category} • {m.year}</p>
                      <p className="text-sm text-gray-700 mt-2 line-clamp-3">{m.description}</p>
                      <div className="mt-3 flex items-center gap-3">
                        <div className="text-sm text-gray-600">Nota: <span className="font-bold">{m.rating}</span></div>
                        <div className="text-sm">{m.available ? <span className="text-green-600 font-bold">Disponível</span> : <span className="text-red-600 font-bold">Indisponível</span>}</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end gap-3">
                    <button onClick={() => handleEdit(m)} className="text-primary hover:text-accent font-semibold">Editar</button>
                    <button onClick={() => handleDelete(m.id)} className="text-gray-400 hover:text-accent font-semibold">Excluir</button>
                  </div>
                </div>
              ))}
              {paged.length === 0 && <div className="py-12 text-center text-gray-400 font-medium">Nenhum filme cadastrado.</div>}
            </div>
          </div>

          {/* Toast */}
          {toast && (
            <div className="fixed bottom-6 right-6 bg-black/90 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-4">
              <div>{toast.message}</div>
              {toast.action && <button onClick={toast.action} className="underline font-bold">{toast.actionText}</button>}
              <button onClick={() => { setToast(null); if (undoRef.current) { clearTimeout(undoRef.current); undoRef.current = null; } }} className="ml-4 text-gray-300">Fechar</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
