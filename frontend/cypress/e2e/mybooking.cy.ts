// Issue #6: My bookings — view / edit / delete (member + admin).
// Needs the frontend AND backend (with a database) running. Creates its own users,
// facility and bookings through the API, so existing data is left alone.
// Backend URL for test setup: CYPRESS_BACKEND_URL (default http://localhost:5000).
const backend = Cypress.env("BACKEND_URL") || "http://localhost:5000";
const stamp = Date.now();
const admin = { name: "Cy MAdmin", email: `cymadmin${stamp}@test.com`, tel: "0800000020", password: "secret123", role: "admin" };
const memberA = { name: `Cy MemberA ${stamp}`, email: `cymembera${stamp}@test.com`, tel: "0800000021", password: "secret123", role: "member" };
const memberB = { name: `Cy MemberB ${stamp}`, email: `cymemberb${stamp}@test.com`, tel: "0800000022", password: "secret123", role: "member" };
const facilityName = `Cy MyBooking Court ${stamp}`;
let facilityId = "";

type User = { email: string; password: string; name: string };

// YYYY-MM-DD, `days` from today (local time, same as the form's min date)
function dateIn(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function login(user: User) {
  cy.visit("/login");
  cy.get("input[name=email]").type(user.email);
  cy.get("input[name=password]").type(user.password);
  cy.contains("button", "Login").click();
  cy.get("[data-testid=user-name]").should("contain", user.name);
}

// Tokens from registration, reused for setup requests: the backend rate-limits
// to 100 requests / 10 min per IP, so avoid an extra login per booking.
const tokens: Record<string, string> = {};

// Creates a booking for `user` on the test facility through the API.
function apiBook(user: User, days: number, startTime: string, durationHours = 1) {
  return cy.request({
    method: "POST",
    url: `${backend}/api/v1/bookings`,
    headers: { Authorization: `Bearer ${tokens[user.email]}` },
    body: { facility: facilityId, bookingDate: dateIn(days), startTime, durationHours },
  });
}

// Rows on the test facility, optionally narrowed to one user (admin view) or a start time.
// One selector (not cy.filter) so `should("not.exist")` also works when the table is empty.
const rows = (...texts: string[]) =>
  cy.get(`[data-testid=booking-row]${[facilityName, ...texts].map((t) => `:contains("${t}")`).join("")}`);

describe("My bookings", () => {
  before(() => {
    cy.request("POST", `${backend}/api/v1/auth/register`, admin).then(({ body }) =>
      cy
        .request({
          method: "POST",
          url: `${backend}/api/v1/facilities`,
          headers: { Authorization: `Bearer ${body.data.token}` },
          body: { name: facilityName, sportType: "Tennis", location: "Building 9", capacity: 4, hourlyRate: 300 },
        })
        .then((res) => { facilityId = res.body.data._id; }),
    );
    for (const m of [memberA, memberB]) {
      cy.request("POST", `${backend}/api/v1/auth/register`, m).then(({ body }) => { tokens[m.email] = body.data.token; });
    }
  });

  it("member edits then deletes their own booking", () => {
    apiBook(memberA, 3, "10:00", 1);
    login(memberA);
    cy.visit("/mybooking");
    cy.contains("h1", "My Bookings");
    rows("10:00–11:00").should("have.length", 1).and("contain", dateIn(3));

    // Edit: move to day 4, 14:00 for 2 hours
    rows("10:00–11:00").contains("a", "Edit").click();
    cy.contains("h1", "Edit booking");
    cy.get("select[name=facility]:visible").should("have.value", facilityId);
    cy.get("input[name=startTime]:visible").should("have.value", "10:00");
    cy.get("input[name=bookingDate]:visible").clear().type(dateIn(4));
    cy.get("input[name=startTime]:visible").clear().type("14:00");
    cy.get("input[name=durationHours]:visible").clear().type("2");
    cy.contains("button:visible", "Save changes").click();

    cy.location("pathname").should("eq", "/mybooking");
    rows("14:00–16:00").should("have.length", 1).and("contain", dateIn(4));
    rows("10:00–11:00").should("not.exist");

    // Delete with confirm
    cy.on("window:confirm", (text) => {
      expect(text).to.contain(facilityName);
      return true;
    });
    rows("14:00–16:00").contains("button", "Delete").click();
    rows().should("not.exist");
    cy.reload();
    rows().should("not.exist"); // gone on the server too
  });

  it("edit shows the backend error for an overlapping time", () => {
    apiBook(memberA, 6, "09:00", 1);
    apiBook(memberB, 6, "11:00", 1); // same facility, so 11:00 is taken
    login(memberA);
    cy.visit("/mybooking");
    rows("09:00–10:00").contains("a", "Edit").click();
    cy.get("input[name=startTime]:visible").clear().type("11:30");
    cy.contains("button:visible", "Save changes").click();
    cy.get("[role=alert]:visible").should("contain", "overlapping booking");
    cy.location("pathname").should("match", /\/edit$/);
  });

  it("member does not see other members' bookings", () => {
    apiBook(memberB, 7, "08:00", 1);
    login(memberA);
    cy.visit("/mybooking");
    rows("08:00–09:00").should("not.exist");
    cy.contains("th", "User").should("not.exist");
  });

  it("admin sees every user's bookings and can delete one", () => {
    apiBook(memberA, 5, "16:00", 1);
    apiBook(memberB, 5, "18:00", 1);
    login(admin);
    cy.visit("/mybooking");
    cy.contains("h1", "All Bookings");
    cy.contains("th", "User");
    rows(memberA.name, "16:00–17:00").should("have.length", 1);
    rows(memberB.name, "18:00–19:00").should("have.length", 1);

    cy.on("window:confirm", () => true);
    rows(memberB.name, "18:00–19:00").contains("button", "Delete").click();
    rows(memberB.name, "18:00–19:00").should("not.exist");
    rows(memberA.name, "16:00–17:00").should("have.length", 1);
  });
});
