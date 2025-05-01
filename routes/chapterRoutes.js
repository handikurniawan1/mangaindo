import express from 'express';
import pool from '../db.js'; // database connection pool
import scrapeChapters from '../chapterScraper.js'; // ini kalau dipakai nanti

const router = express.Router();

router.get('/chapters', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM chapters ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Gagal ambil data chapters:', err);
    res.status(500).send('Gagal ambil data chapters dari database.');
  }
});

router.get('/chapters/:mangaId', async (req, res) => {
  const mangaId = req.params.mangaId;
  try {
    const result = await pool.query(
      'SELECT * FROM chapters WHERE manga_id = $1 ORDER BY id ASC',
      [mangaId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(`❌ Gagal ambil chapters untuk manga ${mangaId}:`, err);
    res.status(500).send('Gagal ambil data chapter berdasarkan manga_id.');
  }
});

export default router;