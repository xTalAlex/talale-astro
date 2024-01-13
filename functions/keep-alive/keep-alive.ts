import { Handler } from "@netlify/functions";
import { withPlanetscale } from "@netlify/planetscale";

const handler: Handler = withPlanetscale(
    async ( event, context ) => {
        var statusCode = 500;

        const {
            planetscale: { connection },
        } = context;

        console.log( "Keep Alive - Database" );

        const res = await connection.execute("SELECT * FROM settings WHERE name = 'keep_alive'");

        if(!res['rows'].length){
            await connection.execute("INSERT INTO settings ( name, value ) VALUES ( 'keep_alive' , ? )", [
                Date.now()
            ]);
            statusCode = 201;
        }
        else{
            await connection.execute("UPDATE settings SET value = ? WHERE name = 'keep_alive'", [
                Date.now()
            ]);
            statusCode = 204;
        }

        return {
            statusCode: statusCode
        };
    });

export { handler };