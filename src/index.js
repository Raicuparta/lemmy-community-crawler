import { existsSync, mkdirSync, writeFileSync } from "fs";

import CommunityCrawler from "./community.js";
import { START_URLS } from "./const.js";

const buildDir = "./build";

async function start(args) {
  if (!existsSync(buildDir)) {
    mkdirSync(buildDir);
  }

  /** @type {{ url: string, subscribers: number, monthlyActiveUsers: number, domain: string, nsfw: boolean, name: string, title: string }[]} */
  let communities = [];

  await Promise.allSettled(
    START_URLS.map(async (crawlDomain) => {
      try {
        const crawler = new CommunityCrawler(crawlDomain);
        const communityData = await crawler.crawlList();
        communities = communities.concat(
          communityData.map((community) => ({
            domain: crawlDomain,
            name: community.community.name,
            title: community.community.title,
            url: community.community.actor_id,
            subscribers: community.counts.subscribers,
            monthlyActiveUsers: community.counts.users_active_month,
            nsfw: community.community.nsfw,
          }))
        );
      } catch (e) {
        console.error(`Failed to crawl domain ${crawlDomain}`, e);
      }
    })
  );

  // Remove duplicates
  const communitySet = new Set();
  const filteredCommunities = communities.filter((community) => {
    const communityId = `${community.name}@${community.domain}`;
    if (communitySet.has(communityId)) return false;
    communitySet.add(communityId);
    return true;
  });

  writeFileSync(
    "./build/communities.json",
    JSON.stringify(filteredCommunities, null, 2)
  );
}

const args = process.argv.slice(2);
await start(args);
