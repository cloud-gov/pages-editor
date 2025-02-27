import { SignJWT } from "jose";
import crypto from "node:crypto";
import type {
  CollectionSlug,
  Endpoint,
  JsonObject,
  PaginatedDocs,
  PayloadHandler,
  PayloadRequest,
  RequestContext,
  TypeWithID,
  User,
} from "payload";
import { generatePayloadCookie, getFieldsToSign } from "payload";
import { defaultGetToken } from "./default-get-token";
import type { PluginTypes } from "./types";

export const createCallbackEndpoint = (
  pluginOptions: PluginTypes,
): Endpoint[] => {
  const handler: PayloadHandler = async (req: PayloadRequest) => {
    try {
      // Obtain code from either POST body or GET query parameters
      let code: string | undefined;
      if (req.method === "POST") {
        // Handle form data from POST request (used by Apple OAuth)
        const contentType = req.headers.get("content-type");
        if (contentType?.includes("application/x-www-form-urlencoded")) {
          const text = await (req as unknown as Request).text();
          const formData = new URLSearchParams(text);
          code = formData.get("code") || undefined;
        }
      } else if (req.method === "GET") {
        // Handle query parameters (used by Google OAuth)
        code =
          typeof req.query === "object" && req.query
            ? (req.query as { code?: string }).code
            : undefined;
      }
      if (typeof code !== "string") {
        throw new Error(
          `Code not found in ${req.method === "POST" ? "body" : "query"}: ${
            req.method === "POST" ? "form-data" : JSON.stringify(req.query)
          }`,
        );
      }

      // /////////////////////////////////////
      // shorthands
      // /////////////////////////////////////
      const subFieldName = pluginOptions.subFieldName || "sub";
      const authCollection = (pluginOptions.authCollection ||
        "users") as CollectionSlug;
      const collectionConfig = req.payload.collections[authCollection].config;
      const payloadConfig = req.payload.config;
      const callbackPath = pluginOptions.callbackPath || "/oauth/callback";
      const redirectUri = `${pluginOptions.serverURL}/api/${authCollection}${callbackPath}`;
      const useEmailAsIdentity = pluginOptions.useEmailAsIdentity ?? false;
      const excludeEmailFromJwtToken =
        !useEmailAsIdentity || pluginOptions.excludeEmailFromJwtToken || false;

      // /////////////////////////////////////
      // beforeOperation - Collection
      // /////////////////////////////////////
      // Not implemented - reserved for future use

      // /////////////////////////////////////
      // obtain access token or id_token
      // /////////////////////////////////////
      let token: string;

      if (pluginOptions.getToken) {
        token = await pluginOptions.getToken(code, req);
      } else {
        token = await defaultGetToken(
          pluginOptions.tokenEndpoint,
          pluginOptions.clientId,
          pluginOptions.clientSecret,
          redirectUri,
          code,
        );
      }

      if (typeof token !== "string") {
        throw new Error(`Invalid token response: ${token}`);
      }

      // /////////////////////////////////////
      // get user info
      // /////////////////////////////////////
      const userInfo = await pluginOptions.getUserInfo(token, req);

      // /////////////////////////////////////
      // ensure user exists
      // /////////////////////////////////////
      let existingUser: PaginatedDocs<JsonObject & TypeWithID>;

      // CUSTOM BEHAVIOR
      // Use email as the unique identifier
      existingUser = await req.payload.find({
        req,
        collection: authCollection,
        where: { email: { equals: userInfo.email } },
        showHiddenFields: true,
        limit: 1,
      });
      let user = existingUser.docs[0] as User;
      // don't create new users
      if (!user) throw new Error(`No user matching ${userInfo.email}`);
      // update the sub to match UAA
      await req.payload.update({
        collection: authCollection,
        id: user.id,
        data: {
          sub: userInfo.sub as string
        }
      })

      // /////////////////////////////////////
      // beforeLogin - Collection
      // /////////////////////////////////////
      await collectionConfig.hooks.beforeLogin.reduce(
        async (priorHook, hook) => {
          await priorHook;

          const hookResult = await hook({
            collection: collectionConfig,
            context: req.context || ({} as RequestContext),
            req,
            user,
          });

          if (hookResult) {
            user = hookResult as User;
          }
        },
        Promise.resolve(),
      );

      // /////////////////////////////////////
      // login - OAuth2
      // /////////////////////////////////////
      const fieldsToSign = getFieldsToSign({
        collectionConfig,
        email: excludeEmailFromJwtToken ? "" : user.email || "",
        user: user as PayloadRequest["user"],
      });

      const jwtToken = await new SignJWT(fieldsToSign)
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime(`${collectionConfig.auth.tokenExpiration} secs`)
        .sign(new TextEncoder().encode(req.payload.secret));
      req.user = user as PayloadRequest["user"];

      // /////////////////////////////////////
      // afterLogin - Collection
      // /////////////////////////////////////
      await collectionConfig.hooks.afterLogin.reduce(
        async (priorHook, hook) => {
          await priorHook;

          const hookResult = await hook({
            collection: collectionConfig,
            context: req.context || ({} as RequestContext),
            req,
            token: jwtToken,
            user,
          });

          if (hookResult) {
            user = hookResult as User;
          }
        },
        Promise.resolve(),
      );

      // /////////////////////////////////////
      // afterRead - Fields
      // /////////////////////////////////////
      // Not implemented - reserved for future use

      // /////////////////////////////////////
      // generate and set cookie
      // /////////////////////////////////////
      const cookie = generatePayloadCookie({
        collectionAuthConfig: collectionConfig.auth,
        cookiePrefix: payloadConfig.cookiePrefix,
        token: jwtToken,
      });

      // /////////////////////////////////////
      // success redirect
      // /////////////////////////////////////
      return new Response(null, {
        headers: {
          "Set-Cookie": cookie,
          Location: await pluginOptions.successRedirect(req, jwtToken),
        },
        status: 302,
      });
    } catch (error) {
      // /////////////////////////////////////
      // failure redirect
      // /////////////////////////////////////
      return new Response(null, {
        headers: {
          "Content-Type": "application/json",
          Location: await pluginOptions.failureRedirect(req, error),
        },
        status: 302,
      });
    }
  };

  const path = pluginOptions.callbackPath || "/oauth/callback";

  return [
    { method: "get", path, handler },
    { method: "post", path, handler },
  ];
};
