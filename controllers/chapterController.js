import pool from '../db.js';

export const saveChaptersToDB = async (mangaId, chapters) => {
  try {
    for (const chapter of chapters) {
      await pool.query(
        `INSERT INTO chapters (manga_id, chapter_title, chapter_link, views, release_date, image, author, status, age_rating)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (chapter_link) DO NOTHING`,
        [
          mangaId,
          chapter.chapter_title,
          chapter.chapter_link,
          chapter.views,
          chapter.release_date,
          chapter.image,
          chapter.author,
          chapter.status,
          chapter.age_rating
        ]
      );
    }
    console.log(`✅ ${chapters.length} chapters berhasil disimpan untuk manga id ${mangaId}`);
  } catch (err) {
    console.error('❌ Chapter insertion error:', err);
  }
};