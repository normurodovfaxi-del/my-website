
const express = require("express");
const Parser = require("rss-parser");

const app = express();
const parser = new Parser();

app.use(express.static(__dirname));

app.get("/api/news", async (req, res) => {
  try {
    const feed = await parser.parseURL("https://zamin.uz/rss.xml");

    const news = feed.items.map(item => {
      const html = item.content || item.contentSnippet || "";
      const imageMatch = html.match(/<img[^>]+src=["']([^"']+)["']/i);

      return {
        title: item.title || "Yangilik",
        link: item.link || "https://zamin.uz/",
        date: item.isoDate || item.pubDate || "",
        description: item.contentSnippet || "",
        image: item.enclosure?.url || (imageMatch ? imageMatch[1] : ""),
        category: "ozbekiston"
      };
    });

    res.json({ news });
  } catch (error) {
    console.error(error.message);
    res.status(502).json({
      error: "RSS tasmasini olishning imkoni bo‘lmadi.",
      details: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Sayt ishga tushdi: http://localhost:${PORT}`);
});