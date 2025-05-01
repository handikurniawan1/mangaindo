import express from 'express';
import { scrapeKomiku } from './scraper.js';
import scrapeChapters from './chapterScraper.js';
import * as chapterController from './controllers/chapterController.js';
import * as mangaController from './controllers/mangaController.js'; 
import chapterImageRoutes from './routes/chapterImageRoutes.js';
import chapterRoutes from './routes/chapterRoutes.js';
import mangaRoutes from './routes/mangaRoutes.js';
import pool from './db.js';
import PQueue from 'p-queue';
import cron from 'node-cron';


const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/api', mangaRoutes);
app.use('/api', chapterRoutes);
app.use('/api', chapterImageRoutes);

// Home route
app.get('/', (req, res) => {
  res.send('Welcome to Manga API 🚀');
});

// Manual scrape route
app.get('/scrape', async (req, res) => {
  try {
    const mangaList = await scrapeKomiku();
    await mangaController.saveMangasToDB(mangaList);
    res.status(200).send('Data berhasil disimpan ke database!');
  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).send('Error during scraping and saving data');
  }
});

app.get('/scrape-chapters', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, manga_link FROM mangas');
    const mangas = result.rows;

    for (const manga of mangas) {
      console.log(`🔍 Scraping chapters untuk manga ID ${manga.id}`);
      const chapters = await scrapeChapters(manga.manga_link);
      await chapterController.saveChaptersToDB(manga.id, chapters);
    }

    res.status(200).send(`✅ Chapter semua manga berhasil di-scrape & disimpan!`);
  } catch (error) {
    console.error('Chapter scraping error:', error);
    res.status(500).send('Gagal scrape chapter');
  }
});

// Cron job untuk update manga setiap jam 7 pagi
cron.schedule('0 7 * * *', async () => {
  console.log('⏰ Cron Job: Scraping otomatis jam 7 pagi...');
  try {
    const mangaList = await scrapeKomiku();
    await mangaController.saveMangasToDB(mangaList);
    console.log(`✅ ${mangaList.length} manga berhasil diupdate via cron job.`);
  } catch (error) {
    console.error('❌ Cron scraping error:', error);
  }
});

// Cron job untuk update chapter setiap jam 8 pagi
const chapterQueue = new PQueue({ concurrency: 1 });

cron.schedule('0 8 * * *', () => {
  console.log('⏰ Cron Job: Menambahkan task scrape chapter ke antrian jam 8 pagi...');

  chapterQueue.add(async () => {
    console.log('🚀 Mulai scraping CHAPTER...');
    try {
      const result = await pool.query('SELECT id, manga_link FROM mangas');
      const mangas = result.rows;

      for (const manga of mangas) {
        console.log(`🔍 Scraping chapters untuk manga ID ${manga.id}`);
        const chapters = await scrapeChapters(manga.manga_link);
        await chapterController.saveChaptersToDB(manga.id, chapters);
      }

      console.log(`✅ Semua chapter berhasil diupdate.`);
    } catch (error) {
      console.error('❌ Cron chapter scraping error:', error);
    }
  });
});

// Run server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});