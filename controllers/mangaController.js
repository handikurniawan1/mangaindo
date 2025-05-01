import pool from '../db.js';

export const saveMangasFromRequest = async (req, res) => {
  const mangas = req.body;
  try {
    await saveMangasToDB(mangas);
    res.status(200).send('Mangas berhasil disimpan atau diperbarui');
  } catch (err) {
    console.error('❌ Database insertion error:', err);
    res.status(500).send('Terjadi kesalahan dalam menyimpan data manga');
  }
};

export const saveMangasToDB = async (mangas) => {
  if (!Array.isArray(mangas)) {
    console.error('❌ Data manga bukan array:', mangas);
    return;
  }

  try {
    for (const manga of mangas) {
      if (
        manga.title &&
        manga.image &&
        manga.synopsis &&
        manga.first_chapter &&
        manga.latest_chapter &&
        manga.readers &&
        manga.last_update &&
        manga.manga_link
      ) {
        await pool.query(
          `INSERT INTO mangas (title, image, synopsis, first_chapter, latest_chapter, readers, last_update, manga_link)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (title) DO UPDATE
           SET image = EXCLUDED.image,
               synopsis = EXCLUDED.synopsis,
               first_chapter = EXCLUDED.first_chapter,
               latest_chapter = EXCLUDED.latest_chapter,
               readers = EXCLUDED.readers,
               last_update = EXCLUDED.last_update,
               manga_link = EXCLUDED.manga_link`,
          [
            manga.title,
            manga.image,
            manga.synopsis,
            manga.first_chapter,
            manga.latest_chapter,
            manga.readers,
            manga.last_update,
            manga.manga_link
          ]
        );
      } else {
        console.log('❌ Data manga tidak lengkap:', manga);
      }
    }
  } catch (err) {
    console.error('❌ Database insertion error:', err);
  }
};