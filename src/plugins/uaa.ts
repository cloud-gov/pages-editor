import { decodeJwt } from "jose";
import type { JWTPayload } from "jose";
import { PayloadRequest } from "payload";
import { OAuth2Plugin } from "./payload-oauth2";


export const uaaOauth = OAuth2Plugin({
  enabled:
    typeof process.env.OAUTH_CLIENT_ID === "string" &&
    typeof process.env.OAUTH_CLIENT_SECRET === "string",
  strategyName: "uaa",
  useEmailAsIdentity: true,
  excludeEmailFromJwtToken: true,
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
    return { email: user.email, sub: user.sub };
  },
  successRedirect: (req) => {
    return "/admin";
  },
  failureRedirect: (req, err) => {
    req.payload.logger.error(err);
    return "/admin/login";
  },
});
