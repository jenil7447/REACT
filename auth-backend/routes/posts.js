import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all posts
router.get('/', authenticate, async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: { author: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ posts });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts', details: error.message });
  }
});

// Get single post
router.get('/:id', authenticate, async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: req.params.id },
      include: { author: { select: { id: true, name: true, email: true } } }
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({ post });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch post', details: error.message });
  }
});

// Create post
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, content, published } = req.body;

    const post = await prisma.post.create({
      data: {
        title,
        content,
        published: published || false,
        authorId: req.user.userId
      },
      include: { author: { select: { id: true, name: true, email: true } } }
    });

    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post', details: error.message });
  }
});

// Update post
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { title, content, published } = req.body;
    const postId = req.params.id;

    const existingPost = await prisma.post.findUnique({ where: { id: postId } });
    
    if (!existingPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (existingPost.authorId !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized to update this post' });
    }

    const post = await prisma.post.update({
      where: { id: postId },
      data: { title, content, published },
      include: { author: { select: { id: true, name: true, email: true } } }
    });

    res.json({ message: 'Post updated successfully', post });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update post', details: error.message });
  }
});

// Delete post
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const postId = req.params.id;

    const existingPost = await prisma.post.findUnique({ where: { id: postId } });
    
    if (!existingPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (existingPost.authorId !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    await prisma.post.delete({ where: { id: postId } });

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post', details: error.message });
  }
});

export default router;