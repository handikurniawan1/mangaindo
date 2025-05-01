import puppeteer from 'puppeteer';

export const scrapeKomiku = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto('https://komiku.id/pustaka/?orderby=meta_value_num&category_name=manga&genre=action&genre2=adventure&status=ongoing');

  await page.waitForSelector('.daftar');

  const mangaList = await page.evaluate(() => {
    const data = [];
    const items = document.querySelectorAll('.daftar .bge');

    items.forEach(item => {
      const title = item.querySelector('.kan h3')?.innerText.trim();
      const image = item.querySelector('img')?.src;
      const judul2Text = item.querySelector('.judul2')?.innerText.trim();
      const readers = judul2Text?.split('•')[0].trim();
      const lastUpdate = judul2Text?.split('•')[1]?.trim();
      const firstChapter = item.querySelector('.new1 a')?.innerText.split(':')[1]?.trim();
      const latestChapter = item.querySelectorAll('.new1 a')[1]?.innerText.split(':')[1]?.trim();
      const synopsis = item.querySelector('p')?.innerText.trim();
      const mangaLink = item.querySelector('.bgei a')?.href;

      console.log('Manga yang akan dimasukkan:', {
        title,
        image,
        readers,
        firstChapter,
        latestChapter,
        synopsis,
        lastUpdate,
        mangaLink
      });

      // Pastikan semua data ada sebelum ditambahkan ke array
      if (title && image && readers && firstChapter && latestChapter && synopsis && lastUpdate && mangaLink) {
        data.push({
          title,
          image,
          readers,
          first_chapter: firstChapter,
          latest_chapter: latestChapter,
          synopsis,
          last_update: lastUpdate,
          manga_link: mangaLink
        });
      } else {
        console.log('Data manga tidak lengkap:', { title, image, readers, firstChapter, latestChapter, synopsis, lastUpdate, mangaLink });
      }
    });

    return data;
  });

  await browser.close();
  return mangaList;
};
