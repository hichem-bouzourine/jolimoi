const express = require("express");
const cors = require("cors");
const { romanConvertorRouter, romanWithSseRouter } = require("./routers");

const app = express();
app.use(cors());
app.use(express.json());

// Use router with proper methods
app.get("/api/roman", romanConvertorRouter);
app.get("/api/roman-sse", romanWithSseRouter);

if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Backend listening on http://localhost:${PORT}`);
  });
}

module.exports = {
  app,
  convertToRoman: require("./controllers/romanController").convertToRoman,
};
