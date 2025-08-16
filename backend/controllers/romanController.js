const convertToRoman = (n) => {
  if (n === 0) return "N";
  if (n < 0 || n > 100) throw new RangeError("Out of range");

  const romanMap = {
    100: "C",
    90: "XC",
    50: "L",
    40: "XL",
    10: "X",
    9: "IX",
    5: "V",
    4: "IV",
    1: "I",
  };

  let num = n;
  let result = "";

  for (const value of Object.keys(romanMap)
    .map(Number)
    .sort((a, b) => b - a)) {
    while (num >= value) {
      result += romanMap[value];
      num -= value;
    }
  }
  return result;
};

module.exports = {
  convertToRoman,
};
