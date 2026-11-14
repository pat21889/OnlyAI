// Needs the frontend AND backend (with a database) running.
// Backend URL for test setup: CYPRESS_BACKEND_URL (default http://localhost:5000).
const backend = Cypress.env("BACKEND_URL") || "http://localhost:5000";
const stamp = Date.now();
const admin = { name: "Cy Admin", email: `cyadmin${stamp}@test.com`, tel: "0800000000", password: "secret123", role: "admin" };
const member = { name: "Cy Member", email: `cymember${stamp}@test.com`, tel: "0800000001", password: "secret123", role: "member" };
const facilityName = `Cy Court ${stamp}`;

function login(user: { email: string; password: string; name: string }) {
  cy.visit("/login");
  cy.get("input[name=email]").type(user.email);
  cy.get("input[name=password]").type(user.password);
  cy.contains("button", "Login").click();
  cy.get("[data-testid=user-name]").should("contain", user.name);
}

describe("Facilities", () => {
  before(() => {
    cy.request("POST", `${backend}/api/v1/auth/register`, admin);
    cy.request("POST", `${backend}/api/v1/auth/register`, member);
  });

  it("admin adds → edits → deletes a facility", () => {
    login(admin);
    cy.contains("a", "Add Facility").click();
    cy.contains("h1", "Add facility");

    // validation first
    cy.contains("button", "Save").click();
    cy.contains("Please enter a name");

    cy.get("input[name=name]").type(facilityName);
    cy.get("input[name=sportType]").type("Badminton");
    cy.get("input[name=location]").type("Building 1");
    cy.get("input[name=capacity]").type("4");
    cy.get("input[name=hourlyRate]").type("150");
    cy.contains("button", "Save").click();

    cy.location("pathname").should("match", /^\/facility\/[a-f0-9]{24}$/);
    cy.contains("h1", facilityName);

    cy.contains("a:visible", "Edit").click();
    // Next keeps left pages in the DOM (hidden), so target only :visible elements
    cy.get("input[name=hourlyRate]:visible").clear().type("200");
    cy.contains("button:visible", "Save").click();
    cy.contains("200 THB");

    cy.contains("button:visible", "Delete").click(); // Cypress auto-accepts confirm()
    cy.location("pathname").should("eq", "/facility");
    cy.contains("[data-testid=facility-card]:visible", facilityName).should("not.exist");
  });

  it("guest and member can view but not manage", () => {
    // seed one facility as admin via API
    cy.request("POST", `${backend}/api/v1/auth/login`, admin).then(({ body }) =>
      cy.request({
        method: "POST",
        url: `${backend}/api/v1/facilities`,
        headers: { Authorization: `Bearer ${body.data.token}` },
        body: { name: `${facilityName} view`, sportType: "Tennis", location: "Court 2", capacity: 2, hourlyRate: 100 },
      }),
    );

    // guest
    cy.visit("/facility");
    cy.contains("[data-testid=facility-card]", `${facilityName} view`).within(() => {
      cy.contains("Tennis");
      cy.contains("Edit").should("not.exist");
      cy.contains("a", `${facilityName} view`).click();
    });
    cy.contains("h1", `${facilityName} view`);
    cy.contains("a", "Book this facility").should("have.attr", "href").and("match", /^\/booking\?fid=[a-f0-9]{24}$/);

    // member
    login(member);
    cy.visit("/facility");
    cy.contains("+ Add facility").should("not.exist");
    cy.contains("[data-testid=facility-card]", `${facilityName} view`).contains("Delete").should("not.exist");

    // member is bounced from admin pages
    cy.visit("/admin/facility/new");
    cy.location("pathname").should("eq", "/login");
  });
});
