import { getGames, getConsole } from "@lib/igdb";
import { fromReleaseDate, toReleaseDate } from "@lib/utils";
import Config from "@config/general.json";
import type {
  Game as IgdbGame,
  Cover,
  Artwork,
  Screenshot,
  Genre,
  Theme,
  InvolvedCompany,
  Company,
  CompanyLogo,
  CompanyWebsite,
} from "igdb-api-types";
import type { NormalizedGame } from "@src/types";

const platform = await getConsole(Config.igdb.console).catch((error) => {
  console.error("Failed to fetch console from IGDB", error);
  return null;
});

let rawGames: IgdbGame[] = [];
let newGames: IgdbGame[] = [];
const limit = 500;
let offset = 0;
const startTime = Date.now();
let endTime: number;
const platformId = platform?.id ?? 508;

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
        where platforms = (${platformId})
                & language_supports.language.locale = ("it-IT","en-US")
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
  newGames = await getGames(query).catch((error: unknown) => {
    console.error("Failed to fetch games from IGDB", error);
    return [];
  });
  rawGames = rawGames.concat(newGames);
  offset += limit;
} while (newGames.length == limit);

endTime = Date.now();

export const gamesCount = rawGames.length;

console.log(
  "Fetched " +
    gamesCount +
    " games in " +
    Math.round((endTime - startTime) / 1000) +
    "s",
);

export const games: NormalizedGame[] = rawGames.map((game) => ({
  slug: game.slug!,
  name: game.name!,
  cover: {
    url: (game.cover as Cover)?.url?.replace("t_thumb", "t_cover_big"),
    thumb: (game.cover as Cover)?.url,
  },
  screenshots: (game.screenshots as Screenshot[])?.map((s) => ({
    url: s.url!.replace("t_thumb", "t_screenshot_big"),
  })),
  artworks: (game.artworks as Artwork[])?.map((a) => ({
    url: a.url!.replace("t_thumb", "t_screenshot_big"),
  })),
  url: game.url!,
  platforms: game.platforms as { id: number; name: string }[] | undefined,
  totalRating: game.total_rating,
  firstReleaseDate: game.first_release_date,
  summary: game.summary,
  genres: (game.genres as Genre[])?.map((g) => ({ id: g.id, name: g.name! })),
  themes: (game.themes as Theme[])?.map((t) => ({ id: t.id, name: t.name! })),
  involvedCompanies: (game.involved_companies as InvolvedCompany[])?.map(
    (ic) => {
      const company = ic.company as Company;
      return {
        id: company.id,
        name: company.name ?? "",
        logo: (company.logo as CompanyLogo | undefined)?.url,
        websites:
          (company.websites as CompanyWebsite[] | undefined)?.map((w) =>
            w.url?.startsWith("http") ? w.url! : `//${w.url!}`,
          ) ?? [],
      };
    },
  ),
}));
