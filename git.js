// RUN THIS ON A NEW STACKBLITZ INSTANCE AND USE THE COMMAND LINE TO PUSH

import { simpleGit } from "simple-git";

// This apparently breaks without this wrapper, even for type=module in package.json
(async () => {
  try {
    const git = simpleGit();
    await git.addConfig("user.email", "97845741+circle-gon@users.noreply.github.com", false, "global");
    await git.addConfig("user.name", "circle-gon", false, "global");

    // eslint-disable-next-line no-console
    console.log("Done setting config!");
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log("Uh oh, something went wrong...");
    // eslint-disable-next-line no-console
    console.error(e);
  }
})();
