import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";
import { Environment, MessageSendRequest } from "./types";
import { markets } from "./markets/routes";
import { getMarketCard, getMarketsAddresses } from "./markets/service";
import * as marketModel from "./markets/model";
const app = new Hono();
app.use("*", prettyJSON());
app.get("/", (c) => c.text("Tinbet API"));
app.notFound((c) => c.json({ message: "Not Found", ok: false }, 404));
app.route("/markets", markets);

const updateMarkets = async (env: Environment) => {
  const marketAddresses: string[] = await getMarketsAddresses(env);
  await marketModel.updateMarketAddresses(env.MARKETS, marketAddresses);
  const batch: MessageSendRequest[] = marketAddresses.map((value) => ({
    body: JSON.stringify(value),
  }));
  // @ts-ignore
  await env.POPULATE_MARKETS.sendBatch(batch);
};

export default {
  fetch: app.fetch,
  scheduled: async (event, env: Environment, ctx: ExecutionContext) => {
    ctx.waitUntil(updateMarkets(env));
  },
  async queue(batch: MessageBatch, env: Environment, ctx: ExecutionContext) {
    for (const message of batch.messages) {
      try {
        const marketAddress = JSON.parse(message.body as string);
        const marketCard = await getMarketCard(marketAddress, env);
        if (marketCard) {
          await marketModel.updateMarketCard(env.MARKETS, marketCard);
        }
      } catch (e) {
        console.error(e);
      }
    }
  },
};
