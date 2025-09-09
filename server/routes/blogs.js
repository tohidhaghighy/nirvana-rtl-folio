const express = require('express');
const router = express.Router();
const { poolPromise } = require('../config/database');
const auth = require('../middleware/auth');

// Get all published blogs
router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const { published } = req.query;
    
    let query = 'SELECT * FROM blogs';
    const params = [];
    
    if (published === 'true') {
      query += ' WHERE published = 1';
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await pool.request().query(query);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get blog by slug
router.get('/:slug', async (req, res) => {
  try {
    const pool = await poolPromise;
    const { slug } = req.params;
    
    const result = await pool.request()
      .input('slug', slug)
      .query('SELECT * FROM blogs WHERE slug = @slug AND published = 1');
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    
    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Create new blog (admin only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const pool = await poolPromise;
    const { title, content, excerpt, slug, published, featured_image_url } = req.body;
    
    const result = await pool.request()
      .input('title', title)
      .input('content', content)
      .input('excerpt', excerpt)
      .input('slug', slug)
      .input('published', published)
      .input('featured_image_url', featured_image_url)
      .input('author_id', req.user.id)
      .query(`
        INSERT INTO blogs (title, content, excerpt, slug, published, featured_image_url, author_id)
        OUTPUT INSERTED.*
        VALUES (@title, @content, @excerpt, @slug, @published, @featured_image_url, @author_id)
      `);
    
    res.status(201).json(result.recordset[0]);
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Update blog (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const pool = await poolPromise;
    const { id } = req.params;
    const { title, content, excerpt, slug, published, featured_image_url } = req.body;
    
    const result = await pool.request()
      .input('id', id)
      .input('title', title)
      .input('content', content)
      .input('excerpt', excerpt)
      .input('slug', slug)
      .input('published', published)
      .input('featured_image_url', featured_image_url)
      .query(`
        UPDATE blogs 
        SET title = @title, content = @content, excerpt = @excerpt, 
            slug = @slug, published = @published, featured_image_url = @featured_image_url,
            updated_at = GETDATE()
        OUTPUT INSERTED.*
        WHERE id = @id
      `);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    
    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Delete blog (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const pool = await poolPromise;
    const { id } = req.params;
    
    const result = await pool.request()
      .input('id', id)
      .query('DELETE FROM blogs WHERE id = @id');
    
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    
    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;