export interface Environment {
  readonly MARKETS: KVNamespace;
  readonly ANCHOR_PROVIDER_URL: string;
  readonly POPULATE_MARKETS: Queue;
}

declare global {
  function getMiniflareBindings(): Environment;
}

export interface MessageRequest {
  url: string;
  requestInit: RequestInit;
  type: string;
}

export type MessageSendRequest<Body = any> = {
  body: Body;
};
