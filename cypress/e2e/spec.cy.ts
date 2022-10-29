describe("My First Test", () => {
  it("Visits the initial project page", () => {
    cy.visit("/dashboard")
    cy.contains("DASHBOARD BANYUWANGI")
  })
})
