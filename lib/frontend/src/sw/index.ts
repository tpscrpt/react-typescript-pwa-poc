import { precacheAndRoute } from "workbox-precaching";
import "./handlers";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
precacheAndRoute(self.__WB_MANIFEST);

console.log("included sw");
