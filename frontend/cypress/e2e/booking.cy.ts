// Needs the frontend AND backend (with a database) running.
import pickDate from "../support/pickDate";
import pickTime from "../support/pickTime";
// Backend URL for test setup: CYPRESS_BACKEND_URL (default http://localhost:5000).
const backend = Cypress.env("BACKEND_URL") || "http://localhost:5000";
const stamp = Date.now();
const admin = { name: "Cy BAdmin", email: `cybadmin${stamp}@test.com`, tel: "0800000010", password: "secret123", role: "admin" };
const member = { name: "Cy BMember", email: `cybmember${stamp}@test.com`, tel: "0800000011", password: "secret123", role: "member" };
const facilityName = `Cy Booking Court ${stamp}`;
let facilityId = "";

// YYYY-MM-DD, `days` from today (local time, same as the form's min date)
function dateIn(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function login(user: { email: string; password: string; name: string }) {
  cy.visit("/login");
  cy.get("input[name=email]").type(user.email);
  cy.get("input[name=password]").type(user.password);
  cy.contains("button", "Login").click();
  cy.get("[data-testid=user-name]").should("contain", user.name);
}

function fillBooking({ date, time, hours }: { date: string; time: string; hours: string }) {
  pickDate(date);
  pickTime(time);
  cy.get("input[name=durationHours]:visible").clear().type(hours);
  cy.contains("button:visible", "Book").click();
}

describe("Create booking", () => {
  before(() => {
    cy.request("POST", `${backend}/api/v1/auth/register`, admin).then(({ body }) =>
      cy
        .request({
          method: "POST",
          url: `${backend}/api/v1/facilities`,
          headers: { Authorization: `Bearer ${body.data.token}` },
          body: { name: facilityName, sportType: "Badminton", location: "Building 9", capacity: 4, hourlyRate: 150 },
        })
        .then((res) => { facilityId = res.body.data._id; }),
    );
    cy.request("POST", `${backend}/api/v1/auth/register`, member);
  });

  it("member books a facility from its detail page", () => {
    login(member);
    cy.visit(`/facility/${facilityId}`);
    cy.contains("a", "Book this facility").click();
    cy.location("search").should("eq", `?fid=${facilityId}`);
    cy.get("select[name=facility]:visible").should("have.value", facilityId);

    // total price = hourlyRate (150) × duration, updated before submitting
    cy.get("[data-testid=total-price]:visible").should("contain", "150 THB");
    cy.get("input[name=durationHours]:visible").clear().type("1.5");
    cy.get("[data-testid=total-price]:visible").should("contain", "225 THB");

    fillBooking({ date: dateIn(3), time: "10:00", hours: "1.5" });
    cy.get("[data-testid=booking-success]:visible")
      .should("contain", facilityName)
      .and("contain", dateIn(3))
      .and("contain", "10:00");
  });

  it("past date and 3 hours each show an error", () => {
    login(member);
    cy.visit(`/booking?fid=${facilityId}`);

    fillBooking({ date: dateIn(-1), time: "10:00", hours: "1" });
    cy.contains("Booking date cannot be in the past");

    fillBooking({ date: dateIn(4), time: "10:00", hours: "3" });
    cy.contains("Duration must be between 0.5 and 2 hours");
    cy.get("[data-testid=booking-success]").should("not.exist");
  });

  it("overlapping booking shows the backend error", () => {
    // first booking made through the API: day 5, 15:00–16:00
    cy.request("POST", `${backend}/api/v1/auth/login`, member).then(({ body }) =>
      cy.request({
        method: "POST",
        url: `${backend}/api/v1/bookings`,
        headers: { Authorization: `Bearer ${body.data.token}` },
        body: { facility: facilityId, bookingDate: dateIn(5), startTime: "15:00", durationHours: 1 },
      }),
    );

    login(member);
    cy.visit(`/booking?fid=${facilityId}`);
    fillBooking({ date: dateIn(5), time: "15:30", hours: "1" });
    cy.get("[role=alert]:visible").should("contain", "overlapping booking");
  });

  it("admin sees no booking form", () => {
    login(admin);
    cy.visit(`/booking?fid=${facilityId}`);
    cy.get("[data-testid=admin-no-booking]:visible").should("contain", "Admins cannot create bookings");
    cy.get("select[name=facility]").should("not.exist");
  });
});
