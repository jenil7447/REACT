'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { postsAPI } from '@/lib/api';
import Link from 'next/link';

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await postsAPI.getAll();
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        await postsAPI.delete(id);
        fetchPosts();
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Posts</h1>
          <Link href="/posts/create">
            <button className="btn btn-primary">Create Post</button>
          </Link>
        </div>

        {loading ? (
          <p>Loading posts...</p>
        ) : posts.length === 0 ? (
          <p>No posts found.</p>
        ) : (
          <div className="grid">
            {posts.map((post) => (
              <div key={post.id} className="card">
                <h3>{post.title}</h3>
                <p>{post.content.substring(0, 100)}...</p>
                <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
                  By: {post.author.name} | {post.published ? 'Published' : 'Draft'}
                </p>
                <div style={{ marginTop: '10px' }}>
                  <Link href={`/posts/${post.id}`}>
                    <button className="btn btn-primary" style={{ marginRight: '5px' }}>View</button>
                  </Link>
                  {(user?.id === post.authorId || user?.role === 'ADMIN') && (
                    <>
                      <Link href={`/posts/edit/${post.id}`}>
                        <button className="btn btn-secondary" style={{ marginRight: '5px' }}>Edit</button>
                      </Link>
                      <button 
                        onClick={() => handleDelete(post.id)} 
                        className="btn btn-danger"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}