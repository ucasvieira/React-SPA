import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const Users = () => {
  const { user, isAdmin, getPublicUsers, deleteUser, updateUserRole } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    setUsers(getPublicUsers());
    const onUpdate = () => setUsers(getPublicUsers());
    window.addEventListener('users:updated', onUpdate);
    window.addEventListener('storage', onUpdate);
    return () => {
      window.removeEventListener('users:updated', onUpdate);
      window.removeEventListener('storage', onUpdate);
    };
  }, [isAdmin, navigate, getPublicUsers]);

  const handleDelete = (username) => {
    if (!confirm(`Remover usuário ${username}?`)) return;
    const res = deleteUser(username);
    if (res.ok) setUsers(getPublicUsers());
  };

  const handleRoleChange = (username, e) => {
    const role = e.target.value;
    updateUserRole(username, role);
    setUsers(getPublicUsers());
  };

  return (
    <div className="min-h-screen bg-secondary py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-primary mb-6">Gerenciamento de Usuários</h1>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
            <thead>
              <tr className="text-left">
                <th className="p-2">Usuário</th>
                <th className="p-2">Papel</th>
                <th className="p-2">Origem</th>
                <th className="p-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.username} className="border-t">
                  <td className="p-2">{u.username}</td>
                  <td className="p-2">
                    {u.source === 'stored' ? (
                      <select value={u.role} onChange={(e) => handleRoleChange(u.username, e)} className="p-1 border rounded">
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    ) : (
                      <span className="italic text-gray-600">{u.role}</span>
                    )}
                  </td>
                  <td className="p-2">{u.source}</td>
                  <td className="p-2">
                    {u.source === 'stored' ? (
                      <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={() => handleDelete(u.username)}>Remover</button>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
