import { getGames, getNintentoSwitch } from "../lib/igdb";

const nintendoSwitch = await getNintentoSwitch();

var games = [];
var newGames = [];
var limit = 500;
var offset = 0;
var today = new Date();
var start_time;
var end_time;

start_time = Date.now();

do{
    let query = `
        fields name, slug, version_title, category, status, storyline, summary, total_rating, total_rating_count, url, created_at, first_release_date, 
            websites.*, release_dates.*, game_modes.*, genres.*, themes.*, similar_games.*,
            cover.*, artworks.*, screenshots.*, videos.*,
            involved_companies.*, involved_companies.company.*, involved_companies.company.logo.*, involved_companies.company.websites.*;
        sort first_release_date desc;
        where platforms = (${nintendoSwitch.id}) 
                & cover != null
                & ( status = 0 | status = null )
                & first_release_date > ${Math.floor(new Date('2017.03.03').getTime() / 1000)}
                & first_release_date < ${Math.floor(today.setMonth(today.getMonth() + 1) / 1000)}
                & category = (0,8,9);
        limit ${limit};
        offset ${offset};
    `;
    newGames = await getGames(query);
    games = games.concat(newGames);
    offset += limit;
}while(newGames.length == limit);

end_time = Date.now();

console.log('Fetched ' + games.length + ' games in ' + Math.round( (end_time-start_time)/1000 ) + 's');

export { games };