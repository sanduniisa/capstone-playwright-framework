# Covers completing a SauceDemo purchase through checkout.
@ui @saucedemo
Feature: SauceDemo purchase checkout

  Scenario: TC_007 complete checkout with customer information
    Given I use the standard inventory fixture with three cart products
    When I open the shopping cart
    Then the cart should contain 3 items
    When I proceed to checkout
    Then the checkout information page should be displayed
    When I enter checkout details for "Test" "Customer" with postal code "10001"
    And I continue to the checkout overview
    Then the checkout overview should contain 3 products
    When I finish the order
    Then order completion details should be displayed