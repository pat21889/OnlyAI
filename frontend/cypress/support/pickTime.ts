// Clicks through the 24-hour clock: the hour, then :00 or :30. time is "HH:mm".
export default function pickTime(time: string) {
  const [hh, mm] = time.split(":");
  cy.contains("button:visible", /^Start time/).click();
  cy.get("[role=dialog]").within(() => {
    cy.get(`[aria-label="${hh} o'clock"]`).click();
    cy.get(`[aria-label="${hh}:${mm}"]`).click();
  });
}
