import { createRequire } from "module";

const require = createRequire(import.meta.url);
const puppeteer = require("puppeteer");
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get("/api", (req, res) => {
  res.json({
    message: "Hello world",
  });
});

app.post("/api/url", (req, res) => {
  const { url } = req.body;

  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const websiteContent = await page.evaluate(() => {
      return document.documentElement.innerText.trim();
    });

    const websiteOgImage = await page.evaluate(() => {
      const metas = document.getElementsByTagName("meta");
      for (let i = 0; i < metas.length; i++) {
        if (metas[i].getAttribute("property") === "og:image") {
          return metas[i].getAttribute("content");
        }
      }
    });

    console.log({ websiteContent, websiteOgImage });
    await browser.close();
  })();
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
