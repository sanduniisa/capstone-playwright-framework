// Shared UI test data kept outside the spec to separate scenario values from test logic.
export const loginScenarios = [
  {
    id: "TC_001",
    username: "standard_user",
    password: "secret_sauce",
    description: "valid credentials redirect to inventory",
  },
] as const;
