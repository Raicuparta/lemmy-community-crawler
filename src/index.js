import { existsSync, mkdirSync, writeFileSync } from "fs";

import CommunityCrawler from "./community.js";
import { START_URLS } from "./const.js";

const buildDir = "./build";

async function start(args) {
  if (!existsSync(buildDir)) {
    mkdirSync(buildDir);
  }

  writeFileSync(`${buildDir}/output.json`, JSON.stringify(["test"], null, 2));
  return;

  const communityMap = {};

  await Promise.allSettled(
    START_URLS.map(async (crawlDomain) => {
      try {
        const crawler = new CommunityCrawler(crawlDomain);
        const communityData = await crawler.crawlList();
        communityMap[crawlDomain] = communityData;
      } catch (e) {
        console.error(`Failed to crawl domain ${crawlDomain}`, e);
      }
    })
  );

  console.log("result", communityMap);

  writeFileSync("./build/output.json", JSON.stringify(communityMap, null, 2));
}

const args = process.argv.slice(2);
await start(args);
