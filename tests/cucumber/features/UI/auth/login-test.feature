# Covers SauceDemo login success, validation errors, and form behavior.
@ui @saucedemo
Feature: SauceDemo login
  As a shopper
  I want to sign in to SauceDemo
  So that I can access the product inventory

  Scenario: TC_001 valid credentials redirect to inventory
    Given I open the SauceDemo login page
    When I log in with username "standard_user" and password "secret_sauce"
    Then I should reach the products page

  Scenario: TC_002 invalid credentials show an error
    Given I open the SauceDemo login page
    When I log in with username "invalid_user" and password "wrong_password"
    Then I should see the login error message "Username and password do not match"

  Scenario: TC_003 locked out users show an error
    Given I open the SauceDemo login page
    When I log in with username "locked_out_user" and password "secret_sauce"
    Then I should see the login error message "Sorry, this user has been locked out"

  Scenario: TC_004 an empty username shows an error
    Given I open the SauceDemo login page
    When I log in with username "" and password "secret_sauce"
    Then I should see the login error message "Username is required"

  Scenario: TC_005 an empty password shows an error
    Given I open the SauceDemo login page
    When I log in with username "standard_user" and password ""
    Then I should see the login error message "Password is required"

  Scenario: TC_006 empty credentials show an error
    Given I open the SauceDemo login page
    When I log in with username "" and password ""
    Then I should see the login error message "Username is required"

  Scenario: TC_007 login form is visible on initial load
    Given I open the SauceDemo login page
    Then the login form should be visible

  Scenario: TC_008 clearing the form removes entered credentials
    Given I open the SauceDemo login page
    When I enter username "test_user" and password "test_password"
    And I clear the login form
    And I submit the login form
    Then I should see the login error message "Username is required"

  Scenario: TC_009 login error can be dismissed
    Given I open the SauceDemo login page
    When I log in with username "invalid_user" and password "wrong_password"
    Then the login error should be visible
    When I dismiss the login error
    Then the login error should not be visible