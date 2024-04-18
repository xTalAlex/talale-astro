import { getGames, getConsole } from "@lib/igdb";
import { fromReleaseDate, toReleaseDate } from "src/utils";

const platform = await getConsole("Nintendo Switch");

var games = [];
var newGames = [];
var limit = 500;
var offset = 0;
var start_time;
var end_time;

start_time = Date.now();

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
            name, slug, category, status, summary, total_rating, url, first_release_date,  
            genres.name, themes.name, cover.url, artworks.url, screenshots.url, language_supports.language.locale,
            involved_companies.company.name, involved_companies.company.logo.url, involved_companies.company.websites.url;
        sort first_release_date desc;
        where platforms = (${platform.id})
                & language_supports.language.locale = ("it-IT","en-US")
                & summary != null
                & genres != null
                & involved_companies != null
                & cover != null
                & ( status = 0 | status = null )
                & first_release_date > ${Math.floor(fromReleaseDate / 1000)}
                & first_release_date < ${Math.floor(toReleaseDate / 1000)}
                & category = (0,8,9);
        limit ${limit};
        offset ${offset};
    `;
  newGames = await getGames(query);
  games = games.concat(newGames);
  offset += limit;
} while (newGames.length == limit);

end_time = Date.now();

const gamesCount = games.length;

console.log(
  "Fetched " +
    gamesCount +
    " games in " +
    Math.round((end_time - start_time) / 1000) +
    "s",
);

export { games, gamesCount };
