import puppeteer from 'puppeteer';

const scrapeChapters = async (mangaLink) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(mangaLink, { waitUntil: 'domcontentloaded' });

  await page.waitForSelector('#Daftar_Chapter');

  // Ambil info dari <section id="Informasi">
  const info = await page.evaluate(() => {
    const image = document.querySelector('#Informasi img[itemprop="image"]')?.src || '';
    const rows = document.querySelectorAll('#Informasi .inftable tr');

    const getText = (label) => {
      for (let row of rows) {
        if (row.children[0]?.innerText.includes(label)) {
          return row.children[1]?.innerText.trim() || '';
        }
      }
      return '';
    };

    return {
      image,
      author: getText('Pengarang'),
      status: getText('Status'),
      age_rating: getText('Umur Pembaca'),
    };
  });

  // Ambil daftar chapter
  const chapters = await page.evaluate(() => {
    const data = [];
    const rows = document.querySelectorAll('#Daftar_Chapter tbody tr');

    rows.forEach((row, index) => {
      if (index === 0) return;

      const chapterTitle = row.querySelector('.judulseries a span')?.innerText.trim();
      const chapterLink = row.querySelector('.judulseries a')?.href;
      const views = row.querySelector('.pembaca i')?.innerText.trim();
      const releaseDate = row.querySelector('.tanggalseries')?.innerText.trim();

      if (chapterTitle && chapterLink) {
        data.push({
          chapter_title: chapterTitle,
          chapter_link: chapterLink,
          views: views || '0',
          release_date: releaseDate || '-',
        });
      }
    });

    return data;
  });

  // Tambahkan info ke semua chapter
  const enrichedChapters = chapters.map(ch => ({
    ...ch,
    image: info.image,
    author: info.author,
    status: info.status,
    age_rating: info.age_rating,
  }));

  await browser.close();
  return enrichedChapters;
};

export default scrapeChapters;