export interface Post {
  id: string;
  title: string;
  slug: string;
  link: string;
  date: string;
  excerpt: string;
  content: string;
  featuredImage: { sourceUrl: string; title: string; altText: string };
}

export interface NormalizedCompany {
  id: number;
  name: string;
  logo?: string;
  websites: string[];
}

export interface NormalizedGame {
  slug: string;
  name: string;
  cover?: { url?: string; thumb?: string };
  screenshots?: { url: string }[];
  artworks?: { url: string }[];
  url: string;
  platforms?: { id: number; name: string }[];
  totalRating?: number;
  firstReleaseDate?: number;
  summary?: string;
  genres?: { id: number; name: string }[];
  themes?: { id: number; name: string }[];
  involvedCompanies?: NormalizedCompany[];
}
