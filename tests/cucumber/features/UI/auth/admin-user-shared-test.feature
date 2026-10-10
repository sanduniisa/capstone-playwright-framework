# Covers cart and checkout access for both saved roles.
@ui @saucedemo
Feature: Scenarios shared by admin and user projects

  Scenario: TC_AUTH_SHARED_001 admin session can review cart and start checkout
    Given I use the saved "admin" session
    And I add product "Sauce Labs Backpack" to the cart
    When I open the shopping cart
    Then the cart page should be displayed
    And the cart should include product "Sauce Labs Backpack"
    When I proceed to checkout
    Then the checkout information page should be displayed

  Scenario: TC_AUTH_SHARED_001 user session can review cart and start checkout
    Given I use the saved "user" session
    And I add product "Sauce Labs Backpack" to the cart
    When I open the shopping cart
    Then the cart page should be displayed
    And the cart should include product "Sauce Labs Backpack"
    When I proceed to checkout
    Then the checkout information page should be displayed
