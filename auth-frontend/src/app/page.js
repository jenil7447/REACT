'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading...</div>;
  }

  return (
    <div className="container">
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h1>Welcome to Auth System</h1>
        <p style={{ margin: '20px 0' }}>Role-based authentication with CRUD operations</p>
        <div>
          <Link href="/login">
            <button className="btn btn-primary" style={{ margin: '10px' }}>Login</button>
          </Link>
          <Link href="/register">
            <button className="btn btn-secondary" style={{ margin: '10px' }}>Register</button>
          </Link>
        </div>
      </div>
    </div>
  );
}