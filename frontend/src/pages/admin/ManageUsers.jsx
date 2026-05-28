import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Users, Shield, Mail, Trash2, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await API.get('/users');
      setUsers(data.users);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (id, isActive) => {
    try {
      await API.put(`/users/${id}`, { isActive: !isActive });
      toast.success('User status updated');
      fetchUsers();
    } catch (err) {
      toast.error('Update failed');
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900">User Management</h1>
        <p className="text-gray-500">Manage customer accounts and access levels.</p>
      </div>

      <div className="card p-0 overflow-hidden shadow-xl">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-xs font-black uppercase text-gray-500">User</th>
              <th className="px-6 py-4 text-xs font-black uppercase text-gray-500">Role</th>
              <th className="px-6 py-4 text-xs font-black uppercase text-gray-500">Status</th>
              <th className="px-6 py-4 text-xs font-black uppercase text-gray-500">Joined</th>
              <th className="px-6 py-4 text-xs font-black uppercase text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((u) => (
              <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 uppercase">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{u.name}</p>
                      <p className="text-xs text-gray-400">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-black ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                    {u.role.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {u.isActive ? (
                    <span className="flex items-center gap-1 text-green-600 font-bold text-xs"><CheckCircle className="w-3 h-3" /> Active</span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-500 font-bold text-xs"><XCircle className="w-3 h-3" /> Blocked</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => toggleUserStatus(u._id, u.isActive)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${u.isActive ? 'text-red-500 bg-red-50 hover:bg-red-100' : 'text-green-600 bg-green-50 hover:bg-green-100'}`}
                  >
                    {u.isActive ? 'Block User' : 'Unblock User'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
