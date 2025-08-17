const request = require("supertest");
const { convertToRoman, app } = require("../index.js");

// ---------------------
// Unit tests for convertToRoman
// ---------------------
describe("convertToRoman() basic conversion", () => {
  test("0 should be N", () => {
    expect(convertToRoman(0)).toBe("N");
  });

  test("9 should be IX", () => {
    expect(convertToRoman(9)).toBe("IX");
  });

  test("42 should be XLII", () => {
    expect(convertToRoman(42)).toBe("XLII");
  });

  test("100 should be C", () => {
    expect(convertToRoman(100)).toBe("C");
  });

  test("should throw for out of range", () => {
    expect(() => convertToRoman(101)).toThrow();
    expect(() => convertToRoman(-1)).toThrow();
  });
});

// ---------------------
// Basic /api/roman tests
// ---------------------
describe("GET /api/roman", () => {
  test("converts 9 to IX", async () => {
    const res = await request(app).get("/api/roman").query({ number: 9 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ input: 9, roman: "IX" });
  });

  test("returns error for invalid input", async () => {
    const res = await request(app).get("/api/roman").query({ number: 200 });

    expect(res.statusCode).toBe(500); // your controller catches and sends 500
    expect(res.body.error).toBeDefined();
  });

  test("returns 400 if number is missing", async () => {
    const res = await request(app).get("/api/roman");
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Missing query param/);
  });
});
