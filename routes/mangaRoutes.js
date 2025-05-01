import { Router } from 'express';
import pool from '../db.js';

const router = Router();

router.get('/mangas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM mangas ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).send('Gagal mengambil data dari database');
  }
});

export default router;