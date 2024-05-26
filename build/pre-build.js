import { writeFileSync } from "node:fs"
import { dirname, resolve } from "path"
import { fileURLToPath } from 'node:url';
import { getUserAgentRegex } from "browserslist-useragent-regexp";

const userAgentRegExp = getUserAgentRegex({ allowHigherVersions: true });
const checkFunction = `export const supportedBrowsers = ${userAgentRegExp};`;
const __dirname = dirname(fileURLToPath(import.meta.url));

writeFileSync(resolve(__dirname, "../src/supported-browsers.js"), checkFunction);