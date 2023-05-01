import { createRequire } from "module";
import { ChatGPTUnofficialProxyAPI } from "chatgpt";

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

async function chatgptFunction(content) {
  const api = new ChatGPTUnofficialProxyAPI({
    email: "email",
    password: "password",
  });
  await api.initSession();

  const getBrandName = await api.sendMessage(
    `I have a raw text of a website, what is the brand name in a single word? ${content}`
  );

  const getBrandDescription = await api.sendMessage(
    `I have a raw text of a website, can you extract the description of the website from the raw text. I need only the description and nothing else. ${content}`
  );

  return {
    brandName: getBrandName.response,
    brandDescription: getBrandDescription.response,
  };
}

const database = [];

const generateID = () => Math.random().toString(36).substring(2, 10);

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

    let result = await chatgptFunction(websiteContent);

    result.brandImage = websiteOgImage;
    result.id = generateID();

    database.push(result);

    return res.json({
      message: "Request successful!",
      database,
    });

    await browser.close();
  })();
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
