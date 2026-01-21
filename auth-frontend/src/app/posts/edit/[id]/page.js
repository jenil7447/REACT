'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { postsAPI } from '@/lib/api';
import Link from 'next/link';

export default function EditPostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const params = useParams();
  const router = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchPost();
  }, []);

  const fetchPost = async () => {
    try {
      const response = await postsAPI.getById(params.id);
      const post = response.data.post;
      
      // Check if user has permission to edit
      if (user?.id !== post.authorId && user?.role !== 'ADMIN') {
        alert('You do not have permission to edit this post');
        router.push('/posts');
        return;
      }

      setTitle(post.title);
      setContent(post.content);
      setPublished(post.published);
    } catch (error) {
      console.error('Error fetching post:', error);
      alert('Post not found');
      router.push('/posts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await postsAPI.update(params.id, { title, content, published });
      router.push('/posts');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update post');
    }
  };

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
        <h1>Edit Post</h1>
        
        {loading ? (
          <p>Loading post...</p>
        ) : (
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
                  {' '}Published
                </label>
              </div>
              {error && <div className="error">{error}</div>}
              <div>
                <button type="submit" className="btn btn-primary" style={{ marginRight: '10px' }}>
                  Update Post
                </button>
                <Link href="/posts">
                  <button type="button" className="btn btn-secondary">Cancel</button>
                </Link>
              </div>
            </form>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}