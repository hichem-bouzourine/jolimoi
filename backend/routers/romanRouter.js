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
    res.json({ input: n, roman });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  romanConvertorRouter,
};
