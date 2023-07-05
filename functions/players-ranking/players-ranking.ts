import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { withPlanetscale } from "@netlify/planetscale";

const handler: Handler = withPlanetscale(
    async ( event: HandlerEvent, context: HandlerContext ) => {
        var statusCode = 500;
        
        const {
            planetscale: { connection },
        } = context;

        console.log('Fetching Ranks');

        const res = await connection.execute("SELECT * FROM players ORDER BY streak_record DESC, cur_streak DESC LIMIT 10");
        statusCode = 200;

        return {
            statusCode: statusCode,
            body: JSON.stringify({
                ranking : res['rows']
            }),
        };
    });

export { handler };