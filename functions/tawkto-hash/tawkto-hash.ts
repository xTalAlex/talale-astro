import { Handler } from "@netlify/functions";
import Base64 from "crypto-js/enc-base64";
import hmacSHA256 from "crypto-js/hmac-sha256";

const handler: Handler = async (event) => {
  let statusCode = 500;

  const { body } = event;

  if (!body) {
    statusCode = 400;
    return {
      statusCode: statusCode,
      body: "Missing body",
    };
  }

  const { email } = JSON.parse(body);
  const key = "7579df8f50cb2d01262d60a06f9304f187e746a8";

  const hash = Base64.stringify(hmacSHA256(email, key));
  statusCode = 200;

  console.log(email, "-", hash);

  return {
    statusCode: statusCode,
    body: JSON.stringify({
      hash,
    }),
  };
};

export { handler };
