import {
  customAction,
  customCtx,
  customMutation,
  customQuery,
} from "convex-helpers/server/customFunctions";

import {
  action,
  mutation,
  query,
  type ActionCtx,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";
import { UserId } from "type";

export type AuthQueryCtx = QueryCtx & { userId: UserId };
export type AuthMutationCtx = MutationCtx & { userId: UserId };
export type AuthActionCtx = ActionCtx & { userId: UserId };

export async function AuthenticationRequired({
  ctx,
}: {
  ctx: QueryCtx | MutationCtx | ActionCtx;
}) {
  const userId = await getAuthUserId(ctx);

  if (userId === null) {
    throw new ConvexError("Not authenticated!");
  }

  return userId;
}

export const authQuery = customQuery(
  query,
  customCtx(async (ctx) => {
    const userId = await AuthenticationRequired({ ctx });
    return { userId };
  }),
);

export const authMutation = customMutation(
  mutation,
  customCtx(async (ctx) => {
    const userId = await AuthenticationRequired({ ctx });
    return { userId };
  }),
);

export const authAction = customAction(
  action,
  customCtx(async (ctx) => {
    const userId = await AuthenticationRequired({ ctx });
    return { userId };
  }),
);
