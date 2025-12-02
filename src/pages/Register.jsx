import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Register = () => {
  const { register, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // password strength removed per request

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!username || !password || !confirm) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }
    if (password !== confirm) {
      setError('Senhas não conferem');
      return;
    }
    // No password strength enforcement (project scope)

    try {
      const desiredRole = isAdmin ? role : 'user';
      const res = await register(username.trim(), password, desiredRole);
      if (!res.ok) {
        setError(res.error || 'Erro ao registrar');
        return;
      }
      setSuccess('Usuário criado com sucesso');
      setShowModal(true);
    } catch (err) {
      setError('Erro ao registrar usuário');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-lg">
        <h1 className="text-3xl font-black mb-4 text-primary">Cadastro de Conta</h1>
        <p className="text-sm text-gray-500 mb-6">Crie uma conta para acessar recursos adicionais do sistema.</p>
        <div>
          <form onSubmit={handleSubmit}>
            <label className="block mb-2 font-semibold">Nome de usuário</label>
            <input value={username} onChange={e => setUsername(e.target.value)} className="mt-1 block w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-2.5 text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all mb-4" />

            <label className="block mb-2 font-semibold">Senha</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-2.5 text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all mb-4" />

            <label className="block mb-2 font-semibold">Confirmar senha</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} className="mt-1 block w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-2.5 text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all mb-4" />

            {isAdmin ? (
              <>
                <label className="block mb-2 font-semibold">Função</label>
                <select value={role} onChange={e => setRole(e.target.value)} className="w-full mb-4 p-3 border rounded-md bg-white">
                  <option value="user">Usuário</option>
                  <option value="admin">Administrador</option>
                </select>
              </>
            ) : null}

            {error && <div className="text-red-500 font-bold mb-3">{error}</div>}
            {success && <div className="text-green-600 font-bold mb-3">{success}</div>}

            <div className="flex items-center justify-between">
              <button type="submit" className="bg-accent text-white px-4 py-2 rounded-full font-bold">Criar conta</button>
              <button type="button" onClick={() => navigate('/')} className="bg-transparent text-gray-500 hover:underline px-3 py-1 rounded">Cancelar</button>
            </div>
            <div className="mt-4 text-sm text-center">
              <span>Já tem conta? </span>
              <Link to="/login" className="text-primary font-semibold hover:underline">Entrar</Link>
            </div>
          </form>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full">
            <h3 className="text-lg font-bold mb-3">Conta criada</h3>
            <p className="mb-4">A conta foi criada com sucesso. Você será redirecionado para a tela de login.</p>
            <div className="flex justify-end">
              <button className="px-4 py-2 rounded bg-primary text-white" onClick={() => { setShowModal(false); navigate('/login'); }}>Ir para login</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
