import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(username.trim(), password);
    if (res.ok) {
      navigate('/');
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-lg">
        <h2 className="text-2xl font-black mb-4 text-primary">Entrar</h2>
        <p className="text-sm text-gray-500 mb-6">Use sua conta para acessar recursos administrativos se aplicável.</p>
        {error && <div className="text-red-500 font-bold mb-3">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Usuário</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1 block w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-2.5 text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Senha</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-2.5 text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
          </div>
          <div className="flex items-center justify-between">
            <button type="submit" className="bg-accent text-white px-4 py-2 rounded-full font-bold">Entrar</button>
            <button type="button" onClick={() => { setUsername(''); setPassword(''); setError(''); }} className="bg-transparent text-gray-500 hover:underline px-3 py-1 rounded">Limpar</button>
          </div>
        </form>
        <div className="mt-4 text-sm text-center">
          <span>Não tem uma conta? </span>
          <Link to="/register" className="text-primary font-semibold hover:underline">Crie uma</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
