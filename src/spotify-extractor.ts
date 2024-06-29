import { type SavedTrack, SpotifyApi } from "@spotify/web-api-ts-sdk";
import type {
  AccessTokenHeaders,
  AccessTokenRequest,
  AccessTokenResponse,
} from "./types";

const CLIENT_ID = process.env.CLIENT_ID || "";
const CLIENT_SECRET = process.env.CLIENT_SECRET || "";

export async function extractSpotifyInfo(code: string) {
  console.log("Extracting spotify info");
  const accessTokenResponse = await getAccessToken(code);
  console.log("Successfully got access token");
  const sdk = SpotifyApi.withAccessToken(CLIENT_ID, accessTokenResponse);
  console.log("Retrieving tracks...");
  const tracks = await getTracks(sdk);
  console.log("Successfully retrieved tracks");
}

async function getAccessToken(code: string) {
  const accessTokenRequest: AccessTokenRequest = {
    grant_type: "authorization_code",
    code,
    redirect_uri: "http://localhost:5050/",
  };
  const accessTokenHeaders: AccessTokenHeaders = {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
  };
  const params = new URLSearchParams(accessTokenRequest);
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    body: params,
    headers: accessTokenHeaders,
  });
  if (!response.ok) {
    const errorData = {
      status: response.status,
      request: {
        headers: accessTokenHeaders,
        body: params,
      },
      response: {
        headers: JSON.stringify(response.headers),
        body: await response.text(),
      },
    };
    throw new Error(`Failed to get access token: ${JSON.stringify(errorData)}`);
  }
  const responseJson = await response.json();
  return responseJson as AccessTokenResponse;
}

async function getTracks(api: SpotifyApi) {
  const batchSize = 50;
  let shouldEnd = true;
  const totalTracks: SavedTrack[] = [];
  for (let index = 0; shouldEnd; index += batchSize) {
    const getTracksResponse = await api.currentUser.tracks.savedTracks(
      batchSize,
      index,
    );
    if (index >= getTracksResponse.total) {
      shouldEnd = false;
    }
    totalTracks.push(...getTracksResponse.items);
    console.write(".");
  }
  console.write("\n");
  return totalTracks;
}
