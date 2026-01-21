'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { postsAPI } from '@/lib/api';
import Link from 'next/link';

export default function CreatePostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { logout } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await postsAPI.create({ title, content, published });
      router.push('/posts');
    } catch (error) {
      setError('Failed to create post');
    }
  };

  return (
    <ProtectedRoute>
      <nav className="navbar">
        <div>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/posts">Posts</Link>
        </div>
        <button onClick={logout} className="btn btn-danger">Logout</button>
      </nav>

      <div className="container">
        <h1>Create New Post</h1>
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="10"
                required
              />
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                />
                {' '}Publish immediately
              </label>
            </div>
            {error && <div className="error">{error}</div>}
            <div>
              <button type="submit" className="btn btn-primary" style={{ marginRight: '10px' }}>
                Create Post
              </button>
              <Link href="/posts">
                <button type="button" className="btn btn-secondary">Cancel</button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}