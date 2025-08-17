const express = require("express");
const cors = require("cors");
const { romanConvertorRouter } = require("./routers");

const app = express();
app.use(cors());

app.get("/api/roman", romanConvertorRouter);

if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Backend listening on http://localhost:${PORT}`);
  });
}

module.exports = {
  app,
  convertToRoman: require("./controllers").convertToRoman,
};
