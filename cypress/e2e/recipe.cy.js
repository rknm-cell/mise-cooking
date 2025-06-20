describe('Recipe Detail', () => {
    it('should navigate to to recipe detail', () => {
        cy.visit('http://localhost:3000/recipes')

        cy.get('a[href*="[id]').click()
    })
})