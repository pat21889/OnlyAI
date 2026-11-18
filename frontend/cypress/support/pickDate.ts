// Opens the booking calendar, steps to the right month if needed, then clicks the day.
export default function pickDate(date: string) {
  cy.contains("button:visible", /^Date/).click();
  cy.get("[role=dialog]").then(($d) => {
    if (!$d.find(`[data-date="${date}"]`).length) cy.get("[aria-label='Next month']").click();
  });
  cy.get(`[data-date="${date}"]`).click();
}
