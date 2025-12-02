import React, { createContext, useContext, useEffect, useState } from 'react';
import data from '../data/conteudo.json';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('locadora_user')) || null;
    } catch (e) {
      return null;
    }
  });

  const [storedUsers, setStoredUsers] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('locadora_users')) || [];
    } catch (e) {
      return [];
    }
  });

  const getAllUsers = () => {
    const initial = data.users || [];
    return [...initial, ...storedUsers];
  };
  const genSalt = () => {
    const arr = new Uint8Array(16);
    try { window.crypto.getRandomValues(arr); } catch (e) {}
    return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const hashWithSalt = async (password, salt) => {
    try {
      const enc = new TextEncoder();
      const dataBuf = enc.encode(salt + password);
      const hashBuf = await window.crypto.subtle.digest('SHA-256', dataBuf);
      const hashArray = Array.from(new Uint8Array(hashBuf));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
      // fallback (não seguro) caso a Web Crypto API não esteja disponível
      return (salt + password).split('').reduce((acc, ch) => acc + ch.charCodeAt(0).toString(16), '');
    }
  };

  const login = async (username, password) => {
    const initial = data.users || [];
    // verifica usuários iniciais (senha em texto claro)
    const foundInitial = initial.find(u => u.username === username && u.password === password);
    if (foundInitial) {
      const u = { username: foundInitial.username, role: foundInitial.role };
      setUser(u);
      localStorage.setItem('locadora_user', JSON.stringify(u));
      return { ok: true, user: u };
    }

    // verifica usuários armazenados (podem ter passwordHash e salt)
    const stored = storedUsers || [];
    const foundStored = stored.find(u => u.username === username);
    if (foundStored) {
      if (foundStored.passwordHash && foundStored.salt) {
        const h = await hashWithSalt(password, foundStored.salt);
        if (h === foundStored.passwordHash) {
          const u = { username: foundStored.username, role: foundStored.role };
          setUser(u);
          localStorage.setItem('locadora_user', JSON.stringify(u));
          return { ok: true, user: u };
        }
      } else if (foundStored.password) {
        // compatibilidade com usuários armazenados em texto claro (legado)
        if (foundStored.password === password) {
          const u = { username: foundStored.username, role: foundStored.role };
          setUser(u);
          localStorage.setItem('locadora_user', JSON.stringify(u));
          return { ok: true, user: u };
        }
      }
    }

    return { ok: false, error: 'Credenciais inválidas' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('locadora_user');
  };

  const register = async (username, password, role = 'user') => {
    const all = getAllUsers();
    if (all.find(u => u.username === username)) {
      return { ok: false, error: 'Nome de usuário já existe' };
    }

    // Apenas um admin autenticado pode criar usuários com papel 'admin'
    const effectiveRole = (user && user.role === 'admin') ? role : 'user';

    const salt = genSalt();
    const passwordHash = await hashWithSalt(password, salt);

    const newUser = { username, passwordHash, salt, role: effectiveRole };
    const next = [...storedUsers, newUser];
    setStoredUsers(next);
    try {
      localStorage.setItem('locadora_users', JSON.stringify(next));
    } catch (e) {
      // ignora erros de armazenamento
    }

    // notifica outros listeners (opcional)
    try {
      window.dispatchEvent(new CustomEvent('users:updated'));
    } catch (e) {}

    return { ok: true, user: { username, role: effectiveRole } };
  };

  const deleteUser = (username) => {
    const next = (storedUsers || []).filter(u => u.username !== username);
    setStoredUsers(next);
    try { localStorage.setItem('locadora_users', JSON.stringify(next)); } catch (e) {}
    try { window.dispatchEvent(new CustomEvent('users:updated')); } catch (e) {}
    return { ok: true };
  };

  const updateUserRole = (username, role) => {
    const next = (storedUsers || []).map(u => u.username === username ? { ...u, role } : u);
    setStoredUsers(next);
    try { localStorage.setItem('locadora_users', JSON.stringify(next)); } catch (e) {}
    try { window.dispatchEvent(new CustomEvent('users:updated')); } catch (e) {}
    return { ok: true };
  };

  const getPublicUsers = () => {
    const initial = (data.users || []).map(u => ({ username: u.username, role: u.role, source: 'initial' }));
    const stored = (storedUsers || []).map(u => ({ username: u.username, role: u.role, source: 'stored' }));
    return [...initial, ...stored];
  };

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'locadora_users') {
        try {
          setStoredUsers(JSON.parse(e.newValue) || []);
        } catch (err) {
          setStoredUsers([]);
        }
      }
      if (e.key === 'locadora_user') {
        try {
          setUser(JSON.parse(e.newValue));
        } catch (err) {
          setUser(null);
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin: !!user && user.role === 'admin', register, getAllUsers, getPublicUsers, deleteUser, updateUserRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
