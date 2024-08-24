import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { getUserAgentRegex } from "browserslist-useragent-regexp";
import { writeFileSync } from "node:fs";

const userAgentRegExp = getUserAgentRegex({ allowHigherVersions: true });
const checkFunction = `export const supportedBrowsers = ${userAgentRegExp};`;
const __dirname = dirname(fileURLToPath(import.meta.url));

writeFileSync(resolve(__dirname, "../src/supported-browsers.js"), checkFunction);
