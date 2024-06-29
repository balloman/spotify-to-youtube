import { extractSpotifyInfo } from "./spotify-extractor";

// biome-ignore lint/style/noVar: <explanation>
declare var self: Worker;

self.onmessage = async (
  event: MessageEvent<OurMessageEvent<MessageEventTypes>>,
) => {
  console.log("Worker received message", event);
  const data = event.data;
  if (data.type === "authorization") {
    const typedData = data as AuthorizationEvent;
    await extractSpotifyInfo(typedData.data.code);
  }
};

export type MessageEventTypes = "authorization";

type OurMessageEvent<T extends MessageEventTypes> = {
  type: T;
};

export interface AuthorizationEvent extends OurMessageEvent<"authorization"> {
  data: {
    code: string;
  };
}
