# Covers capture and verification of browser console messages.
@mocking
Feature: Capture console logs

  Scenario: Capture browser log, warning, and error messages
    When I open the mocking demo
    And I emit browser console messages for verification
    Then the browser console messages should be captured
