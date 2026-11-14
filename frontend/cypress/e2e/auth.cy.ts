// Needs the frontend AND backend (with a database) running.
describe("Auth", () => {
  const email = `cy${Date.now()}@test.com`; // unique per run so register never hits "duplicate email"
  const password = "secret123";

  it("register → logged in → logout → login again", () => {
    cy.visit("/register");
    cy.get("input[name=name]").type("Cypress User");
    cy.get("input[name=email]").type(email);
    cy.get("input[name=tel]").type("0812345678");
    cy.get("input[name=password]").type(password);
    cy.get("select[name=role]").select("member");
    cy.contains("button", "Register").click();

    cy.get("[data-testid=user-name]").should("contain", "Cypress User");

    cy.contains("button", "Logout").click();
    cy.contains("a", "Login").should("be.visible");
    cy.get("[data-testid=user-name]").should("not.exist");

    cy.visit("/login");
    cy.get("input[name=email]").type(email);
    cy.get("input[name=password]").type(password);
    cy.contains("button", "Login").click();
    cy.get("[data-testid=user-name]").should("contain", "Cypress User");
  });

  it("shows validation errors on empty register form", () => {
    cy.visit("/register");
    cy.contains("button", "Register").click();
    cy.contains("Please enter your name");
    cy.contains("Password must be at least 6 characters");
  });

  it("shows an error for a wrong password", () => {
    cy.visit("/login");
    cy.get("input[name=email]").type(email);
    cy.get("input[name=password]").type("wrong-password");
    cy.contains("button", "Login").click();
    cy.get("[role=alert]").should("contain", "Invalid email or password");
  });

  it("redirects guests from /mybooking to /login", () => {
    cy.visit("/mybooking");
    cy.location("pathname").should("eq", "/login");
    cy.location("search").should("contain", "callbackUrl");
  });
});
