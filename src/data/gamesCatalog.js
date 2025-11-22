import { getGames, getConsole } from "@lib/igdb";
import { fromReleaseDate, toReleaseDate } from "@lib/utils";
import Config from "@config/general.json";

const platform = await getConsole(Config.igdb.console).catch((error) => {
  console.error("Failed to fetch console from IGDB", error);
  return null;
});

var games = [];
var newGames = [];
var limit = 500;
var offset = 0;
var startTime;
var endTime;

startTime = Date.now();

/**
 *
 * Additional fields:
 *  version_title, total_rating_count, storyline, created_at
 *  websites.url, video.video_id, similar_games.slug,
 *  game_modes.name,
 * */
do {
  let query = `
        fields 
            name, slug, game_type.type, game_status, summary, total_rating, url, first_release_date,  
            genres.name, themes.name, cover.url, artworks.url, screenshots.url, language_supports.language.locale,
            involved_companies.company.name, involved_companies.company.logo.url, involved_companies.company.websites.url;
        sort first_release_date desc;
        where ${platform ? `platforms = (${platform.id}) & ` : ""}
                language_supports.language.locale = ("it-IT","en-US")
                & summary != null
                & genres != null
                & involved_companies != null
                & cover != null
                & (game_status = null | game_status = 0)
                & first_release_date > ${Math.floor(fromReleaseDate / 1000)}
                & first_release_date < ${Math.floor(toReleaseDate / 1000)}
                & game_type = (0,3,8,11);
        limit ${limit};
        offset ${offset};
    `;
  newGames = await getGames(query).catch((error) => {
    console.error("Failed to fetch games from IGDB", error);
    return [];
  });
  games = games.concat(newGames);
  offset += limit;
} while (newGames.length == limit);

endTime = Date.now();

const gamesCount = games.length;

console.log(
  "Fetched " +
    gamesCount +
    " games in " +
    Math.round((endTime - startTime) / 1000) +
    "s",
);

export { games, gamesCount };
