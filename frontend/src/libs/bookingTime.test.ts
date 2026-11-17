import { formatPrice, totalPrice } from "./bookingTime";

describe("totalPrice", () => {
  it("multiplies the hourly rate by the duration", () => {
    expect(totalPrice(150, 1)).toBe(150);
    expect(totalPrice(300, 1.5)).toBe(450);
    expect(totalPrice(199, 0.5)).toBe(99.5);
  });

  it("is 0 for a free facility", () => {
    expect(totalPrice(0, 2)).toBe(0);
  });

  it("returns null when the duration is outside 0.5–2 hours", () => {
    expect(totalPrice(150, 0)).toBeNull();
    expect(totalPrice(150, 0.25)).toBeNull();
    expect(totalPrice(150, 3)).toBeNull();
  });

  it("returns null for missing or invalid numbers", () => {
    expect(totalPrice(150, NaN)).toBeNull();
    expect(totalPrice(undefined, 1)).toBeNull();
    expect(totalPrice(-10, 1)).toBeNull();
  });
});

describe("formatPrice", () => {
  it("adds thousands separators and keeps up to 2 decimals", () => {
    expect(formatPrice(450)).toBe("450");
    expect(formatPrice(1200)).toBe("1,200");
    expect(formatPrice(99.5)).toBe("99.5");
  });
});
