const express = require('express');
const router = express.Router();
const { poolPromise } = require('../config/database');
const auth = require('../middleware/auth');

// Create contact submission
router.post('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const { name, email, phone, subject, message, user_id } = req.body;
    
    const result = await pool.request()
      .input('name', name)
      .input('email', email)
      .input('phone', phone)
      .input('subject', subject)
      .input('message', message)
      .input('user_id', user_id)
      .query(`
        INSERT INTO contact_submissions (name, email, phone, subject, message, user_id)
        OUTPUT INSERTED.*
        VALUES (@name, @email, @phone, @subject, @message, @user_id)
      `);
    
    res.status(201).json(result.recordset[0]);
  } catch (error) {
    console.error('Error creating contact submission:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get contact submissions (admin or own submissions)
router.get('/', auth, async (req, res) => {
  try {
    const pool = await poolPromise;
    let query = 'SELECT * FROM contact_submissions';
    const request = pool.request();
    
    if (req.user.role === 'admin') {
      // Admin can see all submissions
      query += ' ORDER BY created_at DESC';
    } else {
      // Users can only see their own submissions
      query += ' WHERE user_id = @user_id ORDER BY created_at DESC';
      request.input('user_id', req.user.id);
    }
    
    const result = await request.query(query);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Update contact submission status (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const pool = await poolPromise;
    const { id } = req.params;
    const { status, admin_notes } = req.body;
    
    const result = await pool.request()
      .input('id', id)
      .input('status', status)
      .input('admin_notes', admin_notes)
      .query(`
        UPDATE contact_submissions 
        SET status = @status, admin_notes = @admin_notes, updated_at = GETDATE()
        OUTPUT INSERTED.*
        WHERE id = @id
      `);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Contact submission not found' });
    }
    
    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Error updating contact submission:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get ticket responses
router.get('/:id/responses', auth, async (req, res) => {
  try {
    const pool = await poolPromise;
    const { id } = req.params;
    
    // Check if user can access this submission
    const submissionResult = await pool.request()
      .input('id', id)
      .input('user_id', req.user.id)
      .query(`
        SELECT * FROM contact_submissions 
        WHERE id = @id AND (user_id = @user_id OR @user_id IN (SELECT id FROM users WHERE role = 'admin'))
      `);
    
    if (submissionResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Contact submission not found' });
    }
    
    const result = await pool.request()
      .input('submission_id', id)
      .query('SELECT * FROM ticket_responses WHERE submission_id = @submission_id ORDER BY created_at ASC');
    
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching ticket responses:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Add ticket response
router.post('/:id/responses', auth, async (req, res) => {
  try {
    const pool = await poolPromise;
    const { id } = req.params;
    const { message } = req.body;
    
    // Check if user can access this submission
    const submissionResult = await pool.request()
      .input('id', id)
      .input('user_id', req.user.id)
      .query(`
        SELECT * FROM contact_submissions 
        WHERE id = @id AND (user_id = @user_id OR @user_id IN (SELECT id FROM users WHERE role = 'admin'))
      `);
    
    if (submissionResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Contact submission not found' });
    }
    
    const result = await pool.request()
      .input('submission_id', id)
      .input('user_id', req.user.id)
      .input('message', message)
      .input('is_admin', req.user.role === 'admin')
      .query(`
        INSERT INTO ticket_responses (submission_id, user_id, message, is_admin)
        OUTPUT INSERTED.*
        VALUES (@submission_id, @user_id, @message, @is_admin)
      `);
    
    res.status(201).json(result.recordset[0]);
  } catch (error) {
    console.error('Error creating ticket response:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;