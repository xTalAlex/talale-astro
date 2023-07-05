import { Handler } from "@netlify/functions";
import { withPlanetscale } from "@netlify/planetscale";

const handler: Handler = withPlanetscale(
    async ( event, context ) => {
        var statusCode = 500;

        const {
            planetscale: { connection },
        } = context;

        //const { identity, user } = context.clientContext;

        const { body } = event;

        if (!body) {
            statusCode = 400;
            return {
                statusCode: statusCode,
                body: "Missing body",
            };
        }

        const { user, victory } = JSON.parse(body);

        console.log( user.email + '(' + user.user_metadata.full_name + ' / ' + user.id + ' ) ' + ( victory ? 'WIN' : 'LOSS') );

        const res = await connection.execute("SELECT * FROM players WHERE user_id = ?", [
                user.id
            ]);

        if(!res['rows'].length){
            await connection.execute("INSERT INTO players ( user_id, name, email, cur_streak, streak_record ) VALUES ( ?, ? , ? , ? , ? )", [
                user.id,
                user.user_metadata.full_name,
                user.email,
                victory,
                victory
            ]);
            statusCode = 201;
        }
        else{
            let cur_streak = victory ? res['rows'][0]['cur_streak'] + 1 : 0;
            let streak_record = res['rows'][0]['streak_record'] > cur_streak ? res['rows'][0]['streak_record'] : cur_streak;
            await connection.execute("UPDATE players SET cur_streak = ?, streak_record = ?, name = ?, email = ? WHERE user_id = ?", [
                cur_streak,
                streak_record,
                user.user_metadata.full_name,
                user.email,
                user.id
            ]);
            statusCode = 204;
        }

        return {
            statusCode: statusCode
        };
    });

export { handler };