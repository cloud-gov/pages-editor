import { decodeJwt, createRemoteJWKSet, jwtVerify } from "jose";
import type { JWTPayload } from "jose";
import { PayloadRequest } from "payload";
import { OAuth2Plugin, defaultGetToken } from "payload-oauth2";


export const uaaOauth = OAuth2Plugin({
  enabled:
    typeof process.env.OAUTH_CLIENT_ID === "string" &&
    typeof process.env.OAUTH_CLIENT_SECRET === "string",
  strategyName: "uaa",
  useEmailAsIdentity: false,
  serverURL: process.env.PUBLIC_URL || "http://localhost:3000",
  clientId: process.env.OAUTH_CLIENT_ID || "",
  clientSecret: process.env.OAUTH_CLIENT_SECRET || "",
  authorizePath: "/oauth/uaa",
  callbackPath: "/oauth/uaa/callback",
  authCollection: "users",
  tokenEndpoint: process.env.OAUTH_TOKEN_ENDPOINT || "",
  scopes: [ 'openid'],
  providerAuthorizationUrl: process.env.OAUTH_AUTH_ENDPOINT || "",
  getUserInfo: async (accessToken: string) => {
    const user: JWTPayload = decodeJwt(accessToken);
    // db lookup
    const sites = [{ site: 'test' }]
    return { email: user.email, sub: user.sub, sites };
  },
  /**
   * This param is optional to demonstrate how to customize your own
   * `getToken` function (i.e. add hooks to run after getting the token)
   * Leave this blank should you wish to use the default getToken function
   */
  getToken: async (code: string, req: PayloadRequest) => {
    const redirectUri = `${process.env.PUBLIC_URL || "http://localhost:3000"}/api/users/oauth/uaa/callback`;
    const tokenResponse = await fetch(process.env.OAUTH_TOKEN_ENDPOINT || "", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
        },
        body: new URLSearchParams({
            code,
            client_id: process.env.OAUTH_CLIENT_ID || "",
            client_secret: process.env.OAUTH_CLIENT_SECRET || "",
            redirect_uri: redirectUri,
            grant_type: "authorization_code",
        }).toString(),
    });
    const tokenData = await tokenResponse.json();
    const uaaUser: JWTPayload = decodeJwt(tokenData?.access_token);
    if ((uaaUser?.email as string).includes('@gsa.gov')){
      return tokenData.access_token
    }

    return null;
  },
  successRedirect: (req) => {
    return "/admin";
  },
  failureRedirect: (req, err) => {
    req.payload.logger.error(err);
    return "/admin/login";
  },
});
