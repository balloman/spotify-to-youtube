import { ReasonPhrases, StatusCodes } from "http-status-codes";
import open from "open";
import { SCOPES } from "./constants";
import type {
  AuthRequest,
  FailedAuthResponse,
  SuccessfulAuthResponse,
} from "./types";
import type { AuthorizationEvent } from "./worker";
const worker = new Worker("./src/worker.ts");

console.log("Hello World!");
console.log("Ready to login? Type 'y'");
for await (const line of console) {
  if (line === "y") {
    break;
  }
  console.log("Exiting...");
  process.exit(0);
}

const authRequest: AuthRequest = {
  client_id: process.env.CLIENT_ID || "",
  response_type: "code",
  scope: SCOPES.join(" "),
  redirect_uri: "http://localhost:5050/",
};
const params = new URLSearchParams(authRequest);
await open(`https://accounts.spotify.com/authorize?${params.toString()}`);

Bun.serve({
  async fetch(req, ctx) {
    const url = new URL(req.url);
    const params = new URLSearchParams(url.search);
    let parsedParams: SuccessfulAuthResponse | FailedAuthResponse;
    if (params.has("code")) {
      parsedParams = Object.fromEntries(
        params.entries(),
      ) as SuccessfulAuthResponse;
    } else {
      parsedParams = Object.fromEntries(params.entries()) as FailedAuthResponse;
      console.error(parsedParams);
      return new Response(ReasonPhrases.BAD_REQUEST, {
        status: StatusCodes.BAD_REQUEST,
      });
    }
    const code = parsedParams.code;
    const messageEvent: AuthorizationEvent = {
      type: "authorization",
      data: {
        code,
      },
    };
    worker.postMessage(messageEvent);
    return new Response("Success. You can close this tab now.");
  },
  port: 5050,
});
