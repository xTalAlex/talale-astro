import { games } from "@src/data/gamesCatalog";

export async function GET() {
  return new Response(JSON.stringify(games));
}
