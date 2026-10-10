# Covers inventory access through the saved admin session.
@ui @saucedemo
Feature: Admin authenticated scenarios

  Scenario: TC_AUTH_ADMIN_001 admin session opens the product inventory
    Given I use the saved "admin" session
    Then the inventory should contain 6 products
