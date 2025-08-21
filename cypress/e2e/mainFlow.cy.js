describe("Main Flow Test", () => {
  beforeEach(() => {
    // Visit the main page
    cy.visit("http://localhost:3000");
  });

  it("Generates content and copies to clipboard", () => {
    // Check that the textarea is present
    cy.get(
      'textarea[placeholder="Enter your product headline, feature description, or marketing copy that you\'d like to improve..."]'
    ).should("exist");

    // Enter text in the textarea
    cy.get("textarea").type("My product headline");

    // Select a tone
    cy.get("select").select("Professional");

    // Select a length
    cy.contains("Medium").click();

    // Click the generate button
    cy.contains("Generate Content").click();

    // Wait for the variations to be generated
    cy.contains("Generated Variations").should("exist");

    // Check that at least one variation is present
    cy.get("div.p-4.bg-gray-50.rounded-lg").should("have.length.at.least", 1);
  });
});
