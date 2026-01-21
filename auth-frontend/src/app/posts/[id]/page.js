'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { postsAPI } from '@/lib/api';
import Link from 'next/link';

export default function ViewPostPage() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchPost();
  }, []);

  const fetchPost = async () => {
    try {
      const response = await postsAPI.getById(params.id);
      setPost(response.data.post);
    } catch (error) {
      console.error('Error fetching post:', error);
      alert('Post not found');
      router.push('/posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        await postsAPI.delete(params.id);
        router.push('/posts');
      } catch (error) {
        alert('Error deleting post');
      }
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
        {loading ? (
          <p>Loading post...</p>
        ) : post ? (
          <>
            <div style={{ marginBottom: '20px' }}>
              <Link href="/posts">
                <button className="btn btn-secondary">← Back to Posts</button>
              </Link>
            </div>

            <div className="card">
              <h1>{post.title}</h1>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
                By: {post.author.name} ({post.author.email}) | 
                Status: {post.published ? 'Published' : 'Draft'} | 
                Created: {new Date(post.createdAt).toLocaleDateString()}
              </p>
              <div style={{ lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                {post.content}
              </div>

              {(user?.id === post.authorId || user?.role === 'ADMIN') && (
                <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #ddd' }}>
                  <Link href={`/posts/edit/${post.id}`}>
                    <button className="btn btn-primary" style={{ marginRight: '10px' }}>
                      Edit Post
                    </button>
                  </Link>
                  <button onClick={handleDelete} className="btn btn-danger">
                    Delete Post
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <p>Post not found</p>
        )}
      </div>
    </ProtectedRoute>
  );
}