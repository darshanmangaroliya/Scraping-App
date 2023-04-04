require("dotenv").config();
const express = require("express");
const cheerio = require("cheerio");
// const fs = require("fs/promises");
const cors = require("cors");
const { ScrapingBeeClient } = require("scrapingbee");

const PORT = process.env.PORT ||3000
const app = express();
app.use(cors());
async function get(url) {
  let client = new ScrapingBeeClient(process.env.SCREEPBEE_CLIENT_KEY);
  let response = await client.get({
    url: url,
    params: {
      country_code: "de",
      premium_proxy: "True",
    //   screenshot: true, // Take a screenshot
    //   screenshot_full_page: true, // Specify that we need the full height
    //   window_width: 375, // Specify a mobile width in pixel
    },

  });
  return response;
}
app.get("/scrape", async (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).send("Please provide a URL to scrape.");
  }
  try {
    const response = await get(url);
    // console.log(response)
    // await fs.writeFile("./screenshot.png", response.data);

    let decoder = new TextDecoder();
    let text = decoder.decode(response.data);
    const $ = cheerio.load(text);
    // fs.writeFile("./text.txt",text)
    const title = $("head title").text().trim();
    const description =
      $('head meta[name="description"]').attr("content") ||
      $('head meta[property="og:description"]').attr("content") ||
      "";
    const author =
      $('head meta[name="author"]').attr("content") ||
      $('head meta[property="article:author"]').attr("content") ||
      "";
    const image = $('head meta[property="og:image"]').attr("content") || "";
    const type = $('head meta[property="og:type"]').attr("content") || "";
    const canonicalUrl = $('head link[rel="canonical"]').attr("href") || "";
    const locale = $("html").attr("lang") || "";
    const publishedDate =
      $('head meta[property="article:published_time"]').attr("content") || "";

    const data = {
      title,
      description,
      author,
      image,
      type,
      canonicalUrl,
      locale,
      publishedDate,
    };

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send("Failed to retrieve HTML content from the URL.");
  }
});

app.listen(PORT, () => {
  console.log("Server started on port "+ PORT);
});
