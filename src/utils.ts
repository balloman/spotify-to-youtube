import { ReasonPhrases, StatusCodes } from "http-status-codes";

/**
 * Handles common response for all requests
 * @param req HTTP request
 * @returns Either a response or undefined if the request is valid
 */
export function handleCommonResponse(req: Request): Response | undefined {
  if (req.method !== "POST") {
    return new Response(ReasonPhrases.METHOD_NOT_ALLOWED, {
      status: StatusCodes.METHOD_NOT_ALLOWED,
    });
  }
  const url = new URL(req.url);
  if (url.pathname !== "/") {
    return new Response(ReasonPhrases.NOT_FOUND, {
      status: StatusCodes.NOT_FOUND,
    });
  }
}
