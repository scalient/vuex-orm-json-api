const path = require("path");
const chalk = require("chalk");
const execa = require("execa");

const bin = (name) => path.resolve(__dirname, `../node_modules/.bin/${name}`);
const run = (bin, args, opts = {}) => execa(bin, args, {stdio: "inherit", ...opts});
const step = (msg) => console.log(chalk.cyan(msg));

async function main() {
  // Run tests before release.
  step("\nRunning tests...");
  await run(bin("jest"), ["--clearCache"]);
  await run("yarn", ["lint"]);
  await run("yarn", ["test"]);

  // Clean the Git repository.
  step("\nCleaning the Git repository...");
  await run("git", ["clean", "-fd"]);

  // Build the package.
  step("\nBuilding the package...");
  await run("yarn", ["build"]);

  // Publish the package.
  step("\nPublishing the package...");
  await run("yarn", ["publish"]);
}

main().catch((err) => console.error(err));
