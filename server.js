const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(express.json({ limit: '10mb' }));  
app.use(cors());

app.post('/generate-og-image', async (req, res) => {
  const { title, content, image } = req.body;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(`
    <html>
      <body style="display: flex;  justify-content: center">
        <div style="text-align: center;display: flex;flex-direction:column;justify-content: center;align-items:center;width:96%;border-radius:20px;padding-top:15px">
          ${image ? `<img src="${image}" alt="Post Image" style="width: 100%; height: 400px;object-fit: cover;object-position: top;border-radius:20px;" />` : ''}
          <div style="text-align: left; width: fit-content;">
            <h1 style="font-size:50px">${title}</h1>
            <p style="font-size:30px">${content.slice(0,300)}</p>
          </div>
        </div>
      </body>
    </html>
  `);

 
  await page.waitForSelector('h1');

  const contentHeight = await page.evaluate(() => {
    return document.body.scrollHeight;
  });

  await page.setViewport({ width: 1200, height: contentHeight });
  const screenshot = await page.screenshot({ type: 'png' });
  await browser.close();

  res.setHeader('Content-Type', 'image/png');
  res.send(screenshot);
});

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
