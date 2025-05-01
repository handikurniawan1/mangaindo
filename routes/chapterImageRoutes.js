import express from 'express';
import puppeteer from 'puppeteer';

const router = express.Router();

router.get('/scrape-chapter-image', async (req, res) => {
  const { chapter_link } = req.query;

  if (!chapter_link) {
    return res.status(400).json({ error: 'chapter_link query parameter wajib diisi.' });
  }

  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    await page.goto(chapter_link, { waitUntil: 'networkidle2', timeout: 60000 });
    await page.waitForSelector('#Baca_Komik img', { timeout: 60000 });

    const images = await page.evaluate(() => {
      const imgElements = document.querySelectorAll('#Baca_Komik img');
      return Array.from(imgElements).map(img => img.src);
    });

    await browser.close();

    res.json({ images });
  } catch (error) {
    console.error('❌ Scrape image error:', error);
    res.status(500).json({ error: 'Gagal scrape gambar dari chapter.' });
  }
});

export default router;
