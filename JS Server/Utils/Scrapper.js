//import cheerio
import * as cheerio from "cheerio";

import links from "./Url_Link.json" assert { type: "json" };
import Utils from "./CommonUtil.js";

const Scrapper = {
  getSeasonalAnime: async (baseURL, retType) => {
    const link = baseURL + links.seasonal_anime;
    const cacheData = await Utils.setCacheIfNotAndSendRes(link, 60 * 60 * 24);
    // const htmlData = await RequestExecutor.getRequest(link);
    const $ = cheerio.load(cacheData);
    const main_div_className = ".js-categories-seasonal";
    const main_div = $(main_div_className);

    const anime_card_className = "div.js-anime-category-producer";
    const anime_card_list = main_div.find(anime_card_className);

    const anime_data_list = [];

    anime_card_list.each((i, el) => {
      const anime_name = $(el).find("div.title > span.js-title").text();
      const anime_start_date = $(el)
        .find("div.title > span.js-start_date")
        .text();
      const anime_score = $(el).find("div.title > span.js-score").text();
      const members = $(el).find("div.title > span.js-members").text();
      const anime_pVideo = $(el)
        .find("div.prodsrc > div.video > a")
        .attr("href");
      const total_eps = $(el)
        .find("div.prodsrc > div.info > span.item")
        .text()
        .split("\n")
        .filter((e) => e.includes("eps"))[0]
        ?.trim(" ")
        ?.replace(",", "");
      const anime_url = $(el).find("h2.h2_anime_title > a").attr("href");
      anime_data_list.push({
        anime_name,
        anime_start_date,
        anime_score,
        members,
        anime_pVideo,
        total_eps,
        anime_url,
      });
    });
    return retType === undefined ? anime_data_list : anime_card_list.html();
  },
};
export default Scrapper;
