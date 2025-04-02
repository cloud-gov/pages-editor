import crypto from "crypto";
import { JWTPayload, jwtVerify } from "jose";
import {
  AuthStrategy,
  AuthStrategyResult,
  User,
  parseCookies,
} from "payload";
import { PluginTypes } from "./types";

export const createAuthStrategy = (
  pluginOptions: PluginTypes,
  subFieldName: string,
): AuthStrategy => {
  const authStrategy: AuthStrategy = {
    name: pluginOptions.strategyName,
    authenticate: async ({ headers, payload }): Promise<AuthStrategyResult> => {
      try {
        const cookie = parseCookies(headers);
        const token = cookie.get(`${payload.config.cookiePrefix}-token`);
        if (!token) return { user: null };

        let jwtUser: JWTPayload | null = null;
        try {
          const secret = crypto
            .createHash("sha256")
            .update(payload.config.secret)
            .digest("hex")
            .slice(0, 32);

          const { payload: verifiedPayload } = await jwtVerify(
            token,
            new TextEncoder().encode(secret),
            { algorithms: ["HS256"] },
          );
          jwtUser = verifiedPayload;
        } catch (e: any) {
          // Handle token expiration
          if (e.code === "ERR_JWT_EXPIRED") return { user: null };
          throw e;
        }
        if (!jwtUser) return { user: null };
        const userCollection = "users";
        let user: User | null = null;

        const usersQuery = await payload.find({
          collection: userCollection,
          where: { [subFieldName]: { equals: jwtUser[subFieldName] } },
        });

        if (!usersQuery.docs.length) throw new Error(`no matching sub: ${jwtUser.sub}`)
        user = { ...usersQuery.docs[0], collection: userCollection }

        // Return the user object
        return { user };
      } catch (e) {
        payload.logger.error(e);
        return { user: null };
      }
    },
  };

  return authStrategy;
};
