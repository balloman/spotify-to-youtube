/** A type representing the request to the authorization endpoint. https://developer.spotify.com/documentation/web-api/tutorials/code-flow */
export type AuthRequest = {
  /** The Client ID generated after registering your application. */
  client_id: string;
  /** Set to code. */
  response_type: "code";
  /** The URI to redirect to after the user grants or denies permission. This URI needs to have been entered in the Redirect URI allowlist that you specified when you registered your application {@link https://developer.spotify.com/documentation/web-api/concepts/apps|See the app guide}. The value of redirect_uri here must exactly match one of the values you entered when you registered your application, including upper or lowercase, terminating slashes, and such. */
  redirect_uri: string;
  /** This provides protection against attacks such as cross-site request forgery. */
  state?: string;
  /** A space-separated list of {@link https://developer.spotify.com/documentation/web-api/concepts/scopes|scopes}.If no scopes are specified, authorization will be granted only to access publicly available information: that is, only information normally visible in the Spotify desktop, web, and mobile players. */
  scope?: string;
  /** Whether or not to force the user to approve the app again if they’ve already done so. If false (default), a user who has already approved the application may be automatically redirected to the URI specified by redirect_uri. If true, the user will not be automatically redirected and will have to approve the app again. */
  show_dialog?: BooleanString;
};

export type SuccessfulAuthResponse = {
  /** An authorization code that can be exchanged for an access token. */
  code: string;
  /** The state parameter you specified in your request. */
  state: string;
};

export type FailedAuthResponse = {
  /** An error message */
  error: string;
  /** The state parameter you specified in your request. */
  state: string;
};

export type AccessTokenRequest = {
  grant_type: "authorization_code";
  /** The authorization code returned from the previous request. */
  code: string;
  /** This parameter is used for validation only (there is no actual redirection). The value of this parameter must exactly match the value of redirect_uri supplied when requesting the authorization code. */
  redirect_uri: string;
};

export type AccessTokenHeaders = {
  /** Base 64 encoded string that contains the client ID and client secret key. The field must have the format: Authorization: Basic <base64 encoded client_id:client_secret> */
  Authorization: string;
  "Content-Type": "application/x-www-form-urlencoded";
};

export type AccessTokenResponse = {
  /** An access token that can be provided in subsequent calls, for example to Spotify Web API services. */
  access_token: string;
  token_type: "Bearer";
  /** The time period (in seconds) for which the access token is valid. */
  expires_in: number;
  /** See {@link https://developer.spotify.com/documentation/web-api/tutorials/refreshing-tokens|refreshing tokens.} */
  refresh_token: string;
};

export type BooleanString = "true" | "false";
