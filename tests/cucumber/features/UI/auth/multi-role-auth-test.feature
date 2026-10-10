# Covers isolation between admin and user sessions and their carts.
@ui @saucedemo
Feature: Admin and user sessions in separate contexts

  Scenario: TC_AUTH_MULTI_001 admin and user sessions keep separate carts
    Given I use the saved "admin" session
    When I create a second session from the saved "user" role
    Then both sessions should display the products page
    When I add product "Sauce Labs Backpack" to the primary session cart
    Then the primary session cart badge should show "1"
    And the secondary session cart badge should be empty

  Scenario: TC_AUTH_MULTI_002 admin and user both see the same products
    Given I use the saved "admin" session
    When I create a second session from the saved "user" role
    Then both sessions should display the products page
    And both sessions should show 6 products

  Scenario: TC_AUTH_MULTI_003 admin and user can add different items simultaneously
    Given I use the saved "admin" session
    When I create a second session from the saved "user" role
    And I add product "Sauce Labs Backpack" to the primary session cart
    And I add product "Sauce Labs Bike Light" to the secondary session cart
    Then the primary session cart badge should show "1"
    And the secondary session cart badge should show "1"
    When I open the shopping cart in both sessions
    Then the primary session cart should include product "Sauce Labs Backpack"
    And the secondary session cart should include product "Sauce Labs Bike Light"

  Scenario: TC_AUTH_MULTI_004 sorting in one context does not affect the other
    Given I use the saved "admin" session
    When I create a second session from the saved "user" role
    And I sort the primary session inventory by "hilo"
    And I sort the secondary session inventory by "za"
    Then the first visible product names in each session should differ
