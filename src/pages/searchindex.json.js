import { games } from "@data/gamesCatalog";

export async function GET() {
  return new Response(JSON.stringify(games));
}
