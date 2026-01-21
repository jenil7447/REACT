'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { usersAPI } from '@/lib/api';
import Link from 'next/link';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await usersAPI.getAll();
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await usersAPI.delete(id);
        fetchUsers();
      } catch (error) {
        alert('Error deleting user');
      }
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await usersAPI.updateRole(id, newRole);
      fetchUsers();
    } catch (error) {
      alert('Error updating role');
    }
  };

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <nav className="navbar">
        <div>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/posts">Posts</Link>
          <Link href="/admin/users">Users</Link>
        </div>
        <button onClick={logout} className="btn btn-danger">Logout</button>
      </nav>

      <div className="container">
        <h1>User Management (Admin Only)</h1>

        {loading ? (
          <p>Loading users...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Posts</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <select 
                      value={user.role} 
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                  <td>{user._count.posts}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button 
                      onClick={() => handleDelete(user.id)} 
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </ProtectedRoute>
  );
}