import { games } from "@data/switch-games.js";

export async function GET() {
	return new Response(
		JSON.stringify(games), {
			status: 200,
			headers: {
				"Content-Type": "application/json"
			}
		}
	);
}
