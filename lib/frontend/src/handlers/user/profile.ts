import { registerRoute } from "workbox-routing";
import { RouteHandlerCallback, RouteMatchCallback, RouteHandlerCallbackOptions } from "workbox-core";
import { BackgroundSyncPlugin, Queue } from "workbox-background-sync";
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from "workbox-strategies";
import { WorkboxError } from "workbox-core/_private";
import { OnSyncCallback } from "workbox-background-sync/Queue";

const userProfileRequestMatcher = (method: "GET" | "POST"): RouteMatchCallback => ({ request, url }): boolean => {
  if (!url.pathname.startsWith("/user/profile?userId=") || request.method !== method) return false;

  const userId = url.searchParams.get("userId");

  if (!userId) return false;

  return true;
};

const postMatcher = userProfileRequestMatcher("POST");
const getMatcher = userProfileRequestMatcher("GET");

const postOnSync: OnSyncCallback = async ({ queue }) => {};

const queue = new Queue("POST user/profile", { onSync: postOnSync });

const postHandler: RouteHandlerCallback = async ({ event, params, url, request }): Promise<Response> => {
  const userId = url?.searchParams.get("userId");
  const currentUserId = localStorage.getItem("userId");

  if (userId !== currentUserId) throw new WorkboxError("USER_PROFILE_POST_UNAUTHORIZED");

  if (typeof request === "string") throw new WorkboxError("WTF IS THIS?");

  queue.pushRequest({ timestamp: Date.now(), request });

  const userProfileCache = await caches.open(`user/profile?userId=${userId}`);

  userProfileCache.put(request, response);

  return new NetworkFirst({
    //cacheName: `user/profile?userId=${userId}`,
    plugins: [new BackgroundSyncPlugin("POST user/profile", { onSync: postOnSync })],
  }).handle(event);
};

const getHandler = async ({ url, event }: RouteHandlerCallbackOptions): Promise<Response> => {
  const userId = url?.searchParams.get("userId");
  const currentUserId = localStorage.getItem("userId");

  if (currentUserId === userId)
    return new NetworkFirst({
      cacheName: `user/profile?userId=${userId}`,
    }).handle(event);

  return new StaleWhileRevalidate({ cacheName: `user/profile?userId=${userId}` }).handle(event);
};

registerRoute(postMatcher, postHandler, "POST");
registerRoute(getMatcher, getHandler, "GET");
