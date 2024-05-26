import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from 'node:url';

function executeCommand(command) {
  return execSync(command).toString().trim();
}

const commit = {
  sha: executeCommand("git rev-parse HEAD"),
  message: executeCommand("git log -1 --pretty=%B"),
  author: executeCommand("git log -1 --pretty=format:%an"),
};

const json = JSON.stringify(commit);
const __dirname = dirname(fileURLToPath(import.meta.url));

writeFileSync(resolve(__dirname, "../dist/commit.json"), json);
