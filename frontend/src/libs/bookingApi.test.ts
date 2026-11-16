import getBookings from "./getBookings";
import getBooking from "./getBooking";
import updateBooking from "./updateBooking";
import deleteBooking from "./deleteBooking";

const API = "http://api.test";
const ID = "507f1f77bcf86cd799439011";
const TOKEN = "tok";

const reply = (status: number, body: unknown) =>
  Promise.resolve({ ok: status >= 200 && status < 300, status, json: () => Promise.resolve(body) } as Response);

let fetchMock: jest.Mock;
beforeEach(() => {
  process.env.NEXT_PUBLIC_BACKEND_URL = API;
  fetchMock = jest.fn();
  global.fetch = fetchMock;
});

describe("getBookings", () => {
  it("sends the token and returns data", async () => {
    fetchMock.mockReturnValue(reply(200, { success: true, count: 1, data: [{ _id: ID }] }));
    await expect(getBookings(TOKEN)).resolves.toEqual([{ _id: ID }]);
    expect(fetchMock).toHaveBeenCalledWith(`${API}/api/v1/bookings`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
  });

  it("throws the backend error", async () => {
    fetchMock.mockReturnValue(reply(401, { success: false, error: "Not authorized" }));
    await expect(getBookings(TOKEN)).rejects.toThrow("Not authorized");
  });
});

describe("getBooking", () => {
  it("returns null for a malformed id without calling the API", async () => {
    await expect(getBooking(TOKEN, "abc")).resolves.toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([403, 404])("returns null on %i", async (status) => {
    fetchMock.mockReturnValue(reply(status, { success: false, error: "x" }));
    await expect(getBooking(TOKEN, ID)).resolves.toBeNull();
  });

  it("returns the booking", async () => {
    fetchMock.mockReturnValue(reply(200, { success: true, data: { _id: ID } }));
    await expect(getBooking(TOKEN, ID)).resolves.toEqual({ _id: ID });
  });
});

describe("updateBooking", () => {
  it("PUTs the input as JSON and returns the updated booking", async () => {
    fetchMock.mockReturnValue(reply(200, { success: true, data: { _id: ID, startTime: "20:00" } }));
    await expect(updateBooking(TOKEN, ID, { startTime: "20:00" })).resolves.toEqual({ _id: ID, startTime: "20:00" });
    expect(fetchMock).toHaveBeenCalledWith(`${API}/api/v1/bookings/${ID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN}` },
      body: JSON.stringify({ startTime: "20:00" }),
    });
  });

  it("throws the backend message on a conflict", async () => {
    fetchMock.mockReturnValue(reply(409, { success: false, error: "Facility or member already has an overlapping booking" }));
    await expect(updateBooking(TOKEN, ID, {})).rejects.toThrow("overlapping booking");
  });
});

describe("deleteBooking", () => {
  it("sends DELETE with the token", async () => {
    fetchMock.mockReturnValue(reply(200, { success: true, data: {} }));
    await expect(deleteBooking(TOKEN, ID)).resolves.toBeUndefined();
    expect(fetchMock).toHaveBeenCalledWith(`${API}/api/v1/bookings/${ID}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
  });

  it("falls back to a generic message when the error body isn't JSON", async () => {
    fetchMock.mockReturnValue(Promise.resolve({ ok: false, status: 502, json: () => Promise.reject(new SyntaxError("Unexpected token <")) } as Response));
    await expect(deleteBooking(TOKEN, ID)).rejects.toThrow("Failed to delete booking");
  });

  it("throws the backend message when not allowed", async () => {
    fetchMock.mockReturnValue(reply(403, { success: false, error: "Not authorized to delete this booking" }));
    await expect(deleteBooking(TOKEN, ID)).rejects.toThrow("Not authorized to delete this booking");
  });
});
