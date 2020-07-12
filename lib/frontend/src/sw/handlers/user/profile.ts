import { registerRoute } from "workbox-routing";
import { RouteHandlerCallback, RouteMatchCallback, RouteHandlerCallbackOptions } from "workbox-core";
import { BackgroundSyncPlugin } from "workbox-background-sync";
import { NetworkFirst, StaleWhileRevalidate } from "workbox-strategies";
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

type UserProfilePostBody = {
  name: string;
  profilePicture: string;
  bio: string;
};

const postOnSync = (url: string): OnSyncCallback => async ({ queue }) => {
  const calls = (await queue.getAll()).sort((call1, call2) => {
    if (!call1.timestamp || !call2.timestamp) throw new WorkboxError("queue-replay-failed", { name: queue.name });

    return call1.timestamp - call2.timestamp;
  });

  const jsons = await Promise.all(calls.map(async (call) => await call.request.json()));

  const body = JSON.stringify(jsons.reduce<Partial<UserProfilePostBody>>((_body, json) => ({ ..._body, ...json }), {}));

  await fetch(url, {
    body,
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  }).catch(() => {
    throw new WorkboxError("queue-replay-failed", { name: queue.name });
  });
};

const postHandler: RouteHandlerCallback = async ({ event, url, request }): Promise<Response> => {
  const userId = url?.searchParams.get("userId");
  const currentUserId = localStorage.getItem("userId");

  if (userId !== currentUserId) throw new WorkboxError("USER_PROFILE_POST_UNAUTHORIZED");

  if (typeof request === "string") throw new WorkboxError("WTF IS THIS?");

  const userProfileCache = await caches.open(`user/profile?userId=${userId}`);

  const _request = new Request(request.url, {
    method: "GET",
  });

  const userProfileResponse = await userProfileCache.match(_request);

  const userProfileResponseBody = await userProfileResponse?.json();

  const _response = new Response(
    JSON.stringify({
      ...userProfileResponseBody,
      ...(await request.json()),
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );

  userProfileCache.put(_request, _response);

  return new NetworkFirst({
    cacheName: `user/profile?userId=${userId}`,
    plugins: [new BackgroundSyncPlugin("POST user/profile", { onSync: postOnSync(request.url) })],
  }).handle(event);
};

const getHandler = async ({ url, event }: RouteHandlerCallbackOptions): Promise<Response> => {
  const userId = url?.searchParams.get("userId");

  return new StaleWhileRevalidate({
    cacheName: `user/profile?userId=${userId}`,
  }).handle(event);
};

registerRoute(postMatcher, postHandler, "POST");
registerRoute(getMatcher, getHandler, "GET");
