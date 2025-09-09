import express from 'express';
import { getConnection, sql } from '../config/database.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all profiles (admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .query(`
        SELECT p.*, 
               (SELECT COUNT(*) FROM contact_submissions cs WHERE cs.user_id = p.user_id) as submission_count,
               (SELECT TOP 1 created_at FROM contact_submissions cs WHERE cs.user_id = p.user_id ORDER BY created_at DESC) as last_submission
        FROM profiles p 
        ORDER BY p.created_at DESC
      `);
    
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching profiles:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user role (admin only)
router.put('/:id/role', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const pool = await getConnection();
    await pool.request()
      .input('id', sql.UniqueIdentifier, id)
      .input('role', sql.NVarChar, role)
      .input('updatedAt', sql.DateTime2, new Date())
      .query(`
        UPDATE profiles 
        SET role = @role, updated_at = @updatedAt
        WHERE id = @id
      `);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;