const request = require("supertest");
const { convertToRoman, app } = require("../index.js");

// ---------------------
// Helper for SSE parsing
// ---------------------
function parseSSE(raw) {
  const lines = raw.trim().split("\n");
  const dataLine = lines.find((line) => line.startsWith("data:"));
  if (!dataLine) return null;
  try {
    return JSON.parse(dataLine.replace("data: ", ""));
  } catch {
    return null;
  }
}

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

// ---------------------
// Integration tests: /api/roman-sse
// ---------------------
describe("GET /api/roman-sse (SSE)", () => {
  test("returns SSE stream with valid input", async () => {
    const res = await request(app)
      .get("/api/roman-sse")
      .query({ number: 9 })
      .set("Accept", "text/event-stream");

    expect(res.statusCode).toBe(200);
    expect(res.headers["content-type"]).toMatch(/text\/event-stream/);

    // Parse SSE message
    const parsed = parseSSE(res.text);
    expect(parsed).toEqual({ input: 9, roman: "IX" });
  });

  test("returns SSE error for invalid input", async () => {
    const res = await request(app)
      .get("/api/roman-sse")
      .query({ number: 200 })
      .set("Accept", "text/event-stream");

    expect(res.statusCode).toBe(200); // SSE sends a message, not a status code
    expect(res.headers["content-type"]).toMatch(/text\/event-stream/);
    expect(res.text).toContain("Number must be an integer between 0 and 100");
  });
});
