it("titles are correct", () => {
  const page = cy.visit("/");

  page
    .get("title")
    .should(
      "have.text",
      "Alessandro Talamona | Realizzazione e ristrutturazione di Siti Web, ECommerce ed Applicazioni Web.",
    );
  //page.get('h1').should('have.text', 'Alessandro Talamona');
});
