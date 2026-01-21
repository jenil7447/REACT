'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <nav className="navbar">
        <div>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/posts">Posts</Link>
          {user?.role === 'ADMIN' && <Link href="/admin/users">Users</Link>}
        </div>
        <button onClick={logout} className="btn btn-danger">Logout</button>
      </nav>

      <div className="container">
        <h1>Dashboard</h1>
        <div className="card">
          <h2>Welcome, {user?.name}!</h2>
          <p>Email: {user?.email}</p>
          <p>Role: {user?.role}</p>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3>Quick Links</h3>
          <div className="grid">
            <div className="card">
              <h4>Posts</h4>
              <p>View and manage posts</p>
              <Link href="/posts">
                <button className="btn btn-primary">Go to Posts</button>
              </Link>
            </div>
            {user?.role === 'ADMIN' && (
              <div className="card">
                <h4>User Management</h4>
                <p>Manage all users (Admin only)</p>
                <Link href="/admin/users">
                  <button className="btn btn-primary">Manage Users</button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}