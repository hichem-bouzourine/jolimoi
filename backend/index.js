const express = require("express");
const cors = require("cors");
const { romanConvertorRouter, romanWithSseRouter } = require("./routers");

const app = express();
app.use(cors());

app.get("/api/roman", romanConvertorRouter);
app.get("/api/roman-sse", romanWithSseRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
