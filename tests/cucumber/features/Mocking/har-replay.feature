# Covers replaying a saved HAR and recording a temporary HAR.
@mocking
Feature: HAR recording and replay

  Scenario: Replay fruits API from the saved HAR file
    Given I replay fruits requests from the saved HAR file
    When I open the mocking demo
    Then the mocking demo page should be visible

  Scenario: Record fruits API to a temporary HAR file
    When I record the fruits API to a temporary HAR file
    Then the temporary HAR should contain a fruits request
