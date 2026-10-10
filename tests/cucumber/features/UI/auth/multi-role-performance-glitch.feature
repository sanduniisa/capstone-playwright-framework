# Runs the saved admin and performance_glitch_user checks as separate parallel scenarios.
@ui @saucedemo @parallel-auth
Feature: Admin and performance glitch user parallel authentication

  Scenario: TC_AUTH_PARALLEL_001 admin session loads the inventory
    Given I use the saved "admin" session
    Then the inventory should contain 6 products

  Scenario: TC_AUTH_PARALLEL_002 performance_glitch_user loads the inventory
    Given I use the saved "performance_glitch_user" session
    Then the inventory should contain 6 products