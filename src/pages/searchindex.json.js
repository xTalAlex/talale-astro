import { games } from "@data/switch-games.js";

export async function get() {
    return {
        body: JSON.stringify(
            games,
            false,
            1
        ),
    };
}
