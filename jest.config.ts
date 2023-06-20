import type { Config } from "jest";

const config: Config = {
  verbose: true,
  testEnvironment: "node",
  coveragePathIgnorePatterns: ["/node_modules/"],
};

export default config;
