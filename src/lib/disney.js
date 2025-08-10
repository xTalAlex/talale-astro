const DISNEY_API_URL = "https://api.disneyapi.dev";
const DISNEY_GRAPHQL_URL = "https://api.disneyapi.dev/graphql";

/**
 * @typedef {Object} DisneyCharacter
 * @property {number} _id - Unique character identifier
 * @property {string} name - Character name
 * @property {string} url - API URL for this character
 * @property {string} sourceUrl - Source URL (usually Disney Wiki)
 * @property {string} imageUrl - Character image URL
 * @property {string[]} films - List of films the character appears in
 * @property {string[]} shortFilms - List of short films
 * @property {string[]} tvShows - List of TV shows
 * @property {string[]} videoGames - List of video games
 * @property {string[]} parkAttractions - List of park attractions
 * @property {string[]} allies - List of character allies
 * @property {string[]} enemies - List of character enemies
 * @property {string} alignment - Character alignment (good, bad, neutral)
 * @property {string} createdAt - Creation timestamp
 * @property {string} updatedAt - Last update timestamp
 * @property {number} __v - Version field
 */

/**
 * @typedef {Object} PaginationInfo
 * @property {number} totalPages - Total number of pages
 * @property {number} count - Number of items in current page
 * @property {string|null} previousPage - URL for previous page
 * @property {string|null} nextPage - URL for next page
 */

/**
 * @typedef {Object} DisneyApiResponse
 * @property {PaginationInfo} info - Pagination information
 * @property {DisneyCharacter[]} data - Array of characters
 */

/**
 * @typedef {Object} DisneyApiFilter
 * @property {string|null} name - Character name filter
 * @property {string|null} alignment - Character alignment filter
 * @property {string|null} films - Film filter
 * @property {string|null} shortFilms - Short film filter
 * @property {string|null} tvShows - TV show filter
 * @property {string|null} videoGames - Video game filter
 * @property {string|null} allies - Allies filter
 * @property {string|null} enemies - Enemies filter
 */

/**
 * Get all Disney characters
 * @param {Object} [options={}] - Query options (optional)
 * @param {number} [options.page=1] - Page number
 * @param {string|null} [options.name] - Character name filter
 * @param {string|null} [options.alignment] - Character alignment filter
 * @param {string|null} [options.films] - Film filter
 * @param {string|null} [options.shortFilms] - Short film filter
 * @param {string|null} [options.tvShows] - TV show filter
 * @param {string|null} [options.videoGames] - Video game filter
 * @param {string|null} [options.allies] - Allies filter
 * @param {string|null} [options.enemies] - Enemies filter
 * @returns {Promise<DisneyCharacter[]>} - Array of Disney characters
 */
export const getAllCharacters = async ({ page = 1, ...filters } = {}) => {
  const searchParams = new URLSearchParams();
  searchParams.set("page", page.toString());
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      searchParams.set(key, value.toString());
    }
  });
  const response = await fetch(
    `${DISNEY_API_URL}/character?${searchParams.toString()}`,
  )
    .then((response) => {
      if (!response.ok) {
        console.error("Failed to fetch characters");
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error fetching characters:", error);
      throw error;
    });
  return response?.data ?? [];
};

/**
 * Get a specific Disney character by ID
 * @param {string} id - Character ID
 * @returns {Promise<DisneyCharacter|null>} - The character object or null if not found
 */
export const getCharacter = async (id) => {
  const response = fetch(`${DISNEY_API_URL}/character/${id}`)
    .then((response) => {
      if (!response.ok) {
        console.error("Failed to fetch character");
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error fetching character:", error);
      throw error;
    });
  return response?.data ?? null;
};
