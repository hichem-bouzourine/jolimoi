const { convertToRoman } = require("../controllers");

const romanConvertorRouter = (req, res) => {
  const regularNumber = req.query.number;
  if (regularNumber == null)
    return res.status(400).json({ error: "Missing query param: number" });

  const n = Number(regularNumber);
  if (!Number.isInteger(n))
    return res.status(400).json({ error: "number must be an integer" });

  try {
    const roman = convertToRoman(n);
    res.status(200).json({ input: n, roman });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const romanWithSseRouter = (req, res) => {
  const regularNumber = req.query.number;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  if (regularNumber == null) {
    res.write(`event: error\ndata: Missing query param: number\n\n`);
    res.end();
    return;
  }

  const n = Number(regularNumber);
  if (!Number.isInteger(n) || n < 0 || n > 100) {
    res.write(
      `event: error\ndata: Number must be an integer between 0 and 100\n\n`
    );
    return res.end();
  }

  const roman = convertToRoman(n);

  // send result as an SSE message
  res.write(`data: ${JSON.stringify({ input: n, roman })}\n\n`);
  res.end();
};

module.exports = {
  romanConvertorRouter,
  romanWithSseRouter,
};
