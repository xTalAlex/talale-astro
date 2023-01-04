import { getGames, getNintentoSwitch } from "@lib/igdb";

const nintendoSwitch = await getNintentoSwitch();
const today = new Date();

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
do{
    let query = `
        fields 
            name, slug, category, status, summary, total_rating, url, first_release_date,  
            genres.name, themes.name, cover.url, artworks.url, screenshots.url,
            involved_companies.company.name, involved_companies.company.logo.url, involved_companies.company.websites.url;
        sort first_release_date desc;
        where platforms = (${nintendoSwitch.id})
                & cover != null
                & ( status = 0 | status = null )
                & first_release_date > ${Math.floor(new Date('2017.03.03').getTime() / 1000)}
                & first_release_date < ${Math.floor(today.setMonth(today.getMonth() + 3) / 1000)}
                & category = (0,8,9);
        limit ${limit};
        offset ${offset};
    `;
    newGames = await getGames(query);
    games = games.concat(newGames);
    offset += limit;
}while(newGames.length == limit);

end_time = Date.now();

const gamesCount = games.length

console.log('Fetched ' + gamesCount + ' games in ' + Math.round( (end_time-start_time)/1000 ) + 's');

export { games, gamesCount };