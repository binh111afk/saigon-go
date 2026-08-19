import puppeteer from 'puppeteer';

async function testGmaps() {
  console.log('🔍 Testing Google Maps scraper logic for Ăn Vặt Nhung Phan...');
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--lang=vi-VN']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');

  const query = encodeURIComponent('Ăn Vặt Nhung Phan 3/72 Đ. Song Hành, Hóc Môn');
  await page.goto(`https://www.google.com/maps/search/${query}`, { waitUntil: 'networkidle2', timeout: 60000 });

  await new Promise(r => setTimeout(r, 3000));

  // Click on main photo / header image to open full photo viewer
  const photoBtn = await page.$('button[aria-label*="Ảnh"], button[aria-label*="Photos"], button.ao3wfc, button[data-photo-index="0"], img[src*="googleusercontent"]');
  if (photoBtn) {
    console.log('  👉 Clicked cover image / photo button!');
    await photoBtn.click();
    await new Promise(r => setTimeout(r, 3000));
  }

  // Scroll photo gallery panel or press ArrowDown / PageDown multiple times
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press('PageDown');
    await page.evaluate(() => {
      const scrollPanels = document.querySelectorAll('div.m6QEpc, div[mqa-scroll-area], div.DxyBzc, div.w652be, div.section-layout');
      scrollPanels.forEach(el => el.scrollTop += 2000);
    });
    await new Promise(r => setTimeout(r, 800));
  }

  // Extract all photo URLs from img src and style background-image
  const photoUrls = await page.evaluate(() => {
    const urls = [];

    // 1. img tags
    document.querySelectorAll('img').forEach(img => {
      const src = img.src || img.getAttribute('data-src');
      if (src && (src.includes('googleusercontent.com') || src.includes('ggpht.com')) && !src.includes('avatar') && !src.includes('maps.gstatic.com')) {
        urls.push(src);
      }
    });

    // 2. background-image styles
    document.querySelectorAll('*').forEach(el => {
      const bg = window.getComputedStyle(el).backgroundImage;
      if (bg && bg.includes('googleusercontent.com')) {
        const match = bg.match(/url\(["']?(https:\/\/[^"']+)["']?\)/);
        if (match && match[1] && !match[1].includes('avatar')) {
          urls.push(match[1]);
        }
      }
    });

    return urls.map(u => u.replace(/=w\d+-h\d+.*$/, '=w1600-h1200').replace(/=s\d+.*$/, '=s1600'));
  });

  const unique = Array.from(new Set(photoUrls));
  console.log(`🎉 Found ${unique.length} unique photos:`);
  unique.forEach((u, i) => console.log(` ${i+1}. ${u}`));

  await browser.close();
}

testGmaps();
