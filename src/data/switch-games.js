import { getGames, getNintentoSwitch } from "../lib/igdb";

const nintendoSwitch = await getNintentoSwitch();

let games = [];
let newGames = [];
let limit = 500;
let offset = 0;

console.log(new Date().toLocaleTimeString());

do{
    let query = `
        fields *,
            websites.*, release_dates.*, game_modes.*, genres.*, themes.*, similar_games.*,
            cover.*, artworks.*, screenshots.*, videos.*,
            involved_companies.*, involved_companies.company.*, involved_companies.company.logo.*, involved_companies.company.websites.*;
        sort first_release_date desc;
        where platforms = (${nintendoSwitch.id}) 
                & cover != null 
                & (first_release_date != null & first_release_date >= ${Math.floor(new Date('2017.03.03').getTime() / 1000)} );
        limit ${limit};
        offset ${offset};
    `;
    newGames = await getGames(query);
    games = newGames;
    offset += limit;
    console.log(offset);
}while(newGames.length == limit);

console.log(new Date().toLocaleTimeString());

export { games };