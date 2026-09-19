// API test data kept separate from execution logic for the ReqRes suite.
export const reqresPostScenarios = [
  {
    id: "TC011",
    description: "accepts a body with name missing",
    requestBody: { job: "Senior QA Engineer" },
    expectedBody: { job: "Senior QA Engineer" },
  },
  {
    id: "TC012",
    description: "accepts an empty name",
    requestBody: { name: "", job: "Senior QA Engineer" },
    expectedBody: { name: "", job: "Senior QA Engineer" },
  },
  {
    id: "TC013",
    description: "accepts a null name",
    requestBody: { name: null, job: "Senior QA Engineer" },
    expectedBody: { name: null, job: "Senior QA Engineer" },
  },
  {
    id: "TC014",
    description: "accepts wrong field data types",
    requestBody: { name: 123, job: true },
    expectedBody: { name: 123, job: true },
  },
  {
    id: "TC015",
    description: "accepts an extra field",
    requestBody: { name: "Sanduni", job: "QA", random: "abc" },
    expectedBody: { name: "Sanduni", job: "QA", random: "abc" },
  },
] as const;
