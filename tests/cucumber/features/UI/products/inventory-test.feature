# Covers product inventory, cart contents, and cart navigation.
@ui @saucedemo
Feature: SauceDemo inventory and cart

  Scenario: TC_003 add a product to the cart
    Given I open the SauceDemo login page
    When I log in with username "standard_user" and password "secret_sauce"
    When I add product "Sauce Labs Backpack" to the cart
    Then the cart badge should show "1"

  Scenario: TC_004 add multiple products to the cart
    Given I use the standard inventory fixture
    When I add product "Sauce Labs Backpack" to the cart
    And I add product "Sauce Labs Bike Light" to the cart
    And I add product "Sauce Labs Bolt T-Shirt" to the cart
    Then the cart badge should show "3"
    And the inventory should show 3 remove buttons

  Scenario: TC_005 multiple products are shown in the cart
    Given I use the standard inventory fixture with three cart products
    When I open the shopping cart
    Then the cart page should be displayed
    And the cart should contain 3 items

  Scenario: TC_006 continue shopping and proceed to checkout
    Given I use the standard inventory fixture with three cart products
    When I open the shopping cart
    Then the cart should contain 3 items
    And the continue shopping button should be enabled
    And the checkout button should be enabled
    When I continue shopping
    Then I should be on the inventory page
    When I add product "Test.allTheThings() T-Shirt (Red)" to the cart
    Then the cart badge should show "4"
    When I open the shopping cart
    Then the cart should contain 4 items
    And the cart should include product "Sauce Labs Backpack"
    And the cart should include product "Sauce Labs Bike Light"
    And the cart should include product "Sauce Labs Bolt T-Shirt"
    And the cart should include product "Test.allTheThings() T-Shirt (Red)"
    And the checkout button should be enabled
    When I proceed to checkout
    Then the checkout information page should be displayed