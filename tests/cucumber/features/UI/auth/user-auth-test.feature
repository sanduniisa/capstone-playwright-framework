# Covers cart behavior using the saved standard-user session.
@ui @saucedemo
Feature: User authenticated scenarios

  Scenario: TC_AUTH_USER_001 user session can add a product to the cart
    Given I use the saved "user" session
    And I add product "Sauce Labs Backpack" to the cart
    Then the cart badge should show "1"
