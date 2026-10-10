# Covers combined ReqRes API checks and SauceDemo UI workflows.
@api @reqres @saucedemo
Feature: ReqRes API and SauceDemo UI combined scenarios

  Scenario: TC027 ReqRes user lookup and SauceDemo login
    When I request ReqRes user 2
    Then ReqRes response status should be 200
    And ReqRes response content type should be JSON
    And ReqRes response user ID should be 2
    Given I open the SauceDemo login page
    When I log in with username "standard_user" and password "secret_sauce"
    Then I should reach the products page

  Scenario: TC028 ReqRes user list and SauceDemo inventory validation
    When I request ReqRes users page "1"
    Then ReqRes response status should be 200
    And ReqRes user list should be page 1 with 6 results
    Given I use the standard inventory fixture
    Then the inventory should contain 6 products

  Scenario: TC029 SauceDemo cart action and ReqRes create user
    Given I use the standard inventory fixture
    When I add product "Sauce Labs Backpack" to the cart
    Then the cart badge should show "1"
    When I create a ReqRes user with JSON '{"name":"Combined Test User","job":"QA Engineer"}'
    Then ReqRes response status should be 201
    And ReqRes response body should contain JSON '{"name":"Combined Test User","job":"QA Engineer"}'
    And ReqRes response should include generated ID and timestamp