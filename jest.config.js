/** @type {import('@jest/types').Config.ProjectConfig} */
module.exports = {
  preset: "jest-expo",
  setupFiles: ["<rootDir>/test/setup.ts"],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "\\.styles\\.ts$",
    "\\.style\\.ts$",
    "\\.types\\.ts$",
  ],
  collectCoverageFrom: [
    "app/**/*.{ts,tsx}",
    "!app/**/*.stories.tsx",
    "!app/app.tsx",
    "!app/devtools/**/*",
  ],
}
